// AuthContext.jsx
// Gerencia o estado de autenticação em toda a aplicação

import { createContext, useContext, useState, useEffect } from 'react'
import { login, register, logout, getStoredUser } from '../services/authService.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Começa com o usuário já salvo no localStorage (se houver)
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Limpa o erro após 4 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  async function handleLogin(email, password) {
    try {
      setLoading(true)
      setError(null)
      const data = await login(email, password)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(userData) {
    try {
      setLoading(true)
      setError(null)
      const data = await register(userData)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer cadastro.')
      return false
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
      handleLogin,
      handleRegister,
      handleLogout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}