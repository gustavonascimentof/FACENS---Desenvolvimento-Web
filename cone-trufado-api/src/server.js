// server.js
// Ponto de entrada — configura e inicia o servidor Express

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'  
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'

// Carrega as variáveis do arquivo .env
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

// ── MIDDLEWARES GLOBAIS ──────────────────────────────
// Permite requisições do frontend (React)
app.use(cors())

// Permite receber JSON no corpo das requisições
app.use(express.json())

// ── ROTAS ────────────────────────────────────────────
app.use('/api/auth', authRoutes)   
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Rota de verificação — confirma que o servidor está rodando
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🍦 Cone Trufado API rodando!',
    timestamp: new Date().toISOString(),
  })
})

// ── CONEXÃO COM O BANCO ──────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado!')
    // Só inicia o servidor após conectar ao banco
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
      console.log(`🍦 Cone Trufado API pronta!`)
    })
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar no MongoDB:', error.message)
    process.exit(1)
  })