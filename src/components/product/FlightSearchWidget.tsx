import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, ArrowRightLeft, Users, Calendar, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setSearch, fetchAirports } from '../../redux/slices/flightSlice';

export default function FlightSearchWidget() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { search, airports } = useAppSelector(s => s.flight);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => { if (airports.length === 0) dispatch(fetchAirports()); }, [dispatch, airports.length]);

  const filteredFrom = airports.filter(a =>
    a.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredTo = airports.filter(a =>
    a.code.toLowerCase().includes(toQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(toQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(toQuery.toLowerCase())
  );

  const selectFrom = (code: string) => {
    dispatch(setSearch({ from: code }));
    setFromQuery(airports.find(a => a.code === code)?.city || '');
    setShowFrom(false);
  };

  const selectTo = (code: string) => {
    dispatch(setSearch({ to: code }));
    setToQuery(airports.find(a => a.code === code)?.city || '');
    setShowTo(false);
  };

  const swapAirports = () => {
    const prevFrom = search.from;
    const prevTo = search.to;
    dispatch(setSearch({ from: prevTo, to: prevFrom }));
    setFromQuery(airports.find(a => a.code === prevTo)?.city || '');
    setToQuery(airports.find(a => a.code === prevFrom)?.city || '');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.from || !search.to || !search.departDate) return;
    navigate('/flights/search');
  };

  const fromAirport = airports.find(a => a.code === search.from);
  const toAirport = airports.find(a => a.code === search.to);

  return (
    <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 md:p-6">
      {/* Trip type + class toggles */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['roundTrip', 'oneWay'] as const).map(type => (
          <button key={type} type="button" onClick={() => dispatch(setSearch({ tripType: type }))}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              search.tripType === type ? 'bg-sky-500 text-white shadow-sm' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>
            {type === 'roundTrip' ? 'Round Trip' : 'One Way'}
          </button>
        ))}
        {(['economy', 'business', 'first'] as const).map(cls => (
          <button key={cls} type="button" onClick={() => dispatch(setSearch({ cabinClass: cls }))}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              search.cabinClass === cls ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>
            {cls.charAt(0).toUpperCase() + cls.slice(1)}
          </button>
        ))}
      </div>

      {/* Search fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* From */}
        <div className="relative">
          <label className="block text-xs text-white/50 font-medium mb-1.5">From</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 rotate-45" />
            <input value={fromAirport ? `${fromAirport.city} (${fromAirport.code})` : fromQuery}
              onChange={e => { setFromQuery(e.target.value); dispatch(setSearch({ from: '' })); setShowFrom(true); }}
              onFocus={() => setShowFrom(true)} placeholder="City or airport"
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 outline-none focus:border-sky-400 transition-all" />
          </div>
          {showFrom && fromQuery && !search.from && filteredFrom.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-card-lg border border-slate-100 max-h-48 overflow-y-auto z-20">
              {filteredFrom.slice(0, 8).map(a => (
                <button key={a.code} type="button" onClick={() => selectFrom(a.code)}
                  className="w-full text-left px-3 py-2.5 hover:bg-sky-50 transition-colors flex items-center justify-between">
                  <div><span className="text-sm font-semibold text-navy-900">{a.city}</span> <span className="text-xs text-slate-400">- {a.name}</span></div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{a.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap */}
        <div className="hidden lg:flex items-end justify-center pb-0.5">
          <button type="button" onClick={swapAirports}
            className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all">
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To */}
        <div className="relative">
          <label className="block text-xs text-white/50 font-medium mb-1.5">To</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 -rotate-45" />
            <input value={toAirport ? `${toAirport.city} (${toAirport.code})` : toQuery}
              onChange={e => { setToQuery(e.target.value); dispatch(setSearch({ to: '' })); setShowTo(true); }}
              onFocus={() => setShowTo(true)} placeholder="City or airport"
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 outline-none focus:border-sky-400 transition-all" />
          </div>
          {showTo && toQuery && !search.to && filteredTo.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-card-lg border border-slate-100 max-h-48 overflow-y-auto z-20">
              {filteredTo.slice(0, 8).map(a => (
                <button key={a.code} type="button" onClick={() => selectTo(a.code)}
                  className="w-full text-left px-3 py-2.5 hover:bg-sky-50 transition-colors flex items-center justify-between">
                  <div><span className="text-sm font-semibold text-navy-900">{a.city}</span> <span className="text-xs text-slate-400">- {a.name}</span></div>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{a.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Depart Date */}
        <div>
          <label className="block text-xs text-white/50 font-medium mb-1.5">Depart</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <input type="date" value={search.departDate}
              onChange={e => dispatch(setSearch({ departDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-sky-400 transition-all [color-scheme:dark]" />
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {search.tripType === 'roundTrip' && (
          <div>
            <label className="block text-xs text-white/50 font-medium mb-1.5">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
              <input type="date" value={search.returnDate}
                onChange={e => dispatch(setSearch({ returnDate: e.target.value }))}
                min={search.departDate || new Date().toISOString().split('T')[0]}
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-sky-400 transition-all [color-scheme:dark]" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs text-white/50 font-medium mb-1.5">Passengers</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <select value={search.passengers}
              onChange={e => dispatch(setSearch({ passengers: +e.target.value }))}
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm outline-none focus:border-sky-400 appearance-none cursor-pointer transition-all">
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} className="text-navy-900">{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <motion.button type="submit" whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-200 shadow-sm">
            <Search className="w-4 h-4" />Search Flights
          </motion.button>
        </div>
      </div>

      {/* Mobile swap */}
      <div className="lg:hidden flex justify-center mt-2">
        <button type="button" onClick={swapAirports}
          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
