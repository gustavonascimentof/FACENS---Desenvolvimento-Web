// api.js
// Configuração central do cliente HTTP

import axios from 'axios'

// Cria uma instância do axios com configurações padrão
const api = axios.create({
  // URL base do backend — todas as requisições começam aqui
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// INTERCEPTOR DE REQUISIÇÃO
// Roda antes de TODA requisição enviada
// Serve para adicionar o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    // Busca o token salvo no localStorage
    const token = localStorage.getItem('token')

    if (token) {
      // Adiciona o token no cabeçalho Authorization
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// INTERCEPTOR DE RESPOSTA
// Roda depois de TODA resposta recebida
// Serve para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o token expirou ou é inválido, desloga o usuário
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api