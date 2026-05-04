// authService.js
// Funções de login, cadastro e logout

import api from './api.js'

// Cadastrar novo usuário
export async function register(userData) {
  const response = await api.post('/auth/register', userData)
  const { token, user } = response.data

  // Salva token e dados do usuário no navegador
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return response.data
}

// Login
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  const { token, user } = response.data

  // Salva token e dados do usuário no navegador
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return response.data
}

// Logout
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Verifica se há usuário logado
export function getStoredUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function getStoredToken() {
  return localStorage.getItem('token')
}