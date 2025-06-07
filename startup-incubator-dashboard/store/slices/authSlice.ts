import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accessToken: null,
  role: null,
  expires_in: null,
  expires_at: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.role = action.payload.role
      state.expires_in = action.payload.expires_in
      state.expires_at = action.payload.expires_at
      state.isAuthenticated = true
      
    },
    logout: (state) => {
      state.accessToken = null
      state.role = null
      state.expires_in = null
      state.expires_at = null
      state.isAuthenticated = false
    }
  }
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer