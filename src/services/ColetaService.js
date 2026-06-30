import { api } from './api'

const ColetaService = {
  listarTodos: async () => {
    const response = await api.get('/coletas')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/coletas/${codigo}`)
    return response.data
  },

  cadastrar: async (dados) => {
    const response = await api.post('/coletas', dados)
    return response.data
  },

  atualizar: async (codigo, dados) => {
    const response = await api.put(`/coletas/${codigo}`, dados)
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/coletas/${codigo}`)
    return response.data
  }
}

export default ColetaService
