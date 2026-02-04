import { create } from 'zustand';
import { Product } from '../types/product.types';
import { CartItem } from '../types/sales.types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.product.price,
              }
            : item
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            product,
            quantity,
            subtotal: product.price * quantity,
          },
        ],
      });
    }
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.product.id !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.product.price,
            }
          : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
