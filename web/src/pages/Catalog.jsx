// Catalog.jsx
// Agora busca produtos da API real

import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function Catalog() {
  // Hook retorna os produtos, estado de loading e erro
  const { products, loading, error } = useProducts()

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      {/* Cabeçalho */}
      <div className="mb-10">
        <p className="text-yellow-400 font-arcade text-[9px] tracking-widest mb-3">
          ── CARDÁPIO ──
        </p>
        <h2 className="text-white font-arcade text-xl md:text-2xl leading-relaxed">
          ESCOLHA SEU
          <span className="text-yellow-400"> CONE</span>
        </h2>
        <p className="text-gray-500 font-body text-base mt-3">
          Todos feitos na hora, com ingredientes selecionados 🍫
        </p>
      </div>

      {/* Estado de carregando */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-12 h-12 bg-yellow-400"
            style={{
              borderRadius: '50% 50% 50% 0%',
              animation: 'chomp 0.4s infinite alternate'
            }}
          />
          <p className="font-arcade text-[10px] text-gray-500 animate-pulse">
            CARREGANDO...
          </p>
        </div>
      )}

      {/* Estado de erro */}
      {error && (
        <div className="border border-red-500 bg-red-500 bg-opacity-10 p-6 text-center">
          <p className="text-red-400 font-arcade text-[10px] mb-2">ERRO!</p>
          <p className="text-gray-400 font-body">{error}</p>
          <p className="text-gray-600 font-body text-sm mt-2">
            Verifique se o servidor está rodando em localhost:3333
          </p>
        </div>
      )}

      {/* Cardápio vazio (sem erro, sem loading, mas sem produtos) */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <p className="font-arcade text-[10px] text-gray-600">
            NENHUM PRODUTO CADASTRADO
          </p>
          <p className="text-gray-600 font-body text-sm mt-2">
            Adicione produtos pelo painel admin 🛠️
          </p>
        </div>
      )}

      {/* Grid de produtos */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </section>
  )
}