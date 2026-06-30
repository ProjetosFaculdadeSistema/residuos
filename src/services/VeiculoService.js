import { api } from './api'

const VeiculoService = {
  listarTodos: async () => {
    const response = await api.get('/veiculos')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/veiculos/${codigo}`)
    return response.data
  },

  cadastrar: async (dados) => {
    const response = await api.post('/veiculos', dados)
    return response.data
  },

  atualizar: async (codigo, dados) => {
    const response = await api.put(`/veiculos/${codigo}`, dados)
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/veiculos/${codigo}`)
    return response.data
  }
}

export default VeiculoService
