import { api } from './api'

export const VeiculoService = {
  listarTodos: async () => {
    const response = await api.get('/veiculos')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/veiculos/${codigo}`)
    return response.data
  },

  cadastrar: async (dados, foto) => {
    const formData = new FormData()
    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }))
    if (foto) formData.append('foto', foto)
    const response = await api.post('/veiculos', formData, { headers: { 'Content-Type': null } })
    return response.data
  },

  atualizar: async (codigo, dados, foto) => {
    const formData = new FormData()
    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }))
    if (foto) formData.append('foto', foto)
    const response = await api.put(`/veiculos/${codigo}`, formData, { headers: { 'Content-Type': null } })
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/veiculos/${codigo}`)
    return response.data
  }
}
