// useProducts.js
// Hook que busca e gerencia os produtos da API

import { useState, useEffect } from 'react'
import { getProducts } from '../services/productService.js'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Função que busca os produtos
    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, []) // [] significa que roda só uma vez, quando o componente monta

  return { products, loading, error }
}