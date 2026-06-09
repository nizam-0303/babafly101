import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane, Clock, ArrowRight, Shield, Wifi, Coffee, Tv, Luggage,
  MapPin, Users, Zap, CheckCircle, Info, ChevronRight,
} from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchFlights, fetchAirports } from '../../redux/slices/flightSlice';
import { Flight } from '../../utils/types';
import { supabase } from '../../utils/supabase';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

interface DbFlightRow {
  id: string;
  airline: string;
  flight_no: string;
  from_code: string;
  to_code: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  original_price: number;
  seats_left: number;
  class: 'economy' | 'business' | 'first';
  stops: number;
  aircraft: string;
  from_airport: { code: string; city: string; name: string; country: string };
  to_airport: { code: string; city: string; name: string; country: string };
}

const mapFlight = (row: DbFlightRow): Flight => ({
  id: row.id,
  airline: row.airline,
  flightNo: row.flight_no,
  from: row.from_airport,
  to: row.to_airport,
  departure: row.departure,
  arrival: row.arrival,
  duration: row.duration,
  price: row.price,
  originalPrice: row.original_price,
  seatsLeft: row.seats_left,
  class: row.class,
  stops: row.stops,
  aircraft: row.aircraft,
});

const CLASS_LABEL: Record<string, string> = { economy: 'Economy', business: 'Business', first: 'First Class' };
const CLASS_COLOR: Record<string, string> = { economy: 'bg-slate-100 text-slate-600', business: 'bg-sky-100 text-sky-700', first: 'bg-amber-100 text-amber-700' };
const CLASS_ACCENT: Record<string, string> = { economy: 'sky', business: 'sky', first: 'amber' };

