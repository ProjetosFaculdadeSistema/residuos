import { api } from './api'

export const authService = {
  login: async (dados) => {
    const response = await api.post('/auth/login', dados)
    return response.data
  },

  registrar: async (dados, foto) => {
    // FormData porque precisamos enviar JSON + arquivo na mesma requisição (multipart/form-data)
    const formData = new FormData()
    // o backend espera a parte "dados" como JSON dentro do multipart
    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    )
    if (foto) {
      formData.append('foto', foto)
    }
    // NÃO definir Content-Type manualmente — se definido sem boundary, o Spring não consegue
    // separar as partes do multipart e o arquivo "foto" some. Deixando null, o browser
    // define automaticamente: "multipart/form-data; boundary=----XYZ..."
    const response = await api.post('/auth/registrar', formData, {
      headers: { 'Content-Type': null }
    })
    return response.data
  }
}
