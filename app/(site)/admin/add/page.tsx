'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nameUa: '',
    nameEn: '',
    sku: '',
    price: '',
    discount: '0',
    category: 'ethno',
    descriptionUa: '',
    descriptionEn: '',
    materials: [] as string[],
    colors: [] as string[],
    height: '',
    width: '',
    depth: '',
    inStock: true,
    isNew: false,
    isBestseller: false,
  })
  const [imageUrls, setImageUrls] = useState<string[]>([''])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls: imageUrls.filter(url => url.trim()),
        }),
      })

      if (response.ok) {
        toast.success('Товар додано успішно!')
        router.push('/admin')
      } else {
        toast.error('Помилка при додаванні товару')
      }
    } catch (error) {
      toast.error('Помилка з\'єднання')
    } finally {
      setLoading(false)
    }
  }

  const addMaterial = (material: string) => {
    if (!formData.materials.includes(material)) {
      setFormData({ ...formData, materials: [...formData.materials, material] })
    }
  }

  const removeMaterial = (material: string) => {
    setFormData({ ...formData, materials: formData.materials.filter(m => m !== material) })
  }

  const addColor = (color: string) => {
    if (!formData.colors.includes(color)) {
      setFormData({ ...formData, colors: [...formData.colors, color] })
    }
  }

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) })
  }

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = url
    setImageUrls(newUrls)
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const materialOptions = ['джут', 'бавовняний шнур', 'шкіра', 'шкіряний шнур', 'дерево']
  const colorOptions = ['натуральний', 'чорний', 'білий', 'молочний', 'бежевий', 'коричневий', 'мокко', 'капучіно']

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/admin" className="text-primary hover:underline">
            ← Назад до списку
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Додати новий товар</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Назви */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва (українською) *</label>
              <input
                type="text"
                value={formData.nameUa}
                onChange={(e) => setFormData({...formData, nameUa: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name (English) *</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Артикул, Ціна, Знижка */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Артикул (SKU) *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="ETH-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ціна (грн) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Знижка (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Категорія */}
          <div>
            <label className="block text-sm font-medium mb-2">Категорія *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="ethno">Етно / Ethno</option>
              <option value="basic">Базові / Basic</option>
              <option value="home">Дім / Home</option>
            </select>
          </div>

          {/* Описи */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Опис (українською)</label>
              <textarea
                value={formData.descriptionUa}
                onChange={(e) => setFormData({...formData, descriptionUa: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (English)</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
              />
            </div>
          </div>

          {/* Фото URLs */}
          <div>
            <label className="block text-sm font-medium mb-2">Посилання на фото</label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Видалити
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageUrl}
              className="mt-2 px-4 py-2 bg-gray-200 rounded-lg"
            >
              + Додати ще фото
            </button>
          </div>

          {/* Матеріали */}
          <div>
            <label className="block text-sm font-medium mb-2">Матеріали</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.materials.map(material => (
                <span key={material} className="px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center gap-2">
                  {material}
                  <button type="button" onClick={() => removeMaterial(material)} className="font-bold">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {materialOptions.map(material => (
                <button
                  key={material}
                  type="button"
                  onClick={() => addMaterial(material)}
                  className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                  disabled={formData.materials.includes(material)}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>

          {/* Кольори */}
          <div>
            <label className="block text-sm font-medium mb-2">Кольори</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors.map(color => (
                <span key={color} className="px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center gap-2">
                  {color}
                  <button type="button" onClick={() => removeColor(color)} className="font-bold">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => addColor(color)}
                  className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                  disabled={formData.colors.includes(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Розміри */}
          <div>
            <label className="block text-sm font-medium mb-2">Розміри (см)</label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                placeholder="Висота"
              />
              <input
                type="number"
                value={formData.width}
                onChange={(e) => setFormData({...formData, width: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                placeholder="Ширина"
              />
              <input
                type="number"
                value={formData.depth}
                onChange={(e) => setFormData({...formData, depth: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                placeholder="Глибина"
              />
            </div>
          </div>

          {/* Прапорці */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                className="w-4 h-4"
              />
              <span>В наявності</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                className="w-4 h-4"
              />
              <span>Новинка</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({...formData, isBestseller: e.target.checked})}
                className="w-4 h-4"
              />
              <span>Хіт продажів</span>
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              {loading ? 'Додавання...' : 'Додати товар'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium text-center"
            >
              Скасувати
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
