import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/authSlice'

// instância centralizada do axios — todas as chamadas partem daqui
// assim qualquer mudança de baseURL ou timeout afeta o projeto todo
export const api = axios.create({
  // em producao o Render injeta VITE_API_URL; localmente cai no localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// interceptor de request: injeta o JWT no header de toda requisição
// lê direto do Redux para sempre pegar o token mais atual
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// interceptor de response: se o backend retornar 401, o token expirou
// ou é inválido — despacha logout para limpar o estado e redirecionar o usuário
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)
