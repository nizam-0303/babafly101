import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package, Plane } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const cartCount = useAppSelector(s => s.cart.items.reduce((a, i) => a + i.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Flights', path: '/flights/search' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
  ];

  const handleLogout = () => { dispatch(logout()); setUserMenuOpen(false); navigate('/'); };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-card border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${transparent ? 'bg-white/20' : 'bg-sky-500'}`}>
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${transparent ? 'text-white' : 'text-navy-900'}`}>
              Baba<span className={transparent ? 'text-sky-300' : 'text-sky-500'}>Fly</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? transparent ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-600'
                    : transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >{link.label}</Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
            }`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}>
                  <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-lg border border-slate-100 py-2 overflow-hidden"
                    >
                      <Link to="/flights/bookings" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <Plane className="w-4 h-4 text-slate-400" />My Bookings
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <Package className="w-4 h-4 text-slate-400" />My Orders
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  transparent ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm'
                }`}>
                <User className="w-4 h-4" />Sign In
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className={`relative p-2 rounded-xl transition-colors ${transparent ? 'text-white/80' : 'text-slate-600'}`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-xl transition-colors ${transparent ? 'text-white/80 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'bg-sky-50 text-sky-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}>{link.label}</Link>
              ))}
              <hr className="border-slate-100 my-2" />
              {user ? (
                <>
                  <Link to="/flights/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Plane className="w-4 h-4 text-slate-400" />My Bookings
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Package className="w-4 h-4 text-slate-400" />My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                  <User className="w-4 h-4" />Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
