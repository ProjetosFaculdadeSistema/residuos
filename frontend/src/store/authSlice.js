import { createSlice } from '@reduxjs/toolkit'

// recupera token e dados do usuário salvos no localStorage.
// isso garante que, ao recarregar a página, o usuário continue logado
// e a navbar continue mostrando nome e foto corretamente.
const tokenSalvo = localStorage.getItem('token')
const usuarioSalvo = localStorage.getItem('usuario')
  ? JSON.parse(localStorage.getItem('usuario'))
  : null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!tokenSalvo,
    token: tokenSalvo || null,
    usuario: usuarioSalvo
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.usuario = action.payload.usuario || null
      // persiste o usuario no localStorage para sobreviver ao reload da página
      if (action.payload.usuario) {
        localStorage.setItem('usuario', JSON.stringify(action.payload.usuario))
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.usuario = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
