// AdminMetrics.jsx
// Painel de métricas e relatórios do admin

export default function AdminMetrics({ orders, products }) {

  // ── CÁLCULOS DAS MÉTRICAS ──────────────────────────

  // Faturamento total (só pedidos entregues)
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0)

  // Faturamento geral (todos os pedidos exceto cancelados)
  const totalBilling = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0)

  // Ticket médio por pedido
  const avgTicket = orders.length > 0
    ? totalBilling / orders.filter(o => o.status !== 'cancelled').length
    : 0

  // Conta quantas vezes cada produto foi pedido
  const productCount = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      const name = item.name
      productCount[name] = (productCount[name] || 0) + item.quantity
    })
  })

  // Produto mais vendido
  const bestSeller = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])[0]

  // Pedidos agrupados por status
  const byStatus = {
    pending:   orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready:     orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  // Top 5 produtos mais vendidos
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Formata preço
  function formatPrice(value) {
    return value.toFixed(2).replace('.', ',')
  }

  return (
    <div className="space-y-8">

      {/* ── CARDS DE MÉTRICAS PRINCIPAIS ── */}
      <div>
        <p className="font-arcade text-[9px] text-yellow-400 tracking-widest mb-4">
          ── RESUMO FINANCEIRO ──
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Faturamento',
              value: `R$ ${formatPrice(totalBilling)}`,
              sub: 'pedidos ativos',
              icon: '💰',
              color: 'text-green-400',
            },
            {
              label: 'Já entregue',
              value: `R$ ${formatPrice(totalRevenue)}`,
              sub: 'confirmado',
              icon: '✅',
              color: 'text-yellow-400',
            },
            {
              label: 'Ticket médio',
              value: `R$ ${formatPrice(avgTicket)}`,
              sub: 'por pedido',
              icon: '🎯',
              color: 'text-blue-400',
            },
            {
              label: 'Produtos',
              value: products.length,
              sub: 'no cardápio',
              icon: '🍦',
              color: 'text-purple-400',
            },
          ].map(({ label, value, sub, icon, color }) => (
            <div key={label} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4
              hover:border-yellow-400 transition-all">
              <p className="text-2xl mb-3">{icon}</p>
              <p className={`font-arcade text-lg ${color}`}>{value}</p>
              <p className="text-gray-600 font-body text-xs uppercase tracking-wider mt-1">
                {label}
              </p>
              <p className="text-gray-700 font-body text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PEDIDOS POR STATUS ── */}
      <div>
        <p className="font-arcade text-[9px] text-yellow-400 tracking-widest mb-4">
          ── PEDIDOS POR STATUS ──
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { key: 'pending',   label: 'Pendente',   color: 'border-yellow-400 text-yellow-400' },
            { key: 'confirmed', label: 'Confirmado', color: 'border-blue-400 text-blue-400' },
            { key: 'preparing', label: 'Preparando', color: 'border-orange-400 text-orange-400' },
            { key: 'ready',     label: 'Pronto',     color: 'border-green-400 text-green-400' },
            { key: 'delivered', label: 'Entregue',   color: 'border-gray-400 text-gray-400' },
            { key: 'cancelled', label: 'Cancelado',  color: 'border-red-400 text-red-400' },
          ].map(({ key, label, color }) => (
            <div key={key}
              className={`bg-[#1a1a1a] border p-3 text-center ${color}`}>
              <p className="font-arcade text-2xl">{byStatus[key]}</p>
              <p className="font-body text-xs mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Barra de progresso visual */}
        {orders.length > 0 && (
          <div className="mt-4 bg-[#1a1a1a] border border-[#2a2a2a] p-4">
            <p className="text-gray-500 font-body text-xs mb-3">
              Distribuição de pedidos
            </p>
            <div className="flex h-3 rounded-none overflow-hidden gap-0.5">
              {[
                { key: 'pending',   color: 'bg-yellow-400' },
                { key: 'confirmed', color: 'bg-blue-400' },
                { key: 'preparing', color: 'bg-orange-400' },
                { key: 'ready',     color: 'bg-green-400' },
                { key: 'delivered', color: 'bg-gray-400' },
                { key: 'cancelled', color: 'bg-red-400' },
              ].map(({ key, color }) => {
                const pct = orders.length > 0
                  ? (byStatus[key] / orders.length) * 100
                  : 0
                return pct > 0 ? (
                  <div
                    key={key}
                    className={`${color} transition-all`}
                    style={{ width: `${pct}%` }}
                    title={`${key}: ${byStatus[key]}`}
                  />
                ) : null
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── TOP PRODUTOS ── */}
      {topProducts.length > 0 && (
        <div>
          <p className="font-arcade text-[9px] text-yellow-400 tracking-widest mb-4">
            ── PRODUTOS MAIS VENDIDOS ──
          </p>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] divide-y divide-[#2a2a2a]">
            {topProducts.map(([name, qty], index) => {
              // Calcula % em relação ao mais vendido
              const maxQty = topProducts[0][1]
              const pct = (qty / maxQty) * 100

              return (
                <div key={name} className="flex items-center gap-4 p-4">
                  {/* Posição */}
                  <span className={`
                    font-arcade text-sm w-6 text-center flex-shrink-0
                    ${index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-yellow-700' : 'text-gray-600'}
                  `}>
                    {index + 1}
                  </span>

                  {/* Nome e barra */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white font-body font-bold text-sm truncate">
                        {name}
                      </p>
                      <span className="text-yellow-400 font-arcade text-[10px] ml-2 flex-shrink-0">
                        {qty} un.
                      </span>
                    </div>
                    {/* Barra de progresso */}
                    <div className="h-1.5 bg-[#2a2a2a] w-full">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── ESTADO VAZIO ── */}
      {orders.length === 0 && (
        <div className="text-center py-10 border border-[#2a2a2a] border-dashed">
          <p className="font-arcade text-[10px] text-gray-600">
            NENHUM DADO AINDA
          </p>
          <p className="text-gray-600 font-body text-sm mt-2">
            As métricas aparecem conforme os pedidos chegam 📦
          </p>
        </div>
      )}

    </div>
  )
}