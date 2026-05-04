// MyOrders.jsx
// Histórico de pedidos do usuário logado

import { useState, useEffect } from 'react'
import { getMyOrders } from '../services/orderService.js'
import { useAuth } from '../context/AuthContext'

const STATUS_LABELS = {
  pending:   { label: '⏳ Pendente',    color: 'text-yellow-400' },
  confirmed: { label: '✅ Confirmado',  color: 'text-blue-400' },
  preparing: { label: '👨‍🍳 Preparando', color: 'text-orange-400' },
  ready:     { label: '🎉 Pronto!',     color: 'text-green-400' },
  delivered: { label: '📦 Entregue',    color: 'text-gray-400' },
  cancelled: { label: '❌ Cancelado',   color: 'text-red-400' },
}

export default function MyOrders() {
  const { isLoggedIn } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoggedIn) fetchOrders()
  }, [isLoggedIn])

  async function fetchOrders() {
    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(value) {
    return value.toFixed(2).replace('.', ',')
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-arcade text-yellow-400 text-sm mb-3">
          FAÇA LOGIN
        </p>
        <p className="text-gray-500 font-body">
          Para ver seus pedidos você precisa estar logado.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      {/* Cabeçalho */}
      <div className="mb-8">
        <p className="text-yellow-400 font-arcade text-[9px] tracking-widest mb-2">
          ── HISTÓRICO ──
        </p>
        <h1 className="text-white font-arcade text-xl">
          MEUS PEDIDOS
        </h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <p className="font-arcade text-[10px] text-gray-600 animate-pulse">
            CARREGANDO...
          </p>
        </div>
      )}

      {/* Sem pedidos */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-20 border border-[#2a2a2a] border-dashed">
          <p className="font-arcade text-[10px] text-gray-600 mb-2">
            NENHUM PEDIDO AINDA
          </p>
          <p className="text-gray-600 font-body text-sm">
            Seu histórico de pedidos aparece aqui 🍦
          </p>
        </div>
      )}

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id}
            className="bg-[#1a1a1a] border border-[#2a2a2a]
              hover:border-yellow-400 transition-all p-5">

            {/* Cabeçalho do pedido */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 font-body text-xs">
                  {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
                <p className="text-gray-400 font-body text-xs mt-1">
                  📍 {order.deliveryLocation || 'Local não informado'}
                </p>
              </div>
              {/* Badge de status */}
              <span className={`
                font-body text-xs font-bold
                ${STATUS_LABELS[order.status]?.color || 'text-gray-400'}
              `}>
                {STATUS_LABELS[order.status]?.label || order.status}
              </span>
            </div>

            {/* Itens */}
            <div className="space-y-1 border-t border-[#2a2a2a] pt-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between font-body text-sm">
                  <span className="text-gray-400">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-white">
                    R$ {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-[#2a2a2a] mt-2">
                <span className="text-gray-400 font-body font-bold text-sm">Total</span>
                <span className="text-yellow-400 font-arcade text-sm">
                  R$ {formatPrice(order.totalPrice)}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}