// User.model.js
// Define como um usuário é salvo no banco de dados

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true, // Remove espaços extras
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true, // Não permite dois usuários com mesmo email
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    },
    // Papel do usuário — "user" é cliente comum, "admin" é administrador
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  {
    // Adiciona automaticamente createdAt e updatedAt
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)