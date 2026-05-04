// CheckoutModal.jsx
// Tela de finalização do pedido

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/orderService.js'

// Número do WhatsApp da loja — troque pelo número real!
const STORE_WHATSAPP = '5515996963989'

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, totalPrice, clearCart } = useCart()
  const { isLoggedIn, user } = useAuth()

  const [step, setStep] = useState(1) // 1 = dados, 2 = confirmado
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    deliveryLocation: '',
    whatsapp: user?.phone || '',
    note: '',
  })

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function formatPrice(value) {
    return value.toFixed(2).replace('.', ',')
  }

  // Monta a mensagem formatada para o WhatsApp
  function buildWhatsAppMessage() {
    const itemsList = items
      .map(item =>
        `• ${item.name} x${item.quantity} — R$ ${formatPrice(item.price * item.quantity)}`
      )
      .join('\n')

    return encodeURIComponent(
      `🍦 *NOVO PEDIDO — CONE TRUFADO*\n\n` +
      `👤 *Cliente:* ${user?.name || 'Visitante'}\n` +
      `📱 *WhatsApp:* ${formData.whatsapp}\n` +
      `📍 *Local de entrega:* ${formData.deliveryLocation}\n` +
      (formData.note ? `📝 *Obs:* ${formData.note}\n` : '') +
      `\n*Itens do pedido:*\n${itemsList}\n\n` +
      `💰 *Total: R$ ${formatPrice(totalPrice)}*`
    )
  }

  async function handleFinish(e) {
    e.preventDefault()

    if (!formData.deliveryLocation.trim()) {
      setError('Informe o local de entrega.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Salva o pedido no banco de dados
      await createOrder({
        items: items.map(item => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
        deliveryLocation: formData.deliveryLocation,
        whatsapp: formData.whatsapp,
      })

      // Abre o WhatsApp com a mensagem formatada
      window.open(
        `https://wa.me/${STORE_WHATSAPP}?text=${buildWhatsAppMessage()}`,
        '_blank'
      )

      // Limpa o carrinho e vai para tela de confirmação
      clearCart()
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao finalizar pedido.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setStep(1)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-full max-w-md z-50
        bg-[#111] border border-[#2a2a2a]
        shadow-[0_0_40px_rgba(255,215,0,0.1)]
        max-h-[90vh] overflow-y-auto
      ">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a] sticky top-0 bg-[#111] z-10">
          <h2 className="font-arcade text-yellow-400 text-sm">
            {step === 1 ? 'FINALIZAR PEDIDO' : 'PEDIDO ENVIADO!'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-yellow-400 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* ── STEP 1 — FORMULÁRIO ── */}
        {step === 1 && (
          <form onSubmit={handleFinish} className="p-6 space-y-5">

            {/* Resumo do pedido */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 space-y-2">
              <p className="font-arcade text-[9px] text-yellow-400 mb-3">
                RESUMO DO PEDIDO
              </p>
              {items.map(item => (
                <div key={item.id} className="flex justify-between font-body text-sm">
                  <span className="text-gray-400">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-white">
                    R$ {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#2a2a2a] pt-2 mt-2 flex justify-between">
                <span className="text-white font-body font-bold">Total</span>
                <span className="text-yellow-400 font-arcade text-sm">
                  R$ {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="border border-red-500 bg-red-500 bg-opacity-10 px-4 py-3">
                <p className="text-red-400 font-body text-sm">{error}</p>
              </div>
            )}

            {/* Local de entrega */}
            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                📍 Local de entrega *
              </label>
              <input
                type="text"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleChange}
                placeholder="Ex: Bloco A, Sala 203"
                required
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 transition-all placeholder-gray-700
                "
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                📱 Seu WhatsApp *
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                required
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 transition-all placeholder-gray-700
                "
              />
            </div>

            {/* Observação */}
            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                📝 Observação (opcional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Alguma preferência especial?"
                rows={2}
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none resize-none
                  focus:border-yellow-400 transition-all placeholder-gray-700
                "
              />
            </div>

            {/* Aviso de login */}
            {!isLoggedIn && (
              <div className="border border-yellow-400 border-opacity-30
                bg-yellow-400 bg-opacity-5 px-4 py-3">
                <p className="text-yellow-400 font-body text-xs">
                  ⚠️ Faça login para salvar seu histórico de pedidos.
                </p>
              </div>
            )}

            {/* Botão finalizar */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="
                w-full bg-green-500 hover:bg-green-400 text-black
                font-arcade text-[10px] py-4 transition-all
                hover:scale-[1.02] active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                flex items-center justify-center gap-2
              "
            >
              {loading ? 'PROCESSANDO...' : '📱 CONFIRMAR VIA WHATSAPP'}
            </button>

            <p className="text-center text-gray-600 font-body text-xs">
              Você será redirecionado para o WhatsApp para confirmar o pedido.
            </p>

          </form>
        )}

        {/* ── STEP 2 — CONFIRMAÇÃO ── */}
        {step === 2 && (
          <div className="p-8 text-center space-y-6">

            {/* Ícone de sucesso animado */}
            <div className="flex justify-center">
              <div
                className="w-20 h-20 bg-yellow-400"
                style={{
                  borderRadius: '50% 50% 50% 0%',
                  animation: 'chomp 0.4s infinite alternate'
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-arcade text-yellow-400 text-sm">
                PEDIDO ENVIADO!
              </h3>
              <p className="text-gray-400 font-body text-sm leading-relaxed">
                Seu pedido foi registrado e enviado pelo WhatsApp.
                Aguarde a confirmação da loja! 🎉
              </p>
            </div>

            {/* Passos do que acontece agora */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 text-left space-y-3">
              <p className="font-arcade text-[9px] text-yellow-400 mb-3">
                O QUE ACONTECE AGORA?
              </p>
              {[
                '📱 Confirmamos seu pedido pelo WhatsApp',
                '🍦 Preparamos seu cone com carinho',
                '🚀 Entregamos no local indicado',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-yellow-400 font-arcade text-[10px] mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-gray-400 font-body text-sm">{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              className="
                w-full bg-yellow-400 text-black font-arcade text-[10px]
                py-4 hover:bg-yellow-300 transition-all hover:scale-[1.02]
              "
            >
              ▶ VOLTAR À LOJA
            </button>

          </div>
        )}

      </div>
    </>
  )
}