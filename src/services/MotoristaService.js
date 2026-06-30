import { api } from './api'

const MotoristaService = {
  listarTodos: async () => {
    const response = await api.get('/motoristas')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/motoristas/${codigo}`)
    return response.data
  },

  cadastrar: async (dados) => {
    const response = await api.post('/motoristas', dados)
    return response.data
  },

  atualizar: async (codigo, dados) => {
    const response = await api.put(`/motoristas/${codigo}`, dados)
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/motoristas/${codigo}`)
    return response.data
  }
}

export default MotoristaService
