// CartDrawer.jsx — agora abre o CheckoutModal

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const { isLoggedIn } = useAuth()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  function formatPrice(value) {
    return value.toFixed(2).replace('.', ',')
  }

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-60 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* DRAWER */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-sm z-50
        bg-[#111] border-l border-[#2a2a2a] flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <div>
            <h2 className="font-arcade text-yellow-400 text-sm">CARRINHO</h2>
            <p className="text-gray-500 font-body text-xs mt-1">
              {items.length === 0
                ? 'Nenhum item ainda'
                : `${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* LISTA DE ITENS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Carrinho vazio */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div
                className="w-16 h-16 bg-yellow-400 opacity-30"
                style={{ borderRadius: '50% 50% 50% 0%' }}
              />
              <p className="font-arcade text-[10px] text-gray-600 leading-relaxed">
                SEU CARRINHO<br />ESTÁ VAZIO
              </p>
              <p className="text-gray-600 font-body text-sm">
                Adicione um cone no cardápio 🍦
              </p>
            </div>
          )}

          {/* Itens */}
          {items.map(item => (
            <div key={item.id} className="flex gap-3 bg-[#1a1a1a] border border-[#2a2a2a] p-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-body font-bold text-sm truncate">
                  {item.name}
                </p>
                <p className="text-yellow-400 font-arcade text-[10px] mt-1">
                  R$ {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 bg-[#2a2a2a] hover:bg-yellow-400 hover:text-black
                      text-white font-bold text-sm transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="font-arcade text-[10px] text-white w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 bg-[#2a2a2a] hover:bg-yellow-400 hover:text-black
                      text-white font-bold text-sm transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-gray-600 hover:text-red-400 transition-colors text-xs font-body"
                  >
                    remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RODAPÉ */}
        {items.length > 0 && (
          <div className="border-t border-[#2a2a2a] p-5 space-y-4">

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400 font-body text-sm">
                <span>Subtotal</span>
                <span>R$ {formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-body text-sm">
                <span>Entrega</span>
                <span className="text-green-400">Grátis 🎉</span>
              </div>
              <div className="flex justify-between border-t border-[#2a2a2a] pt-2">
                <span className="text-white font-body font-bold">Total</span>
                <span className="text-yellow-400 font-arcade text-sm">
                  R$ {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Botão finalizar */}
            <button
              onClick={() => {
                onClose()        // Fecha o drawer
                setTimeout(() => setCheckoutOpen(true), 300) // Abre o checkout
              }}
              className="w-full bg-green-500 hover:bg-green-400 text-black
                font-arcade text-[10px] py-4 transition-all
                hover:scale-[1.02] active:scale-95
                flex items-center justify-center gap-2"
            >
              <span>📱</span> FINALIZAR PEDIDO
            </button>

          </div>
        )}
      </div>

      {/* Modal de checkout */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  )
}