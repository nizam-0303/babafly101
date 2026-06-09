import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Clock, ArrowRight, Zap, Wifi, Coffee, Tv } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { searchFlights } from '../../redux/slices/flightSlice';
import FlightSearchWidget from '../../components/product/FlightSearchWidget';

export default function FlightSearchResultsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { search, results, isSearching, airports } = useAppSelector(s => s.flight);
  const [sortFlights, setSortFlights] = useState('price_asc');
  const [classFilter, setClassFilter] = useState<string>('all');

  useEffect(() => {
    if (search.from && search.to) {
      dispatch(searchFlights(search));
    }
  }, []);

  const filtered = useMemo(() => {
    let flights = results;
    if (classFilter !== 'all') flights = flights.filter(f => f.class === classFilter);
    if (sortFlights === 'price_asc') flights = [...flights].sort((a, b) => a.price - b.price);
    else if (sortFlights === 'price_desc') flights = [...flights].sort((a, b) => b.price - a.price);
    else if (sortFlights === 'duration') flights = [...flights].sort((a, b) => a.stops - b.stops);
    else if (sortFlights === 'departure') flights = [...flights].sort((a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime());
    return flights;
  }, [results, classFilter, sortFlights]);

  const fromAirport = airports.find(a => a.code === search.from);
  const toAirport = airports.find(a => a.code === search.to);

  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (dt: string) => new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const CLASS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    economy: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Economy' },
    business: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Business' },
    first: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'First Class' },
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="bg-navy-900 -mt-20 pt-24 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FlightSearchWidget />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-3">
                {fromAirport?.city || search.from} <Plane className="w-5 h-5 text-sky-500" /> {toAirport?.city || search.to}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {search.departDate && formatDate(search.departDate + 'T00:00')}
                {search.tripType === 'roundTrip' && search.returnDate && ` — ${formatDate(search.returnDate + 'T00:00')}`}
                {' · '}{search.passengers} {search.passengers === 1 ? 'passenger' : 'passengers'}
              </p>
            </div>
            <select value={sortFlights} onChange={e => setSortFlights(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-navy-900 outline-none focus:border-sky-400 cursor-pointer">
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration">Fewest Stops</option>
              <option value="departure">Departure Time</option>
            </select>
          </div>

          <div className="flex gap-2 mb-6">
            {['all', 'economy', 'business', 'first'].map(cls => (
              <button key={cls} onClick={() => setClassFilter(cls)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  classFilter === cls ? 'bg-navy-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                {cls === 'all' ? 'All Classes' : cls === 'first' ? 'First Class' : cls.charAt(0).toUpperCase() + cls.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isSearching && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-6 bg-slate-200 rounded" />
                      <div className="space-y-2"><div className="w-24 h-5 bg-slate-200 rounded" /><div className="w-16 h-3 bg-slate-100 rounded" /></div>
                      <div className="w-20 h-4 bg-slate-200 rounded" />
                      <div className="space-y-2"><div className="w-24 h-5 bg-slate-200 rounded" /><div className="w-16 h-3 bg-slate-100 rounded" /></div>
                    </div>
                    <div className="w-20 h-8 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Plane className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">No flights found</h3>
              <p className="text-slate-500 text-sm mb-6">Try different airports, dates, or class.</p>
              <Link to="/" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors">Search Again</Link>
            </div>
          )}

          {!isSearching && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((flight, i) => {
                const badge = CLASS_BADGE[flight.class];
                const discount = Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);
                return (
                  <motion.div key={flight.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-white rounded-2xl shadow-card hover:shadow-card-lg transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/flights/${flight.id}`)}>
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-6 flex-1">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                              <Plane className="w-6 h-6 text-sky-500" />
                            </div>
                            <p className="text-xs font-semibold text-navy-900 mt-1.5 text-center">{flight.flightNo}</p>
                          </div>
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="text-center min-w-0">
                              <p className="text-2xl font-bold text-navy-900">{formatTime(flight.departure)}</p>
                              <p className="text-sm font-semibold text-sky-600">{flight.from.code}</p>
                              <p className="text-xs text-slate-400 truncate">{flight.from.city}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center min-w-0 px-2">
                              <p className="text-xs text-slate-500 font-medium mb-1">{flight.duration}</p>
                              <div className="w-full flex items-center gap-1">
                                <div className="h-px flex-1 bg-slate-200" />
                                {flight.stops === 0 ? <Plane className="w-4 h-4 text-sky-500 flex-shrink-0" /> : <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                                <div className="h-px flex-1 bg-slate-200" />
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                            </div>
                            <div className="text-center min-w-0">
                              <p className="text-2xl font-bold text-navy-900">{formatTime(flight.arrival)}</p>
                              <p className="text-sm font-semibold text-sky-600">{flight.to.code}</p>
                              <p className="text-xs text-slate-400 truncate">{flight.to.city}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 md:flex-shrink-0 md:border-l md:border-slate-100 md:pl-6">
                          <div className="text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${badge.bg} ${badge.text} mb-1`}>{badge.label}</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-navy-900">${flight.price}</span>
                              {discount > 0 && <span className="text-xs text-slate-400 line-through">${flight.originalPrice}</span>}
                            </div>
                            {discount > 0 && <p className="text-xs text-emerald-600 font-medium">Save {discount}%</p>}
                            <p className="text-xs text-slate-400 mt-0.5">per person</p>
                          </div>
                          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate(`/flights/${flight.id}`)}
                            className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 whitespace-nowrap flex items-center gap-1.5">
                            View Details <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{flight.duration}</span>
                        <span className="text-xs text-slate-500">{flight.aircraft}</span>
                        {flight.stops === 0 && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Zap className="w-3 h-3" />Non-stop</span>}
                        {flight.class !== 'economy' && <span className="text-xs text-sky-600 flex items-center gap-1"><Wifi className="w-3 h-3" />WiFi</span>}
                        {flight.class === 'first' && <span className="text-xs text-amber-600 flex items-center gap-1"><Coffee className="w-3 h-3" />Chef on board</span>}
                        {flight.class !== 'economy' && <span className="text-xs text-slate-500 flex items-center gap-1"><Tv className="w-3 h-3" />Entertainment</span>}
                        {flight.seatsLeft <= 10 && <span className="text-xs text-amber-600 font-semibold flex items-center gap-1"><Zap className="w-3 h-3" />Only {flight.seatsLeft} seats left</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
