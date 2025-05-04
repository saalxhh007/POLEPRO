import axios from "axios"
import { store } from "@/store"

const api = axios.create()

api.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.accessToken
  if (token) {
    config.headers.Accept = 'application/json'
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
