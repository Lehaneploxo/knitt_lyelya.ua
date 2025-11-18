import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  size?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, color?: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getItemCount: (id: string, color?: string, size?: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          (i) =>
            i.id === item.id &&
            i.color === item.color &&
            i.size === item.size
        )

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id &&
              i.color === item.color &&
              i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (id, color, size) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.id === id &&
                item.color === color &&
                item.size === size
              )
          ),
        })
      },

      updateQuantity: (id, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(id, color, size)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === id &&
            item.color === color &&
            item.size === size
              ? { ...item, quantity }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        )
      },

      getItemCount: (id, color, size) => {
        const item = get().items.find(
          (i) =>
            i.id === id &&
            i.color === color &&
            i.size === size
        )
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
