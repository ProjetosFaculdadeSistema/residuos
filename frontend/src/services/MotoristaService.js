import { api } from './api'

export const MotoristaService = {
  listarTodos: async () => {
    const response = await api.get('/motoristas')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/motoristas/${codigo}`)
    return response.data
  },

  cadastrar: async (dados, foto) => {
    const formData = new FormData()
    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }))
    if (foto) formData.append('foto', foto)
    const response = await api.post('/motoristas', formData, { headers: { 'Content-Type': null } })
    return response.data
  },

  atualizar: async (codigo, dados, foto) => {
    const formData = new FormData()
    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }))
    if (foto) formData.append('foto', foto)
    const response = await api.put(`/motoristas/${codigo}`, formData, { headers: { 'Content-Type': null } })
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/motoristas/${codigo}`)
    return response.data
  }
}
