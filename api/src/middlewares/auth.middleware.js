// auth.middleware.js
// Verifica se o token JWT é válido antes de liberar a rota

import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  // Pega o token do cabeçalho Authorization
  // O token vem no formato: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Faça login para continuar.',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verifica se o token é válido usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Salva o ID do usuário na requisição para usar nos controllers
    req.userId = decoded.id
    req.userRole = decoded.role

    // Chama o próximo middleware ou controller
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado.',
    })
  }
}

// Middleware extra — verifica se é admin
export function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso restrito a administradores.',
    })
  }
  next()
}