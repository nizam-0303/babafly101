import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { clearCart } from '../../redux/slices/cartSlice';

const schema = yup.object({
  firstName: yup.string().required('First name required'),
  lastName: yup.string().required('Last name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  phone: yup.string().min(7, 'Invalid phone').required('Phone required'),
  address: yup.string().required('Address required'),
  city: yup.string().required('City required'),
  country: yup.string().required('Country required'),
  zip: yup.string().required('ZIP required'),
});
type FormData = yup.InferType<typeof schema>;

export default function CheckoutPage() {
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId] = useState(() => 'BF-' + Date.now().toString().slice(-6));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector(s => s.cart);
  const { user } = useAppSelector(s => s.auth);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const shipping = subtotal > 300 ? 0 : 29;
  const total = subtotal - discount + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: user?.email || '' },
  });

  const onSubmit = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    dispatch(clearCart());
    setPlacing(false);
    setPlaced(true);
  };

  if (items.length === 0 && !placed) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-navy-900 mb-2">Your cart is empty</h2>
            <button onClick={() => navigate('/products')} className="text-sky-600 font-medium text-sm">Browse products</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (placed) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-card-xl p-10 text-center max-w-md w-full mx-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 text-sm mb-4">
              Your order <span className="font-mono font-bold text-navy-900">{orderId}</span> has been placed successfully.
            </p>
            <p className="text-slate-400 text-xs mb-8">A confirmation email will be sent to <span className="text-navy-900 font-medium">{user?.email}</span></p>
            <div className="flex gap-3">
              <button onClick={() => navigate('/orders')} className="flex-1 py-3 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-700 transition-colors">View Orders</button>
              <button onClick={() => navigate('/products')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Shop More</button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${hasError ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`;

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8"><h1 className="text-3xl font-bold text-navy-900">Checkout</h1></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-sky-500" /></div>
                    <h3 className="text-base font-bold text-navy-900">Shipping Address</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">First Name</label>
                      <input {...register('firstName')} placeholder="Alex" className={inputClass(!!errors.firstName)} />
                      {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Last Name</label>
                      <input {...register('lastName')} placeholder="Johnson" className={inputClass(!!errors.lastName)} />
                      {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Email</label>
                      <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass(!!errors.email)} />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Phone</label>
                      <input {...register('phone')} placeholder="+1 234 567 8900" className={inputClass(!!errors.phone)} />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Address</label>
                      <input {...register('address')} placeholder="123 Sky Tower, Unit 4A" className={inputClass(!!errors.address)} />
                      {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">City</label>
                      <input {...register('city')} placeholder="Dubai" className={inputClass(!!errors.city)} />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Country</label>
                      <input {...register('country')} placeholder="UAE" className={inputClass(!!errors.country)} />
                      {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">ZIP Code</label>
                      <input {...register('zip')} placeholder="12345" className={inputClass(!!errors.zip)} />
                      {errors.zip && <p className="mt-1 text-xs text-red-500">{errors.zip.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><CreditCard className="w-4 h-4 text-amber-500" /></div>
                    <h3 className="text-base font-bold text-navy-900">Payment Method</h3>
                  </div>
                  <div className="space-y-3 mb-4">
                    {['Credit / Debit Card', 'PayPal', 'Apple Pay'].map((method, i) => (
                      <label key={method} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-300 hover:bg-sky-50/50 transition-all">
                        <input type="radio" name="payment" defaultChecked={i === 0} className="text-sky-500" />
                        <span className="text-sm font-medium text-navy-900">{method}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2"><input placeholder="Card number" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" /></div>
                    <input placeholder="MM / YY" className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
                    <input placeholder="CVV" className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-navy-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-navy-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">x{item.qty}</p>
                        </div>
                        <span className="text-xs font-semibold text-navy-900">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-slate-100 mb-4" />
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium text-navy-900">${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Discount</span><span className="text-emerald-600 font-medium">-${discount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping}`}</span></div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 mb-5 flex justify-between">
                    <span className="font-bold text-navy-900">Total</span>
                    <span className="font-bold text-xl text-navy-900">${total.toFixed(2)}</span>
                  </div>
                  <motion.button type="submit" disabled={placing} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {placing ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order...</>
                    ) : (
                      <>Place Order <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
