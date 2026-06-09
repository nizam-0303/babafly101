import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Headphones, Plane, TrendingUp, Zap } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import FlightSearchWidget from '../../components/product/FlightSearchWidget';
import { MOCK_PRODUCTS, CATEGORIES } from '../../utils/mockData';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

export default function HomePage() {
  const navigate = useNavigate();
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.badge).slice(0, 4);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/1058959/pexels-photo-1058959.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Luxury travel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 via-navy-900/80 to-sky-900/70" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/5 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />New: Premium First Class Bundles Available
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Travel First Class.<br />
              <span className="text-sky-400">Live Premium.</span>
            </motion.h1>
            <motion.p {...fadeUp} transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl text-slate-300 leading-relaxed mb-6 max-w-2xl mx-auto">
              Book flights worldwide and discover exclusive upgrades, luxury accessories, and premium services.
            </motion.p>
          </div>

          {/* Flight Search Widget */}
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.4 }} className="max-w-4xl mx-auto">
            <FlightSearchWidget />
          </motion.div>

          {/* Popular routes */}
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-3 mt-6 max-w-4xl mx-auto">
            <span className="text-slate-400 text-sm">Popular routes:</span>
            {[
              { from: 'Dubai', to: 'New York' },
              { from: 'Dubai', to: 'London' },
              { from: 'London', to: 'Paris' },
              { from: 'Singapore', to: 'Tokyo' },
            ].map(route => (
              <button key={`${route.from}-${route.to}`}
                onClick={() => navigate(`/flights/search?from=${route.from}&to=${route.to}`)}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-slate-300 text-xs hover:bg-white/20 hover:text-white transition-all duration-200 flex items-center gap-1.5">
                {route.from} <Plane className="w-3 h-3" /> {route.to}
              </button>
            ))}
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Plane, value: '180+', label: 'Destinations' },
              { icon: Star, value: '4.9★', label: 'Avg. Rating' },
              { icon: TrendingUp, value: '2M+', label: 'Happy Travelers' },
              { icon: Shield, value: '100%', label: 'Secure Booking' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-none">{value}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sky-500 text-sm font-semibold uppercase tracking-wider mb-2">Browse by Category</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900">What are you looking for?</h2>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
              All categories <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Link to={`/categories?cat=${cat.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-50`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg leading-tight">{cat.name}</h3>
                      <p className="text-white/70 text-xs mt-1">{cat.count} products</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sky-500 text-sm font-semibold uppercase tracking-wider mb-2">Hand-picked for you</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E293B 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                  <Zap className="w-3 h-3" />Limited Time Offer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Get 30% Off Your<br />First Premium Order</h2>
                <p className="text-slate-400 mb-6">
                  Use code <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">BABAFLY30</span> at checkout. New members only.
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-200">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden md:block animate-float">
                <img src="https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Airplane" className="w-72 rounded-2xl opacity-80 object-cover h-48" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why BabaFly */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-sky-500 text-sm font-semibold uppercase tracking-wider mb-2">Why BabaFly?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900">The Premium Experience</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Secure & Trusted', desc: 'All transactions are encrypted with bank-level security. Your data and payments are always protected.', color: 'text-sky-500 bg-sky-50' },
              { icon: Headphones, title: '24/7 Concierge', desc: 'Our premium support team is available around the clock to assist with any travel needs.', color: 'text-amber-500 bg-amber-50' },
              { icon: Plane, title: 'Instant Booking', desc: 'Seamless booking experience with instant confirmation and digital delivery for all products.', color: 'text-emerald-500 bg-emerald-50' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-slate-100 hover:shadow-card transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-navy-900 font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sky-500 text-sm font-semibold uppercase tracking-wider mb-2">Trending Now</p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900">Top Picks This Week</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.slice(4, 8).map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
