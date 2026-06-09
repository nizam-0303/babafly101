import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState, Product } from '../../utils/types';

const loadCart = (): CartItem[] => {
  try { const s = localStorage.getItem('babafly_cart'); return s ? JSON.parse(s) : []; } catch { return []; }
};
const saveCart = (items: CartItem[]) => localStorage.setItem('babafly_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() } as CartState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) { existing.qty += 1; } else { state.items.push({ ...action.payload, qty: 1 }); }
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveCart(state.items);
    },
    updateQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
        if (item.qty <= 0) state.items = state.items.filter(i => i.id !== action.payload.id);
      }
      saveCart(state.items);
    },
    clearCart(state) { state.items = []; saveCart([]); },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
