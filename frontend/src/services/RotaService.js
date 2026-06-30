import { api } from './api'

export const RotaService = {
  listarTodos: async () => {
    const response = await api.get('/rotas')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/rotas/${codigo}`)
    return response.data
  },

  cadastrar: async (dados) => {
    const response = await api.post('/rotas', dados)
    return response.data
  },

  atualizar: async (codigo, dados) => {
    const response = await api.put(`/rotas/${codigo}`, dados)
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/rotas/${codigo}`)
    return response.data
  }
}
