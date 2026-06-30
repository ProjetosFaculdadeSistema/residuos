import { createSlice } from '@reduxjs/toolkit'

const tokenSalvo = localStorage.getItem('token')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!tokenSalvo,
    token: tokenSalvo || null,
    usuario: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.usuario = action.payload.usuario || null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.usuario = null
      localStorage.removeItem('token')
    }
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
