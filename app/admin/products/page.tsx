'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    sku: '',
    image_url: '',
    thumbnail_url: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          cost: formData.cost ? parseFloat(formData.cost) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create product')
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          cost: '',
          sku: '',
          image_url: '',
          thumbnail_url: '',
        })
        fetchProducts()
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            Taaron Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/orders" className="text-sm hover:underline">
              Orders
            </Link>
            <Link href="/" className="text-sm hover:underline">
              Store
            </Link>
          </nav>
        </div>
      </header>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Add Product</h1>

          {error && (
            <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Price (৳) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Cost (৳)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
                rows={4}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="lg:col-span-2 border border-gray-300 bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </form>

          {/* Products List */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Products</h2>

            {loading ? (
              <p className="mt-4 text-gray-600">Loading...</p>
            ) : products.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Price</th>
                      <th className="border border-gray-200 px-4 py-2 text-center">
                        Variants
                      </th>
                      <th className="border border-gray-200 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border border-gray-200 hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{product.name}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          ৳{product.price.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          {product.product_variants?.length || 0}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-gray-600">No products yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
