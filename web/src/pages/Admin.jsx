// Admin.jsx
// Dashboard administrativo completo

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminProductForm from '../components/AdminProductForm'
import api from '../services/api.js'
import { getAllOrders, updateOrderStatus } from '../services/orderService.js'
import AdminMetrics from '../components/AdminMetrics'

// Labels de status dos pedidos em português
const STATUS_LABELS = {
  pending:   { label: 'Pendente',    color: 'text-yellow-400 border-yellow-400' },
  confirmed: { label: 'Confirmado',  color: 'text-blue-400 border-blue-400' },
  preparing: { label: 'Preparando', color: 'text-orange-400 border-orange-400' },
  ready:     { label: 'Pronto',      color: 'text-green-400 border-green-400' },
  delivered: { label: 'Entregue',    color: 'text-gray-400 border-gray-400' },
  cancelled: { label: 'Cancelado',   color: 'text-red-400 border-red-400' },
}

export default function Admin() {
  const { isAdmin, isLoggedIn } = useAuth()

  // Aba ativa: 'products' ou 'orders'
  const [activeTab, setActiveTab] = useState('products')

  // Estados de produtos
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Estados de pedidos
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Carrega produtos ao montar
  useEffect(() => {
    fetchProducts()
  }, [])

  // Carrega pedidos ao trocar para a aba de pedidos
  useEffect(() => {
  if (activeTab === 'orders' || activeTab === 'metrics') fetchOrders()
  }, [activeTab])

  async function fetchProducts() {
    try {
      setLoadingProducts(true)
      const response = await api.get('/products')
      setProducts(response.data.data)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  async function fetchOrders() {
    try {
      setLoadingOrders(true)
      const data = await getAllOrders()
      setOrders(data)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return
    try {
      await api.delete(`/products/${id}`)
      // Remove da lista sem precisar recarregar tudo
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert('Erro ao remover produto.')
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus)
      // Atualiza só o pedido alterado na lista
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      )
    } catch (err) {
      alert('Erro ao atualizar status.')
    }
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts() // Recarrega a lista
  }

  // Proteção de rota — só admin pode ver
  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="font-arcade text-yellow-400 text-sm">ACESSO NEGADO</p>
        <p className="text-gray-500 font-body mt-3">Faça login para continuar.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="font-arcade text-red-400 text-sm">SEM PERMISSÃO</p>
        <p className="text-gray-500 font-body mt-3">
          Área restrita a administradores.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* CABEÇALHO DO ADMIN */}
      <div className="mb-8">
        <p className="text-yellow-400 font-arcade text-[9px] tracking-widest mb-2">
          ── PAINEL ADMIN ──
        </p>
        <h1 className="text-white font-arcade text-xl">
          DASHBOARD
        </h1>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Produtos', value: products.length, icon: '🍦' },
          { label: 'Pedidos', value: orders.length, icon: '📦' },
          {
            label: 'Pendentes',
            value: orders.filter(o => o.status === 'pending').length,
            icon: '⏳'
          },
          {
            label: 'Entregues',
            value: orders.filter(o => o.status === 'delivered').length,
            icon: '✅'
          },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4">
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-yellow-400 font-arcade text-xl">{value}</p>
            <p className="text-gray-500 font-body text-xs uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ABAS */}
      <div className="flex border-b border-[#2a2a2a] mb-6">
        {[
          { key: 'products', label: '🍦 PRODUTOS' },
          { key: 'orders',   label: '📦 PEDIDOS' },
          { key: 'metrics',  label: '📊 MÉTRICAS' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              px-6 py-3 font-arcade text-[9px] tracking-wider transition-all
              ${activeTab === key
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-600 hover:text-gray-400'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── ABA DE PRODUTOS ── */}
      {activeTab === 'products' && (
        <div>
          {/* Botão novo produto ou formulário */}
          {!showForm && !editingProduct ? (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 bg-yellow-400 text-black font-arcade text-[9px]
                px-6 py-3 hover:bg-yellow-300 transition-all hover:scale-105"
              style={{
                clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))'
              }}
            >
              + NOVO PRODUTO
            </button>
          ) : (
            // Formulário de criação ou edição
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 mb-6">
              <h3 className="font-arcade text-yellow-400 text-[10px] mb-4">
                {editingProduct ? '✏️ EDITANDO PRODUTO' : '+ NOVO PRODUTO'}
              </h3>
              <AdminProductForm
                product={editingProduct}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
              />
            </div>
          )}

          {/* Lista de produtos */}
          {loadingProducts ? (
            <p className="font-arcade text-[10px] text-gray-600 animate-pulse">
              CARREGANDO...
            </p>
          ) : (
            <div className="space-y-3">
              {products.map(product => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 bg-[#1a1a1a] border border-[#2a2a2a]
                    p-4 hover:border-yellow-400 transition-all group"
                >
                  {/* Imagem */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover flex-shrink-0"
                  />

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-body font-bold">{product.name}</p>
                      {product.featured && (
                        <span className="text-[8px] font-arcade text-yellow-400
                          border border-yellow-400 px-1">★</span>
                      )}
                      {!product.available && (
                        <span className="text-[8px] font-arcade text-red-400
                          border border-red-400 px-1">ESGOTADO</span>
                      )}
                    </div>
                    <p className="text-gray-500 font-body text-xs mt-1 truncate">
                      {product.description}
                    </p>
                    <p className="text-yellow-400 font-arcade text-[10px] mt-1">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setShowForm(false)
                      }}
                      className="px-3 py-2 border border-[#2a2a2a] text-gray-400
                        hover:border-yellow-400 hover:text-yellow-400
                        font-body text-xs transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-3 py-2 border border-[#2a2a2a] text-gray-400
                        hover:border-red-400 hover:text-red-400
                        font-body text-xs transition-all"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ABA DE PEDIDOS ── */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <p className="font-arcade text-[10px] text-gray-600 animate-pulse">
              CARREGANDO...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-arcade text-[10px] text-gray-600">
                NENHUM PEDIDO AINDA
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] p-5
                    hover:border-yellow-400 transition-all"
                >
                  {/* Cabeçalho do pedido */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-body font-bold">
                        {order.user?.name || 'Usuário'}
                      </p>
                      <p className="text-gray-500 font-body text-xs mt-1">
                        {order.user?.email} • {order.deliveryLocation || 'Local não informado'}
                      </p>
                      <p className="text-gray-600 font-body text-xs mt-1">
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    {/* Selector de status */}
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`
                        bg-[#0a0a0a] border px-3 py-2 font-arcade text-[8px]
                        outline-none cursor-pointer transition-all
                        ${STATUS_LABELS[order.status]?.color || 'text-gray-400 border-gray-400'}
                      `}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Itens do pedido */}
                  <div className="border-t border-[#2a2a2a] pt-3 space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm font-body">
                        <span className="text-gray-400">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-white">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-body font-bold pt-2
                      border-t border-[#2a2a2a] mt-2">
                      <span className="text-gray-400">Total</span>
                      <span className="text-yellow-400 font-arcade text-sm">
                        R$ {order.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    {/* ── ABA DE MÉTRICAS ── */}
    {activeTab === 'metrics' && (
     <AdminMetrics orders={orders} products={products} />
    )}
    </div>
  )
}