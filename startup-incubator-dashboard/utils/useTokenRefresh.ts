import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import axios from 'axios'
import { setAuth } from '@/store/slices/authSlice'

let refreshTimer: NodeJS.Timeout | null = null

const setupTokenRefreshTimer = (refreshTime: number, callback: () => void) => {
  clearTokenRefreshTimer()
  refreshTimer = setTimeout(callback, refreshTime)
}

const clearTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

const refreshAccessToken = async (dispatch: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh-token`,
      {},
      { withCredentials: true }
    )

    const { access_token, expires_in, role } = response.data

    dispatch(setAuth({
      accessToken: access_token,
      expires_in,
      role,
      isAuthenticated: true,
    }))
    console.log(access_token);
    
    
    setupTokenRefreshTimer(14 * 60 * 1000, () => {
      refreshAccessToken(dispatch)
    })
  } catch (err) {
    console.error('❌ Token refresh failed', err)
  }
}

export const useTokenRefresh = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    
    if (isAuthenticated) {
      setupTokenRefreshTimer(14 * 60 * 1000, () => {
        refreshAccessToken(dispatch)
      })
    }

    return () => {
      clearTokenRefreshTimer()
    }
  }, [isAuthenticated, dispatch])
}
