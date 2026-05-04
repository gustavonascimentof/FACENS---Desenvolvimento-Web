// AdminProductForm.jsx
// Formulário para criar e editar produtos

import { useState } from 'react'
import api from '../services/api.js'

export default function AdminProductForm({ product, onSuccess, onCancel }) {
  // Se receber um produto, preenche o formulário (modo edição)
  // Se não receber, começa vazio (modo criação)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'CLÁSSICO',
    image: product?.image || '',
    available: product?.available ?? true,
    featured: product?.featured ?? false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isEditing = !!product // true se estiver editando

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      // Checkboxes usam "checked", inputs normais usam "value"
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        // Edição — PUT /api/products/:id
        await api.put(`/products/${product._id}`, {
          ...formData,
          price: Number(formData.price),
        })
      } else {
        // Criação — POST /api/products
        await api.post('/products', {
          ...formData,
          price: Number(formData.price),
        })
      }
      onSuccess() // Avisa o pai que deu certo
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar produto.')
    } finally {
      setLoading(false)
    }
  }

  // Classe reutilizável para os inputs
  const inputClass = `
    w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white
    font-body px-4 py-3 text-sm outline-none
    focus:border-yellow-400 transition-all placeholder-gray-700
  `

  const labelClass = "text-gray-400 font-body text-xs uppercase tracking-wider block mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="border border-red-500 bg-red-500 bg-opacity-10 px-4 py-3">
          <p className="text-red-400 font-body text-sm">{error}</p>
        </div>
      )}

      {/* Nome */}
      <div>
        <label className={labelClass}>Nome do produto</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Cone Brigadeiro"
          required
          className={inputClass}
        />
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o produto..."
          required
          rows={3}
          className={inputClass + ' resize-none'}
        />
      </div>

      {/* Preço e Categoria lado a lado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Preço (R$)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="12.00"
            required
            min="0"
            step="0.50"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {['CLÁSSICO', 'PREMIUM', 'FRUTAS', 'ESPECIAL'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* URL da imagem */}
      <div>
        <label className={labelClass}>URL da imagem</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
          className={inputClass}
        />
        {/* Preview da imagem */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="mt-2 w-20 h-20 object-cover border border-[#2a2a2a]"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6">
        {[
          { name: 'available', label: 'Disponível' },
          { name: 'featured', label: 'Destaque' },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 border transition-all
                ${formData[name]
                  ? 'bg-yellow-400 border-yellow-400'
                  : 'bg-[#0a0a0a] border-[#2a2a2a] group-hover:border-yellow-400'
                }
                flex items-center justify-center
              `}>
                {formData[name] && (
                  <span className="text-black text-xs font-bold">✓</span>
                )}
              </div>
            </div>
            <span className="text-gray-400 font-body text-sm">{label}</span>
          </label>
        ))}
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-yellow-400 text-black font-arcade text-[10px]
            py-3 hover:bg-yellow-300 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'SALVANDO...' : isEditing ? '✓ SALVAR' : '+ CRIAR'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 border border-[#2a2a2a] text-gray-500
            hover:border-gray-500 hover:text-white font-body text-sm transition-all"
        >
          Cancelar
        </button>
      </div>

    </form>
  )
}