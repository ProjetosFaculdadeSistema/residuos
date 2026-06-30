import { api } from './api'

export const authService = {
  login: async (dados) => {
    const response = await api.post('/auth/login', dados)
    return response.data
  },

  registrar: async (dados, foto) => {
    const formData = new FormData()
    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    )
    if (foto) {
      formData.append('foto', foto)
    }
    const response = await api.post('/auth/registrar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
