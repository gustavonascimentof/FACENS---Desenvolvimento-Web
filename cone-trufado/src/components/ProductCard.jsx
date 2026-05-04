// ProductCard.jsx
// Exibe as informações de um produto e botão de adicionar ao carrinho

import { useState } from 'react'
import { useCart } from '../context/CartContext'

// "product" é uma prop — dados que vêm de fora do componente
export default function ProductCard({ product }) {
  const { addItem } = useCart()

  // Controla animação do botão ao adicionar
  const [added, setAdded] = useState(false)

  function handleAdd() {
  // Garante compatibilidade com _id do MongoDB e id local
  addItem({ ...product, id: product._id || product.id })
  setAdded(true)
  setTimeout(() => setAdded(false), 1000)
  }

  return (
    <div className="
      bg-[#1a1a1a] border border-[#2a2a2a]
      hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]
      transition-all duration-300 group flex flex-col
    ">

      {/* Imagem do produto */}
      <div className="relative overflow-hidden bg-[#111] aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge de destaque (opcional) */}
        {product.featured && (
          <span className="
            absolute top-2 left-2
            bg-yellow-400 text-black text-[8px]
            font-arcade px-2 py-1
          ">
            ★ DESTAQUE
          </span>
        )}

        {/* Badge sem estoque */}
        {!product.available && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="font-arcade text-[10px] text-red-400">ESGOTADO</span>
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="p-4 flex flex-col flex-1">

        {/* Categoria */}
        <span className="text-yellow-400 text-[9px] font-arcade tracking-widest mb-2">
          {product.category}
        </span>

        {/* Nome */}
        <h3 className="text-white font-body font-bold text-lg leading-tight mb-1">
          {product.name}
        </h3>

        {/* Descrição */}
        <p className="text-gray-500 text-sm font-body leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Preço + Botão */}
        <div className="flex items-center justify-between mt-auto">

          {/* Preço */}
          <div>
            <span className="text-yellow-400 font-arcade text-base">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Botão adicionar */}
          <button
            onClick={handleAdd}
            disabled={!product.available || added}
            className={`
              font-arcade text-[8px] px-3 py-2 transition-all duration-200
              ${added
                ? 'bg-green-500 text-black scale-95'
                : product.available
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105 active:scale-95'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }
            `}
            style={{
              clipPath: added ? 'none' : 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))'
            }}
          >
            {added ? '✓ OK!' : '+ ADD'}
          </button>

        </div>
      </div>
    </div>
  )
}