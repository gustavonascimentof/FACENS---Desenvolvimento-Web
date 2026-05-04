// AuthModal.jsx
// Modal com formulários de Login e Cadastro

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AuthModal({ isOpen, onClose }) {
  const { handleLogin, handleRegister, loading, error } = useAuth()

  // Controla qual aba está ativa: 'login' ou 'register'
  const [tab, setTab] = useState('login')

  // Dados do formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  // Dados do formulário de cadastro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  // Atualiza campo do login
  function handleLoginChange(e) {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Atualiza campo do cadastro
  function handleRegisterChange(e) {
    setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Submete o login
  async function handleLoginSubmit(e) {
    e.preventDefault() // Evita recarregar a página
    const success = await handleLogin(loginData.email, loginData.password)
    if (success) onClose() // Fecha o modal se deu certo
  }

  // Submete o cadastro
  async function handleRegisterSubmit(e) {
    e.preventDefault()
    const success = await handleRegister(registerData)
    if (success) onClose()
  }

  // Não renderiza nada se estiver fechado
  if (!isOpen) return null

  return (
    <>
      {/* OVERLAY — fundo escuro */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-full max-w-md z-50
        bg-[#111] border border-[#2a2a2a]
        shadow-[0_0_40px_rgba(255,215,0,0.1)]
      ">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            {/* Mini Pac-Man decorativo */}
            <div
              className="w-6 h-6 bg-yellow-400"
              style={{ borderRadius: '50% 50% 50% 0%' }}
            />
            <h2 className="font-arcade text-yellow-400 text-sm">
              {tab === 'login' ? 'ENTRAR' : 'CADASTRAR'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-yellow-400 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* ABAS */}
        <div className="flex border-b border-[#2a2a2a]">
          {[
            { key: 'login', label: 'JÁ TENHO CONTA' },
            { key: 'register', label: 'CRIAR CONTA' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                flex-1 py-3 font-arcade text-[8px] tracking-wider transition-all
                ${tab === key
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400 bg-opacity-5'
                  : 'text-gray-600 hover:text-gray-400'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <div className="mx-6 mt-4 border border-red-500 bg-red-500 bg-opacity-10 px-4 py-3">
            <p className="text-red-400 font-body text-sm">{error}</p>
          </div>
        )}

        {/* ── FORMULÁRIO DE LOGIN ── */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">

            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="seu@email.com"
                required
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 focus:shadow-[0_0_0_1px_rgba(255,215,0,0.3)]
                  transition-all placeholder-gray-700
                "
              />
            </div>

            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••"
                required
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 focus:shadow-[0_0_0_1px_rgba(255,215,0,0.3)]
                  transition-all placeholder-gray-700
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-yellow-400 text-black font-arcade text-[10px]
                py-4 mt-2 transition-all
                hover:bg-yellow-300 hover:scale-[1.02] active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              "
            >
              {loading ? 'ENTRANDO...' : '▶ ENTRAR'}
            </button>

            <p className="text-center text-gray-600 font-body text-xs">
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-yellow-400 hover:underline"
              >
                Criar agora
              </button>
            </p>

          </form>
        )}

        {/* ── FORMULÁRIO DE CADASTRO ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">

            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Seu nome"
                required
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 focus:shadow-[0_0_0_1px_rgba(255,215,0,0.3)]
                  transition-all placeholder-gray-700
                "
              />
            </div>

            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="seu@email.com"
                required
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 focus:shadow-[0_0_0_1px_rgba(255,215,0,0.3)]
                  transition-all placeholder-gray-700
                "
              />
            </div>

            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder="(11) 99999-9999"
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 focus:shadow-[0_0_0_1px_rgba(255,215,0,0.3)]
                  transition-all placeholder-gray-700
                "
              />
            </div>

            <div>
              <label className="text-gray-400 font-body text-xs uppercase tracking-wider block mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="
                  w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white
                  font-body px-4 py-3 text-sm outline-none
                  focus:border-yellow-400 focus:shadow-[0_0_0_1px_rgba(255,215,0,0.3)]
                  transition-all placeholder-gray-700
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-yellow-400 text-black font-arcade text-[10px]
                py-4 mt-2 transition-all
                hover:bg-yellow-300 hover:scale-[1.02] active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              "
            >
              {loading ? 'CADASTRANDO...' : '▶ CRIAR CONTA'}
            </button>

            <p className="text-center text-gray-600 font-body text-xs">
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-yellow-400 hover:underline"
              >
                Fazer login
              </button>
            </p>

          </form>
        )}

      </div>
    </>
  )
}