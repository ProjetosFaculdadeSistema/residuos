import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/authSlice'

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// injeta o token JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// se o token expirou, faz logout automático
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)
