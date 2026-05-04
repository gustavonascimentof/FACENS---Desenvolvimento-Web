// CartContext.jsx
// Aqui fica toda a lógica do carrinho de compras

import { createContext, useContext, useState } from 'react'

// 1. Cria o "contexto" — é como uma caixa que guarda os dados do carrinho
const CartContext = createContext()

// 2. Provider — componente que ENVOLVE a aplicação e disponibiliza o carrinho
export function CartProvider({ children }) {
  // "items" é a lista de produtos no carrinho
  // Cada item tem: id, name, price, quantity, image
  const [items, setItems] = useState([])

  // ➕ Adicionar produto ao carrinho
  function addItem(product) {
    setItems(prev => {
      // Verifica se o produto já está no carrinho
      const exists = prev.find(item => item.id === product.id)

      if (exists) {
        // Se já existe, apenas aumenta a quantidade
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // Se não existe, adiciona com quantidade 1
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // ➖ Remover produto do carrinho
  function removeItem(productId) {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  // 🔢 Alterar quantidade de um produto
  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  // 🗑️ Limpar carrinho inteiro
  function clearCart() {
    setItems([])
  }

  // 💰 Calcular total de itens (para o badge do carrinho)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // 💵 Calcular valor total
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )

  // Tudo que o contexto disponibiliza para a aplicação
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

// 3. Hook customizado — facilita usar o carrinho em qualquer componente
// Em vez de escrever useContext(CartContext), escrevemos só useCart()
export function useCart() {
  return useContext(CartContext)
}