import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { tokenStore } from '../api/client.js'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  // Only "loading" if there's a token to validate; otherwise resolve immediately.
  const [loading, setLoading] = useState(() => !!tokenStore.get())

  // On mount: if a token exists, validate it via /me.
  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!tokenStore.get()) {
        setLoading(false)
        return
      }
      try {
        const { admin } = await authApi.getMe()
        if (active) setAdmin(admin)
      } catch {
        tokenStore.clear()
      } finally {
        if (active) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, admin } = await authApi.login(email, password)
    tokenStore.set(token)
    setAdmin(admin)
    return admin
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setAdmin(null)
  }, [])

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    login,
    logout,
    setAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>')
  return ctx
}
