'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

// Временные данные товара
const productData: Record<string, any> = {
  prod_001: {
    id: 'prod_001',
    name: "Сумка 'Польовий квіт'",
    price: 1500,
    category: 'ethno',
    description: 'Елегантна сумка з етнічним орнаментом. Виконана вручну з якісних матеріалів. Ідеально підходить для повсякденного використання та особливих випадків.',
    colors: ['Бежевий', 'Теракот'],
    materials: 'Натуральна шкіра, тканина з вишивкою',
    dimensions: '30 x 25 x 10 см',
    weight: '0.5 кг',
    inStock: true,
  },
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const product = productData[id] || productData['prod_001']

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'delivery'>('description')

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: '/images/placeholder.jpg',
      color: selectedColor,
    })

    toast.success(`${quantity} товар(ів) додано в кошик`)
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">Головна</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/catalog/${product.category}`} className="hover:text-primary">
          {product.category === 'ethno' ? 'Етно' : 'Базові'}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-[3/4] bg-secondary rounded-2xl mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span className="text-lg">Фото товару</span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-secondary rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              ></div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            {product.name}
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Артикул: {product.id.toUpperCase()}
          </p>

          <div className="text-4xl font-semibold text-primary mb-6">
            {product.price} грн
          </div>

          <p className="text-gray-700 mb-6">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Колір</h3>
            <div className="flex space-x-3">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedColor === color
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Кількість</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-2 font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg mb-4"
          >
            Додати в кошик
          </button>

          {/* Stock Status */}
          {product.inStock ? (
            <p className="text-sm text-green-600 mb-8">✓ В наявності</p>
          ) : (
            <p className="text-sm text-red-600 mb-8">Немає в наявності</p>
          )}

          {/* Tabs */}
          <div className="border-t pt-8">
            <div className="flex space-x-6 border-b mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Опис
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'specs'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Характеристики
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`pb-3 font-medium transition-colors ${
                  activeTab === 'delivery'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                Доставка
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="text-gray-700">
                <p>{product.description}</p>
                <p className="mt-4">
                  Кожна сумка виконана вручну з дотриманням традиційних технологій
                  та з використанням сучасних матеріалів високої якості.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Матеріали:</span>
                  <span className="font-medium">{product.materials}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Розміри:</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Вага:</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-medium mb-2">Укрпошта</h4>
                  <p className="text-sm">Доставка по Україні 3-7 днів. Вартість: від 50 грн</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Нова Пошта</h4>
                  <p className="text-sm">Доставка 1-3 дні. Вартість: за тарифами перевізника</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Оплата</h4>
                  <p className="text-sm">
                    Оплата при отриманні (накладений платіж) або онлайн карткою
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
