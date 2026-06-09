import { Link } from 'react-router-dom';
import { Plane, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Baba<span className="text-sky-400">Fly</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Premium airline travel and luxury commerce platform. Elevate every journey with first-class experiences.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-3">
              {[{ label: 'Home', path: '/' }, { label: 'Products', path: '/products' }, { label: 'Categories', path: '/categories' }, { label: 'My Orders', path: '/orders' }, { label: 'Cart', path: '/cart' }].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-white text-sm transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {['Flight Booking', 'Lounge Access', 'Travel Insurance', 'Luxury Upgrades', 'Concierge Service'].map(s => (
                <li key={s}><span className="text-slate-400 text-sm">{s}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><Mail className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" /><span className="text-slate-400 text-sm">support@babafly.com</span></li>
              <li className="flex items-start gap-3"><Phone className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" /><span className="text-slate-400 text-sm">+1 (800) FLY-BABA</span></li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" /><span className="text-slate-400 text-sm">One Sky Tower, Dubai, UAE</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} BabaFly. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
