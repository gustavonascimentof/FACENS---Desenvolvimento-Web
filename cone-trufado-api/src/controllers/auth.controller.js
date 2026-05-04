// auth.controller.js
// Lógica de cadastro e login de usuários

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'

// Função auxiliar — gera o token JWT
function generateToken(user) {
  return jwt.sign(
    // Dados que ficam dentro do token
    { id: user._id, role: user.role },
    // Chave secreta do .env
    process.env.JWT_SECRET,
    // Token expira em 7 dias
    { expiresIn: '7d' }
  )
}

// POST /api/auth/register — Cadastrar novo usuário
export async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body

    // Verifica se já existe usuário com esse email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado.',
      })
    }

    // Criptografa a senha antes de salvar
    // O número 12 é o "salt rounds" — quanto maior, mais seguro (e mais lento)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Cria o usuário no banco
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    })

    // Gera o token para o usuário já ficar logado após cadastro
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar cadastro.',
    })
  }
}

// POST /api/auth/login — Login do usuário
export async function login(req, res) {
  try {
    const { email, password } = req.body

    // Busca o usuário pelo email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      })
    }

    // Compara a senha digitada com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      })
    }

    // Gera o token de autenticação
    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar login.',
    })
  }
}

// GET /api/auth/me — Retorna dados do usuário logado
export async function getMe(req, res) {
  try {
    // req.userId vem do middleware de autenticação
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.',
      })
    }

    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário.',
    })
  }
}