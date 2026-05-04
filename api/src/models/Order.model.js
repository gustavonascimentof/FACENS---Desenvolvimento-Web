// Order.model.js
// Define como um pedido é salvo no banco

import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    // Referência ao usuário que fez o pedido
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Lista de itens do pedido
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,   // Guardamos o nome para histórico
        price: Number,  // Guardamos o preço no momento da compra
        quantity: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    // Status do pedido
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // Localização de entrega dentro do campus
    deliveryLocation: {
      type: String,
      default: '',
    },
    // Número do WhatsApp para contato
    whatsapp: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Order', orderSchema)