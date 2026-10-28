'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'
import ContractModal from '@/components/ui/ContractModal'

interface NpCity {
  Ref: string
  Present: string
  MainDescription: string
  Area: string
  SettlementTypeCode: string
  DeliveryCity: string
}

interface NpWarehouse {
  Ref: string
  Description: string
  ShortAddress: string
  CityDescription: string
  WarehouseIndex: string
}

interface MeestCity {
  cityID: string
  name: string
  region: string
}

interface MeestBranch {
  branchID: string
  num: string | number
  address: string
  schedule: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [isContractAccepted, setIsContractAccepted] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    deliveryMethod: 'novaposhta',
    city: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
    comment: '',
  })

  // Nova Poshta state
  const [npCityQuery, setNpCityQuery] = useState('')
  const [npCityResults, setNpCityResults] = useState<NpCity[]>([])
  const [npCityOpen, setNpCityOpen] = useState(false)
  const [npCityLoading, setNpCityLoading] = useState(false)
  const [npSelectedCity, setNpSelectedCity] = useState<NpCity | null>(null)

  const [npWarehouseQuery, setNpWarehouseQuery] = useState('')
  const [npWarehouseResults, setNpWarehouseResults] = useState<NpWarehouse[]>([])
  const [npWarehouseOpen, setNpWarehouseOpen] = useState(false)
  const [npWarehouseLoading, setNpWarehouseLoading] = useState(false)
  const [npSelectedWarehouse, setNpSelectedWarehouse] = useState<NpWarehouse | null>(null)

  // Meest state
  const [meestCityQuery, setMeestCityQuery] = useState('')
  const [meestCityResults, setMeestCityResults] = useState<MeestCity[]>([])
  const [meestCityOpen, setMeestCityOpen] = useState(false)
  const [meestCityLoading, setMeestCityLoading] = useState(false)
  const [meestSelectedCity, setMeestSelectedCity] = useState<MeestCity | null>(null)

  const [meestBranchQuery, setMeestBranchQuery] = useState('')
  const [meestBranchAll, setMeestBranchAll] = useState<MeestBranch[]>([])
  const [meestBranchResults, setMeestBranchResults] = useState<MeestBranch[]>([])
  const [meestBranchOpen, setMeestBranchOpen] = useState(false)
  const [meestBranchLoading, setMeestBranchLoading] = useState(false)
  const [meestSelectedBranch, setMeestSelectedBranch] = useState<MeestBranch | null>(null)

  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const warehouseDropdownRef = useRef<HTMLDivElement>(null)
  const warehouseInputRef = useRef<HTMLInputElement>(null)
  const meestCityDropdownRef = useRef<HTMLDivElement>(null)
  const meestBranchDropdownRef = useRef<HTMLDivElement>(null)
  const meestBranchInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus warehouse input when NP city is selected
  useEffect(() => {
    if (npSelectedCity) {
      setTimeout(() => warehouseInputRef.current?.focus(), 100)
    }
  }, [npSelectedCity])

  // Auto-focus Meest branch input when city is selected
  useEffect(() => {
    if (meestSelectedCity) {
      setTimeout(() => meestBranchInputRef.current?.focus(), 100)
    }
  }, [meestSelectedCity])

  // Debounced Meest city search
  useEffect(() => {
    if (formData.deliveryMethod !== 'meest') return
    if (meestCityQuery.length < 2) {
      setMeestCityResults([])
      setMeestCityOpen(false)
      return
    }
    const timer = setTimeout(async () => {
      setMeestCityLoading(true)
      try {
        const res = await fetch('/api/meest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'searchCities', query: meestCityQuery }),
        })
        const data = await res.json()
        const cities: MeestCity[] = data?.cities || []
        setMeestCityResults(cities.slice(0, 50))
        setMeestCityOpen(cities.length > 0)
      } catch {
        setMeestCityResults([])
      } finally {
        setMeestCityLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [meestCityQuery, formData.deliveryMethod])

  // Fetch all Meest branches for the selected city once (not on every keystroke)
  useEffect(() => {
    if (!meestSelectedCity) {
      setMeestBranchAll([])
      return
    }
    let cancelled = false
    setMeestBranchLoading(true)
    fetch('/api/meest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getBranches', cityId: meestSelectedCity.cityID }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setMeestBranchAll(data?.branches || [])
      })
      .catch(() => {
        if (!cancelled) setMeestBranchAll([])
      })
      .finally(() => {
        if (!cancelled) setMeestBranchLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [meestSelectedCity])

  // Filter the already-fetched branch list locally as the user types — no extra requests
  useEffect(() => {
    const MAX_VISIBLE = 50
    const matches = meestBranchQuery
      ? meestBranchAll.filter(
          (b) =>
            b.address?.toLowerCase().includes(meestBranchQuery.toLowerCase()) ||
            String(b.num).includes(meestBranchQuery)
        )
      : meestBranchAll
    setMeestBranchResults(matches.slice(0, MAX_VISIBLE))
    setMeestBranchOpen(matches.length > 0)
  }, [meestBranchQuery, meestBranchAll])

  // Debounced city search
  useEffect(() => {
    if (formData.deliveryMethod !== 'novaposhta') return
    if (npCityQuery.length < 2) {
      setNpCityResults([])
      setNpCityOpen(false)
      return
    }
    const timer = setTimeout(async () => {
      setNpCityLoading(true)
      try {
        const res = await fetch('/api/novaposhta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'searchCities', query: npCityQuery }),
        })
        const data = await res.json()
        const addresses: NpCity[] = data?.data?.[0]?.Addresses || []
        setNpCityResults(addresses)
        setNpCityOpen(addresses.length > 0)
      } catch {
        setNpCityResults([])
      } finally {
        setNpCityLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [npCityQuery, formData.deliveryMethod])

  // Debounced warehouse search
  useEffect(() => {
    if (!npSelectedCity) return
    const timer = setTimeout(async () => {
      setNpWarehouseLoading(true)
      try {
        const res = await fetch('/api/novaposhta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getWarehouses',
            cityRef: npSelectedCity.DeliveryCity || npSelectedCity.Ref,
            query: npWarehouseQuery,
          }),
        })
        const data = await res.json()
        const warehouses: NpWarehouse[] = data?.data || []
        setNpWarehouseResults(warehouses)
        setNpWarehouseOpen(warehouses.length > 0)
      } catch {
        setNpWarehouseResults([])
      } finally {
        setNpWarehouseLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [npWarehouseQuery, npSelectedCity])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setNpCityOpen(false)
      }
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(e.target as Node)) {
        setNpWarehouseOpen(false)
      }
      if (meestCityDropdownRef.current && !meestCityDropdownRef.current.contains(e.target as Node)) {
        setMeestCityOpen(false)
      }
      if (meestBranchDropdownRef.current && !meestBranchDropdownRef.current.contains(e.target as Node)) {
        setMeestBranchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectCity = (city: NpCity) => {
    setNpSelectedCity(city)
    setNpCityQuery(city.Present)
    setNpCityOpen(false)
    // Reset warehouse when city changes
    setNpSelectedWarehouse(null)
    setNpWarehouseQuery('')
    setNpWarehouseResults([])
  }

  const selectWarehouse = (wh: NpWarehouse) => {
    setNpSelectedWarehouse(wh)
    setNpWarehouseQuery(wh.Description)
    setNpWarehouseOpen(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'deliveryMethod') {
      if (value !== 'novaposhta') {
        setNpSelectedCity(null)
        setNpSelectedWarehouse(null)
        setNpCityQuery('')
        setNpWarehouseQuery('')
      }
      if (value !== 'meest') {
        setMeestSelectedCity(null)
        setMeestSelectedBranch(null)
        setMeestCityQuery('')
        setMeestBranchQuery('')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isContractAccepted) {
      setIsContractModalOpen(true)
      toast.error(t('contract.error'))
      return
    }

    setIsSubmitting(true)

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      toast.error(t('checkout.errorRequired'))
      setIsSubmitting(false)
      return
    }

    // Nova Poshta validation
    if (formData.deliveryMethod === 'novaposhta') {
      if (!npSelectedCity) {
        toast.error(t('checkout.npSelectCity'))
        setIsSubmitting(false)
        return
      }
      if (!npSelectedWarehouse) {
        toast.error(t('checkout.npSelectWarehouse'))
        setIsSubmitting(false)
        return
      }
    }

    // Meest validation
    if (formData.deliveryMethod === 'meest') {
      if (!meestSelectedCity) {
        toast.error(t('checkout.npSelectCity'))
        setIsSubmitting(false)
        return
      }
      if (!meestSelectedBranch) {
        toast.error(t('checkout.npSelectWarehouse'))
        setIsSubmitting(false)
        return
      }
    }

    const deliveryAddress =
      formData.deliveryMethod === 'novaposhta'
        ? `${npSelectedCity?.Present}, ${npSelectedWarehouse?.Description}`
        : formData.deliveryMethod === 'meest'
        ? `${meestSelectedCity?.name}, відділення №${meestSelectedBranch?.num} - ${meestSelectedBranch?.address}`
        : `${formData.city}, ${formData.address}`

    try {
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          totalAmount: getTotalPrice(),
          deliveryMethod: formData.deliveryMethod,
          deliveryAddress,
          paymentMethod: formData.paymentMethod,
          notes: formData.comment,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const { orderNumber } = orderData

      if (formData.paymentMethod === 'card_online') {
        const paymentResponse = await fetch('/api/payment/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getTotalPrice(),
            orderId: orderNumber,
            customerEmail: formData.email,
          }),
        })

        const paymentData = await paymentResponse.json()

        if (!paymentData.success || !paymentData.pageUrl) {
          throw new Error('Failed to create payment invoice')
        }

        clearCart()
        window.location.href = paymentData.pageUrl
        return
      }

      setOrderSubmitted(true)
      clearCart()
      toast.success(t('checkout.success'))
      router.push(`/checkout/complete?orderNumber=${orderNumber}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(t('checkout.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContractAccept = () => {
    setIsContractAccepted(true)
    setIsContractModalOpen(false)
    toast.success(t('contract.accepted'))
  }

  const handleContractDecline = () => {
    setIsContractAccepted(false)
    setIsContractModalOpen(false)
    toast.info(t('contract.declined'))
  }

  if (items.length === 0 && !orderSubmitted) {
    router.push('/cart')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
        {t('checkout.title')}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.contactInfo')}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+380"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.delivery')}
              </h2>

              <div className="space-y-4 mb-6">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === 'novaposhta' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="novaposhta"
                    checked={formData.deliveryMethod === 'novaposhta'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{t('checkout.deliveryNovaposhta')}</div>
                      <div className="text-sm text-gray-600">{t('checkout.deliveryNovaposhtaTime')}</div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === 'meest' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="meest"
                    checked={formData.deliveryMethod === 'meest'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.deliveryMeest')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.deliveryMeestTime')}</div>
                  </div>
                </label>
              </div>

              {/* Nova Poshta autocomplete fields */}
              {formData.deliveryMethod === 'novaposhta' && (
                <div className="space-y-4">
                  {/* City search */}
                  <div ref={cityDropdownRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.npCity')} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={npCityQuery}
                        onChange={(e) => {
                          setNpCityQuery(e.target.value)
                          setNpSelectedCity(null)
                          setNpSelectedWarehouse(null)
                          setNpWarehouseQuery('')
                        }}
                        placeholder={t('checkout.npCityPlaceholder')}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                      />
                      {npCityLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {npSelectedCity && !npCityLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</div>
                      )}
                    </div>
                    {npCityOpen && npCityResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {npCityResults.map((city) => (
                          <button
                            key={city.Ref}
                            type="button"
                            onClick={() => selectCity(city)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                          >
                            <span className="font-medium text-sm">{city.Present}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warehouse search — shown only after city selected */}
                  {npSelectedCity && (
                    <div ref={warehouseDropdownRef} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.npWarehouse')} *
                      </label>
                      <div className="relative">
                        <input
                          ref={warehouseInputRef}
                          type="text"
                          value={npWarehouseQuery}
                          onChange={(e) => {
                            setNpWarehouseQuery(e.target.value)
                            setNpSelectedWarehouse(null)
                          }}
                          onFocus={() => {
                            if (npWarehouseResults.length > 0) setNpWarehouseOpen(true)
                          }}
                          placeholder={t('checkout.npWarehousePlaceholder')}
                          autoComplete="off"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                        />
                        {npWarehouseLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {npSelectedWarehouse && !npWarehouseLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</div>
                        )}
                      </div>
                      {npWarehouseOpen && npWarehouseResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {npWarehouseResults.map((wh) => (
                            <button
                              key={wh.Ref}
                              type="button"
                              onClick={() => selectWarehouse(wh)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                            >
                              <span className="text-sm font-medium">{wh.Description}</span>
                              {wh.ShortAddress && (
                                <p className="text-xs text-gray-500 mt-0.5">{wh.ShortAddress}</p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Meest autocomplete fields */}
              {formData.deliveryMethod === 'meest' && (
                <div className="space-y-4">
                  {/* Meest City search */}
                  <div ref={meestCityDropdownRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.npCity')} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={meestCityQuery}
                        onChange={(e) => {
                          setMeestCityQuery(e.target.value)
                          setMeestSelectedCity(null)
                          setMeestSelectedBranch(null)
                          setMeestBranchQuery('')
                        }}
                        placeholder={t('checkout.npCityPlaceholder')}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                      />
                      {meestCityLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {meestSelectedCity && !meestCityLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</div>
                      )}
                    </div>
                    {meestCityOpen && meestCityResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {meestCityResults.map((city) => (
                          <button
                            key={city.cityID}
                            type="button"
                            onClick={() => {
                              setMeestSelectedCity(city)
                              setMeestCityQuery(city.name)
                              setMeestCityOpen(false)
                              setMeestSelectedBranch(null)
                              setMeestBranchQuery('')
                              setMeestBranchResults([])
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                          >
                            <span className="font-medium text-sm">{city.name}</span>
                            {city.region && (
                              <p className="text-xs text-gray-500 mt-0.5">{city.region}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Meest Branch search — shown only after city selected */}
                  {meestSelectedCity && (
                    <div ref={meestBranchDropdownRef} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.npWarehouse')} *
                      </label>
                      <div className="relative">
                        <input
                          ref={meestBranchInputRef}
                          type="text"
                          value={meestBranchQuery}
                          onChange={(e) => {
                            setMeestBranchQuery(e.target.value)
                            setMeestSelectedBranch(null)
                          }}
                          onFocus={() => {
                            if (meestBranchResults.length > 0) setMeestBranchOpen(true)
                          }}
                          placeholder={t('checkout.npWarehousePlaceholder')}
                          autoComplete="off"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                        />
                        {meestBranchLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {meestSelectedBranch && !meestBranchLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</div>
                        )}
                      </div>
                      {meestBranchOpen && meestBranchResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {meestBranchResults.map((branch) => (
                            <button
                              key={branch.branchID}
                              type="button"
                              onClick={() => {
                                setMeestSelectedBranch(branch)
                                setMeestBranchQuery(`№${branch.num} - ${branch.address}`)
                                setMeestBranchOpen(false)
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                            >
                              <span className="text-sm font-medium">Відділення №{branch.num}</span>
                              {branch.address && (
                                <p className="text-xs text-gray-500 mt-0.5">{branch.address}</p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.payment')}
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.paymentCash')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.paymentCashDescription')}</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_online"
                    checked={formData.paymentMethod === 'card_online'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{t('checkout.paymentCard')}</div>
                    <div className="text-sm text-gray-600">{t('checkout.paymentCardDescription')}</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Comment */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.comment')}
              </h2>

              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={4}
                placeholder={t('checkout.commentPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-heading font-semibold mb-6">
                {t('checkout.yourOrder')}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-16 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={language === 'ua' ? item.name.ua : item.name.en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {language === 'ua' ? item.name.ua : item.name.en}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price} {t('common.currency')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-medium">{getTotalPrice()} {t('common.currency')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.delivery')}</span>
                  <span className="text-sm">{t('checkout.deliveryFrom')}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{t('checkout.total')}</span>
                  <span className="text-2xl font-bold text-primary">
                    {getTotalPrice()} {t('common.currency')}
                  </span>
                </div>
              </div>

              {/* Договір (оферта) */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isContractAccepted}
                    onChange={(e) => setIsContractAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {t('contract.checkbox')}{' '}
                    <button
                      type="button"
                      onClick={() => setIsContractModalOpen(true)}
                      className="text-primary hover:text-primary-dark underline font-medium"
                    >
                      {t('contract.link')}
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isContractAccepted}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('checkout.submitting') : t('checkout.submit')}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onAccept={handleContractAccept}
        onDecline={handleContractDecline}
      />
    </div>
  )
}
