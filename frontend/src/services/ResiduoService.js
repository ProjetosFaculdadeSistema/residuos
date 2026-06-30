import { api } from './api'

export const ResiduoService = {
  listarTodos: async () => {
    const response = await api.get('/residuos')
    return response.data
  },

  buscarPorCodigo: async (codigo) => {
    const response = await api.get(`/residuos/${codigo}`)
    return response.data
  },

  // cadastro com imagem (multipart/form-data para o Cloudinary)
  cadastrar: async (dados, imagem) => {
    const formData = new FormData()
    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    )
    if (imagem) {
      formData.append('imagem', imagem)
    }
    // Sem Content-Type manual — o browser adiciona o boundary correto automaticamente
    const response = await api.post('/residuos', formData, {
      headers: { 'Content-Type': null }
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
      headers: { 'Content-Type': null }
    })
    return response.data
  },

  deletar: async (codigo) => {
    const response = await api.delete(`/residuos/${codigo}`)
    return response.data
  }
}
