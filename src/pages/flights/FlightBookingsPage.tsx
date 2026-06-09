import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, CheckCircle, XCircle, Calendar, Users, ArrowRight, Ticket } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBookings, cancelBooking } from '../../redux/slices/flightSlice';
import toast from 'react-hot-toast';

export default function FlightBookingsPage() {
  const dispatch = useAppDispatch();
  const { bookedFlights, isLoadingBookings } = useAppSelector(s => s.flight);

  useEffect(() => { dispatch(fetchBookings()); }, [dispatch]);

  const handleCancel = async (id: string) => {
    try {
      await dispatch(cancelBooking(id)).unwrap();
      toast.success('Booking cancelled', { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
    } catch {
      toast.error('Failed to cancel booking', { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
    }
  };

  const formatDate = (dt: string) => new Date(dt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const STATUS: Record<string, { icon: typeof CheckCircle; bg: string; text: string; border: string; label: string }> = {
    confirmed: { icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Confirmed' },
    cancelled: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', label: 'Cancelled' },
  };

  const CLASS_COLOR: Record<string, string> = { economy: 'bg-slate-100 text-slate-600', business: 'bg-sky-100 text-sky-700', first: 'bg-amber-100 text-amber-700' };
  const CLASS_LABEL: Record<string, string> = { economy: 'Economy', business: 'Business', first: 'First Class' };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sky-500 text-sm font-semibold uppercase tracking-wider mb-1">My Flights</p>
              <h1 className="text-3xl font-bold text-navy-900">Flight Bookings</h1>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-700 transition-colors">
              Book New Flight <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingBookings && (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {!isLoadingBookings && bookedFlights.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">No bookings yet</h3>
              <p className="text-slate-500 text-sm mb-6">Book your first flight and it will appear here.</p>
              <Link to="/" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-colors">Search Flights</Link>
            </div>
          )}

          {!isLoadingBookings && bookedFlights.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence>
                {bookedFlights.map((booking, i) => {
                  const status = STATUS[booking.status];
                  const StatusIcon = status.icon;
                  const flight = booking.flight;
                  return (
                    <motion.div key={booking.id}
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="bg-white rounded-2xl shadow-card overflow-hidden">
                      <div className="p-5 md:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                              <Plane className="w-5 h-5 text-sky-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-navy-900 font-mono">{booking.bookingRef}</p>
                              <p className="text-xs text-slate-400">{formatDate(booking.bookingDate)}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                            <StatusIcon className="w-3 h-3" />{status.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-navy-900">{formatTime(flight.departure)}</p>
                            <p className="text-sm font-semibold text-sky-600">{flight.from.code}</p>
                            <p className="text-xs text-slate-400">{flight.from.city}</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-4">
                            <p className="text-xs text-slate-500">{flight.duration}</p>
                            <div className="w-full flex items-center gap-1"><div className="h-px flex-1 bg-slate-200" /><Plane className="w-4 h-4 text-sky-500" /><div className="h-px flex-1 bg-slate-200" /></div>
                            <p className="text-xs text-slate-400">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-navy-900">{formatTime(flight.arrival)}</p>
                            <p className="text-sm font-semibold text-sky-600">{flight.to.code}</p>
                            <p className="text-xs text-slate-400">{flight.to.city}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(flight.departure)}</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${CLASS_COLOR[flight.class]}`}>{CLASS_LABEL[flight.class]}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.passengers} {booking.passengers === 1 ? 'passenger' : 'passengers'}</span>
                          <span>{flight.flightNo} · {flight.aircraft}</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-400">Total paid</p>
                            <p className="text-lg font-bold text-navy-900">${booking.totalPrice}</p>
                          </div>
                          {booking.status === 'confirmed' && (
                            <button onClick={() => handleCancel(booking.id)}
                              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