export default function FlightDetailPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { search, airports } = useAppSelector(s => s.flight);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (airports.length === 0) dispatch(fetchAirports());
  }, [dispatch, airports.length]);

  useEffect(() => {
    const fetchFlight = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('flights')
        .select(`*, from_airport:airports!flights_from_code_fkey(code, city, name, country), to_airport:airports!flights_to_code_fkey(code, city, name, country)`)
        .eq('id', flightId)
        .maybeSingle();
      if (!error && data) setFlight(mapFlight(data as unknown as DbFlightRow));
      setLoading(false);
    };
    if (flightId) fetchFlight();
  }, [flightId]);

  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (dt: string) => new Date(dt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formatShortDate = (dt: string) => new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const passengers = search.passengers || 1;
  const totalPrice = flight ? flight.price * passengers : 0;
  const taxes = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + taxes;
  const discount = flight ? Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100) : 0;

  const AMENITIES: Record<string, { icon: typeof Wifi; label: string; available: boolean }[]> = {
    economy: [
      { icon: Luggage, label: '23kg checked baggage', available: true },
      { icon: Tv, label: 'Seatback entertainment', available: true },
      { icon: Coffee, label: 'Complimentary meals', available: true },
      { icon: Wifi, label: 'WiFi (paid)', available: true },
      { icon: Shield, label: 'Travel insurance', available: false },
      { icon: Users, label: 'Priority boarding', available: false },
    ],
    business: [
      { icon: Luggage, label: '32kg checked baggage', available: true },
      { icon: Tv, label: 'Premium entertainment', available: true },
      { icon: Coffee, label: 'Chef-curated dining', available: true },
      { icon: Wifi, label: 'Complimentary WiFi', available: true },
      { icon: Shield, label: 'Travel insurance included', available: true },
      { icon: Users, label: 'Priority boarding', available: true },
      { icon: Zap, label: 'Lounge access', available: true },
      { icon: CheckCircle, label: 'Lie-flat seat', available: true },
    ],
    first: [
      { icon: Luggage, label: '40kg checked baggage + carry-on', available: true },
      { icon: Tv, label: 'Private suite with entertainment', available: true },
      { icon: Coffee, label: 'On-demand chef service', available: true },
      { icon: Wifi, label: 'Premium WiFi included', available: true },
      { icon: Shield, label: 'Comprehensive travel insurance', available: true },
      { icon: Users, label: 'Private check-in & boarding', available: true },
      { icon: Zap, label: 'First-class lounge access', available: true },
      { icon: CheckCircle, label: 'Fully enclosed suite', available: true },
      { icon: Info, label: 'Chauffeur drive service', available: true },
    ],
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="bg-white rounded-2xl p-8 space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-12 bg-slate-100 rounded w-full" />
                <div className="h-6 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!flight) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Flight not found</h2>
            <p className="text-slate-500 text-sm mb-6">This flight may no longer be available.</p>
            <Link to="/flights/search" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors">Search Flights</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const amenities = AMENITIES[flight.class] || AMENITIES.economy;

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav {...fadeUp} transition={{ duration: 0.4 }} className="flex items-center gap-2 mb-6 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to="/flights/search" className="text-slate-400 hover:text-slate-600 transition-colors">Search Results</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-navy-900 font-medium">{flight.flightNo}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Main flight card */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-card overflow-hidden">
                {/* Header bar */}
                <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{flight.airline} {flight.flightNo}</p>
                      <p className="text-xs text-slate-400">{flight.aircraft}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${CLASS_COLOR[flight.class]}`}>
                    {CLASS_LABEL[flight.class]}
                  </span>
                </div>

                {/* Route visual */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    {/* Departure */}
                    <div className="text-center flex-1">
                      <p className="text-4xl md:text-5xl font-bold text-navy-900">{formatTime(flight.departure)}</p>
                      <p className="text-lg font-bold text-sky-600 mt-1">{flight.from.code}</p>
                      <p className="text-sm text-slate-500">{flight.from.city}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{flight.from.name}</p>
                    </div>

                    {/* Duration line */}
                    <div className="flex-1 flex flex-col items-center px-4 md:px-8">
                      <p className="text-sm text-slate-600 font-semibold mb-2">{flight.duration}</p>
                      <div className="w-full flex items-center gap-1 relative">
                        <div className="h-px flex-1 bg-slate-200" />
                        {flight.stops === 0 ? (
                          <>
                            <div className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0" />
                            <div className="h-px flex-1 bg-sky-200" />
                            <Plane className="w-5 h-5 text-sky-500 flex-shrink-0 -rotate-0" />
                            <div className="h-px flex-1 bg-sky-200" />
                            <div className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0" />
                          </>
                        ) : (
                          <>
                            <div className="h-px flex-1 bg-slate-200" />
                            <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0 border-2 border-white shadow-sm" />
                            <div className="h-px flex-1 bg-slate-200" />
                          </>
                        )}
                      </div>
                      <p className={`text-sm font-medium mt-2 ${flight.stops === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    {/* Arrival */}
                    <div className="text-center flex-1">
                      <p className="text-4xl md:text-5xl font-bold text-navy-900">{formatTime(flight.arrival)}</p>
                      <p className="text-lg font-bold text-sky-600 mt-1">{flight.to.code}</p>
                      <p className="text-sm text-slate-500">{flight.to.city}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{flight.to.name}</p>
                    </div>
                  </div>

                  {/* Date and stops info */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{formatDate(flight.departure)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{flight.from.country} → {flight.to.country}</span>
                    </div>
                    {flight.seatsLeft <= 10 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold">
                        <Zap className="w-4 h-4" />
                        <span>Only {flight.seatsLeft} seats left at this price</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Fare breakdown card */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-navy-900 mb-6">What's Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map(a => (
                    <div key={a.label}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${a.available ? 'bg-slate-50' : 'bg-slate-50/50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        a.available ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-300'
                      }`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${a.available ? 'text-navy-900' : 'text-slate-400 line-through'}`}>{a.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Flight timeline */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-navy-900 mb-6">Flight Timeline</h2>
                <div className="space-y-0">
                  {/* Check-in */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0" />
                      <div className="w-px flex-1 bg-slate-200" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-bold text-navy-900">Check-in & Boarding</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {flight.class === 'first' ? 'Private terminal check-in, chauffeur to gate' :
                         flight.class === 'business' ? 'Priority check-in counter, fast-track security' :
                         'Standard check-in, online check-in available 24h before'}
                      </p>
                    </div>
                  </div>
                  {/* Departure */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0" />
                      <div className="w-px flex-1 bg-slate-200" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-bold text-navy-900">Departure — {formatTime(flight.departure)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{flight.from.name}, {flight.from.city}</p>
                    </div>
                  </div>
                  {/* In-flight */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-sky-400 flex-shrink-0" />
                      <div className="w-px flex-1 bg-slate-200" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-bold text-navy-900">In-flight — {flight.duration}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {flight.class === 'first' ? 'Private suite, on-demand fine dining, personal attendant' :
                         flight.class === 'business' ? 'Lie-flat seat, premium dining, personal space' :
                         'Comfortable seating, meal service, entertainment'}
                      </p>
                    </div>
                  </div>
                  {flight.stops > 0 && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                        <div className="w-px flex-1 bg-slate-200" />
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-bold text-navy-900">Layover — {flight.stops} stop</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {flight.class !== 'economy' ? 'Lounge access during layover' : 'Transit area available'}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Arrival */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">Arrival — {formatTime(flight.arrival)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{flight.to.name}, {flight.to.city}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cancellation policy */}
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-navy-900 mb-4">Cancellation Policy</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-navy-900">Free cancellation within 24 hours</p>
                      <p className="text-xs text-slate-500">Full refund if cancelled within 24 hours of booking.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-navy-900">Flexible changes up to 48h before departure</p>
                      <p className="text-xs text-slate-500">Change your flight date or time with no change fee.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-navy-900">No refund after departure</p>
                      <p className="text-xs text-slate-500">Unused tickets are non-refundable after the departure time.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1">
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-2xl shadow-card p-6 sticky top-24 space-y-5">
                {/* Price header */}
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-navy-900">${flight.price}</span>
                    {discount > 0 && <span className="text-sm text-slate-400 line-through">${flight.originalPrice}</span>}
                  </div>
                  {discount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                      <Zap className="w-3 h-3" />Save {discount}%
                    </span>
                  )}
                  <p className="text-xs text-slate-400 mt-1">per person, {CLASS_LABEL[flight.class]}</p>
                </div>

                {/* Price breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Base fare ({passengers} x ${flight.price})</span>
                    <span className="font-medium text-navy-900">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Taxes & fees</span>
                    <span className="font-medium text-navy-900">${taxes}</span>
                  </div>
                  {flight.originalPrice > flight.price && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Member discount</span>
                      <span className="text-emerald-600 font-medium">-${(flight.originalPrice - flight.price) * passengers}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="font-bold text-navy-900">Grand Total</span>
                  <span className="font-bold text-2xl text-navy-900">${grandTotal}</span>
                </div>

                {/* Book button */}
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate(`/flights/book/${flight.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm">
                  Book This Flight <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Quick info */}
                <div className="space-y-2 pt-2">
                  {[
                    { icon: Clock, text: `${flight.duration} flight time` },
                    { icon: Plane, text: flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop` },
                    { icon: Luggage, text: flight.class === 'economy' ? '23kg baggage' : flight.class === 'business' ? '32kg baggage' : '40kg baggage' },
                    { icon: Shield, text: 'Free 24h cancellation' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-slate-500">
                      <item.icon className="w-3.5 h-3.5 text-slate-400" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
