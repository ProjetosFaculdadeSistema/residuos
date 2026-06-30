import { api } from './api'

const ResiduoService = {
  listarTodos: async () => {
    const response = await api.get('/residuos')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/residuos/${codigo}`)
    return response.data
  },

  cadastrar: async (dados, imagem) => {
    const formData = new FormData()
    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    )
    if (imagem) {
      formData.append('imagem', imagem)
    }
    const response = await api.post('/residuos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  atualizar: async (codigo, dados, imagem) => {
    const formData = new FormData()
    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    )
    if (imagem) {
      formData.append('imagem', imagem)
    }
    const response = await api.put(`/residuos/${codigo}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/residuos/${codigo}`)
    return response.data
  }
}

export default ResiduoService
