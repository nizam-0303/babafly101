import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { removeFromCart, updateQty } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector(s => s.cart);
  const { user } = useAppSelector(s => s.auth);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const shipping = subtotal > 300 ? 0 : 29;
  const total = subtotal - discount + shipping;

  const handleRemove = (id: string, name: string) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed`, { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
  };

  const handleCheckout = () => {
    if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } });
    else navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="w-24 h-24 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-10 h-10 text-sky-300" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6 text-sm">Looks like you haven't added anything yet.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm">
              <ShoppingBag className="w-4 h-4" />Start Shopping
            </Link>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900">Shopping Cart</h1>
            <p className="text-slate-500 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }} transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-card p-5 flex gap-4">
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-slate-400 capitalize mb-1">{item.category}</p>
                          <Link to={`/products/${item.id}`} className="text-sm font-semibold text-navy-900 hover:text-sky-600 transition-colors line-clamp-2">{item.name}</Link>
                        </div>
                        <button onClick={() => handleRemove(item.id, item.name)}
                          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-500 transition-all duration-200 flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
                            className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-navy-900">{item.qty}</span>
                          <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                            className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-base font-bold text-navy-900">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h3 className="text-lg font-bold text-navy-900 mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({items.length} items)</span>
                    <span className="font-medium text-navy-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Member Discount (5%)</span>
                    <span className="font-medium text-emerald-600">-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium text-navy-900">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping}`}</span>
                  </div>
                  {shipping > 0 && <p className="text-xs text-sky-600 bg-sky-50 rounded-lg px-3 py-2">Add ${(300 - subtotal).toFixed(2)} more for free shipping</p>}
                </div>
                <div className="border-t border-slate-100 pt-4 mb-5 flex justify-between">
                  <span className="font-bold text-navy-900">Total</span>
                  <span className="font-bold text-xl text-navy-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mb-5">
                  <input type="text" placeholder="Coupon code"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
                  <button className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">Apply</button>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </motion.button>
                <Link to="/products" className="block text-center mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
