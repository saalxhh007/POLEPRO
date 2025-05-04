import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accessToken: null,
  role: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.role = action.payload.role
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.accessToken = null
      state.role = null
      state.isAuthenticated = false
    }
  }
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer