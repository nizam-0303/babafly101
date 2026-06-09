import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Clock, ArrowRight, CheckCircle, Shield, Wifi, Coffee, Luggage, User, Mail, Phone, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MainLayout from '../../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchFlights, createBooking } from '../../redux/slices/flightSlice';
import { Flight } from '../../utils/types';
import toast from 'react-hot-toast';

const schema = yup.object({
  firstName: yup.string().required('First name required'),
  lastName: yup.string().required('Last name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  phone: yup.string().min(7, 'Invalid phone').required('Phone required'),
});
type FormData = yup.InferType<typeof schema>;

export default function FlightBookingPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { results, search } = useAppSelector(s => s.flight);

  const flight = results.find(f => f.id === flightId);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  if (!flight) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Flight not found</h2>
            <Link to="/" className="text-sky-600 font-medium">Search flights</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalPrice = flight.price * search.passengers;
  const taxes = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + taxes;

  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (dt: string) => new Date(dt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const CLASS_LABEL: Record<string, string> = { economy: 'Economy', business: 'Business', first: 'First Class' };
  const CLASS_COLOR: Record<string, string> = { economy: 'bg-slate-100 text-slate-600', business: 'bg-sky-100 text-sky-700', first: 'bg-amber-100 text-amber-700' };

  const onSubmit = async (data: FormData) => {
    setBooking(true);
    try {
      const result = await dispatch(createBooking({
        flight, passengers: search.passengers,
        passengerName: `${data.firstName} ${data.lastName}`,
        passengerEmail: data.email,
        passengerPhone: data.phone,
      })).unwrap();
      setBookingRef(result.bookingRef);
      setBooked(true);
      toast.success('Flight booked successfully!', { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
    } catch {
      toast.error('Booking failed. Please try again.', { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
    }
    setBooking(false);
  };

  if (booked) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-card-xl p-10 text-center max-w-lg w-full mx-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 text-sm mb-1">Your booking reference is</p>
            <p className="text-2xl font-mono font-bold text-sky-600 mb-4">{bookingRef}</p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center justify-between mb-2"><span className="text-sm text-slate-500">Route</span><span className="text-sm font-semibold text-navy-900">{flight.from.city} → {flight.to.city}</span></div>
              <div className="flex items-center justify-between mb-2"><span className="text-sm text-slate-500">Flight</span><span className="text-sm font-semibold text-navy-900">{flight.flightNo}</span></div>
              <div className="flex items-center justify-between mb-2"><span className="text-sm text-slate-500">Date</span><span className="text-sm font-semibold text-navy-900">{formatDate(flight.departure)}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Total Paid</span><span className="text-sm font-bold text-navy-900">${grandTotal}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/flights/bookings')} className="flex-1 py-3 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-700 transition-colors">My Bookings</button>
              <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Home</button>
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
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link to="/flights/search" className="text-slate-400 hover:text-slate-600 transition-colors">Search Results</Link>
            <span className="text-slate-300">/</span>
            <span className="text-navy-900 font-medium">Booking</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Flight summary */}
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-sky-400" />
                    <span className="font-bold">{flight.flightNo}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${CLASS_COLOR[flight.class]}`}>{CLASS_LABEL[flight.class]}</span>
                  </div>
                  <span className="text-sm text-slate-300">{flight.aircraft}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-navy-900">{formatTime(flight.departure)}</p>
                      <p className="text-sm font-semibold text-sky-600">{flight.from.code}</p>
                      <p className="text-xs text-slate-400">{flight.from.city}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <p className="text-xs text-slate-500 mb-1">{flight.duration}</p>
                      <div className="w-full flex items-center gap-1"><div className="h-px flex-1 bg-slate-200" /><Plane className="w-4 h-4 text-sky-500" /><div className="h-px flex-1 bg-slate-200" /></div>
                      <p className="text-xs text-slate-400 mt-1">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-navy-900">{formatTime(flight.arrival)}</p>
                      <p className="text-sm font-semibold text-sky-600">{flight.to.code}</p>
                      <p className="text-xs text-slate-400">{flight.to.city}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(flight.departure)}</span>
                    {flight.class !== 'economy' && <span className="flex items-center gap-1"><Wifi className="w-3 h-3" />WiFi</span>}
                    {flight.class === 'first' && <span className="flex items-center gap-1"><Coffee className="w-3 h-3" />Chef on board</span>}
                    <span className="flex items-center gap-1"><Luggage className="w-3 h-3" />{flight.class === 'economy' ? '23kg' : flight.class === 'business' ? '32kg' : '40kg'} baggage</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" />Travel protection</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="text-lg font-bold text-navy-900 mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-sky-500" />Passenger Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">First Name</label>
                      <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input {...register('firstName')} placeholder="Alex" className={inputClass(!!errors.firstName)} style={{ paddingLeft: '2.2rem' }} /></div>
                      {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Last Name</label>
                      <input {...register('lastName')} placeholder="Johnson" className={inputClass(!!errors.lastName)} />
                      {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Email</label>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input {...register('email')} type="email" placeholder="you@example.com" className={inputClass(!!errors.email)} style={{ paddingLeft: '2.2rem' }} /></div>
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-900 mb-1.5">Phone</label>
                      <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input {...register('phone')} placeholder="+1 234 567 8900" className={inputClass(!!errors.phone)} style={{ paddingLeft: '2.2rem' }} /></div>
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">Booking for {search.passengers} {search.passengers === 1 ? 'passenger' : 'passengers'} in {CLASS_LABEL[flight.class]}</p>

                  <h3 className="text-lg font-bold text-navy-900 mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />Payment
                  </h3>
                  <div className="space-y-3 mb-5">
                    {['Credit / Debit Card', 'PayPal', 'Apple Pay'].map((method, i) => (
                      <label key={method} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-300 transition-all">
                        <input type="radio" name="payment" defaultChecked={i === 0} className="text-sky-500" />
                        <span className="text-sm font-medium text-navy-900">{method}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2"><input placeholder="Card number" className={inputClass(false)} /></div>
                    <input placeholder="MM / YY" className={inputClass(false)} />
                    <input placeholder="CVV" className={inputClass(false)} />
                  </div>

                  <motion.button type="submit" disabled={booking} whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {booking ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing Booking...</>
                    ) : (
                      <>Confirm Booking — ${grandTotal} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h3 className="text-lg font-bold text-navy-900 mb-4">Price Breakdown</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Base fare ({search.passengers} x ${flight.price})</span><span className="font-medium text-navy-900">${totalPrice}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Taxes & fees</span><span className="font-medium text-navy-900">${taxes}</span></div>
                  {flight.originalPrice > flight.price && (
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Member discount</span><span className="text-emerald-600 font-medium">-${(flight.originalPrice - flight.price) * search.passengers}</span></div>
                  )}
                </div>
                <div className="border-t border-slate-100 pt-4 mb-5 flex justify-between">
                  <span className="font-bold text-navy-900">Grand Total</span>
                  <span className="font-bold text-2xl text-navy-900">${grandTotal}</span>
                </div>
                <div className="bg-sky-50 rounded-xl p-3 text-xs text-sky-700">
                  <Shield className="w-3.5 h-3.5 inline mr-1" />Free cancellation within 24 hours of booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
