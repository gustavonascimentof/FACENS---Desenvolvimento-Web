// Hero.jsx
// Tela inicial com status de funcionamento por horário

// ── CONFIGURAÇÃO DO HORÁRIO ──────────────────────────
// Altere aqui para definir o horário de funcionamento
const BUSINESS_HOURS = {
  // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  0: null,                        // Domingo — fechado
  1: { open: 19, close: 22 },     // Segunda
  2: { open: 19, close: 22 },     // Terça
  3: { open: 19, close: 22 },     // Quarta
  4: { open: 19, close: 22 },     // Quinta
  5: { open: 19, close: 22 },     // Sexta   
  6: null,
}

// Verifica se está aberto agora
function getStoreStatus() {
  const now = new Date()
  const day = now.getDay()       // 0-6
  const hour = now.getHours()    // 0-23
  const minutes = now.getMinutes()
  const currentTime = hour + minutes / 60 // Ex: 14:30 = 14.5

  const todayHours = BUSINESS_HOURS[day]

  // Fechado hoje (ex: domingo)
  if (!todayHours) {
    return {
      isOpen: false,
      message: 'Fechado hoje',
      nextOpen: getNextOpenDay(day),
    }
  }

  // Antes de abrir
  if (currentTime < todayHours.open) {
    return {
      isOpen: false,
      message: `Abre às ${todayHours.open}h`,
      nextOpen: `hoje às ${todayHours.open}h`,
    }
  }

  // Depois de fechar
  if (currentTime >= todayHours.close) {
    return {
      isOpen: false,
      message: `Fechado — volta amanhã`,
      nextOpen: getNextOpenDay(day),
    }
  }

  // Aberto agora
  return {
    isOpen: true,
    message: `Aberto até ${todayHours.close}h`,
    nextOpen: null,
  }
}

// Descobre o próximo dia que abre
function getNextOpenDay(currentDay) {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7
    const hours = BUSINESS_HOURS[nextDay]
    if (hours) {
      const name = i === 1 ? 'amanhã' : `${dayNames[nextDay]}`
      return `${name} às ${hours.open}h`
    }
  }
  return 'em breve'
}

export default function Hero({ onCatalogClick }) {
  const status = getStoreStatus()

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">

      {/* ── BADGE DE STATUS ── */}
      <div className="inline-flex items-center gap-2 mb-8
        border border-[#2a2a2a] px-4 py-2 bg-[#1a1a1a]">

        {/* Bolinha animada — verde se aberto, vermelha se fechado */}
        <span className={`
          w-2 h-2 rounded-full flex-shrink-0
          ${status.isOpen
            ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]'
            : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
          }
        `}
          style={{ animation: status.isOpen ? 'blink 1.5s infinite' : 'none' }}
        />

        <span className={`
          font-arcade text-[9px] tracking-widest
          ${status.isOpen ? 'text-green-400' : 'text-red-400'}
        `}>
          {status.isOpen ? 'ABERTO AGORA' : status.message.toUpperCase()}
        </span>

        {/* Horário atual se aberto */}
        {status.isOpen && (
          <>
            <span className="text-[#2a2a2a]">|</span>
            <span className="text-gray-500 font-body text-xs">
              {status.message}
            </span>
          </>
        )}

        {/* Próxima abertura se fechado */}
        {!status.isOpen && status.nextOpen && (
          <>
            <span className="text-[#2a2a2a]">|</span>
            <span className="text-gray-500 font-body text-xs">
              Abre {status.nextOpen}
            </span>
          </>
        )}
      </div>

      {/* ── TÍTULO ── */}
      <h2 className="font-arcade text-3xl md:text-5xl leading-relaxed mb-6">
        <span
          className="text-yellow-400 block"
          style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
        >
          COME
        </span>
        <span className="text-white">
          CONE
        </span>
      </h2>

      {/* ── SUBTÍTULO ── */}
      <p className="text-gray-400 font-body text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
        Os melhores cones do campus.
        <br />
        Peça agora e receba direto na sua sala!
      </p>

      {/* ── BOTÕES ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

        {/* Botão principal — desabilitado se fechado */}
        <button
          onClick={status.isOpen ? onCatalogClick : undefined}
          disabled={!status.isOpen}
          className={`
            font-arcade text-[10px] px-8 py-4 transition-all
            ${status.isOpen
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer'
              : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'
            }
          `}
          style={{
            clipPath: status.isOpen
              ? 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))'
              : 'none'
          }}
        >
          {status.isOpen ? '🍦 VER CARDÁPIO' : '🔒 FECHADO AGORA'}
        </button>

        {/* Botão secundário */}
        <button
          onClick={onCatalogClick}
          className="border border-[#2a2a2a] px-8 py-4 text-gray-500
            hover:border-yellow-400 hover:text-yellow-400
            font-body font-semibold text-sm uppercase tracking-wider
            transition-all"
        >
          Ver cardápio mesmo assim →
        </button>

      </div>

      {/* ── STATS ── */}
      <div className="mt-20 flex justify-center gap-12 md:gap-20">
        {[
          { label: 'SABORES', value: '10+', delay: '0s' },
          { label: 'PEDIDOS', value: '5000+', delay: '0.2s' },
          { label: 'AVALIAÇÃO', value: '★ 4.9', delay: '0.4s' },
        ].map(({ label, value, delay }) => (
          <div
            key={label}
            style={{ animation: `float 3s ease-in-out ${delay} infinite` }}
          >
            <p
              className="text-yellow-400 font-arcade text-2xl md:text-3xl"
              style={{ textShadow: '0 0 10px rgba(255,215,0,0.4)' }}
            >
              {value}
            </p>
            <p className="text-gray-600 font-body text-xs mt-2 tracking-widest uppercase">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── HORÁRIOS DE FUNCIONAMENTO ── */}
      <div className="mt-16 inline-block border border-[#2a2a2a] bg-[#1a1a1a] p-6 text-left">
        <p className="font-arcade text-[9px] text-yellow-400 tracking-widest mb-4 text-center">
          ── HORÁRIOS ──
        </p>
        <div className="space-y-2">
          {[
            { day: 'Segunda a Sexta', hours: '19h às 22h' },
            { day: 'Sábado e Domingo', hours: 'Fechado' },
            
          ].map(({ day, hours }) => (
            <div key={day} className="flex justify-between gap-8 font-body text-sm">
              <span className="text-gray-500">{day}</span>
              <span className={hours === 'Fechado' ? 'text-red-400' : 'text-white'}>
                {hours}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}