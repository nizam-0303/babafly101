import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginStart, loginSuccess } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});
type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(s => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    dispatch(loginStart());
    await new Promise(r => setTimeout(r, 1000));
    dispatch(loginSuccess({ id: '1', name: 'Alex Johnson', email: data.email, token: 'jwt_' + Date.now() }));
    toast.success('Welcome back to BabaFly!', { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Cabin" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-900/70 to-sky-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Baba<span className="text-sky-300">Fly</span></span>
          </Link>
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Premium Access</span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">Elevate Every<br />Journey With Us</h1>
              <p className="text-slate-300 text-lg leading-relaxed">Access exclusive first-class perks, luxury upgrades, and premium travel services curated for the discerning traveler.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 grid grid-cols-3 gap-4">
              {[{ value: '2M+', label: 'Travelers' }, { value: '180+', label: 'Destinations' }, { value: '4.9★', label: 'Rating' }].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center"><Plane className="w-4 h-4 text-white" /></div>
            <span className="text-xl font-bold text-navy-900">Baba<span className="text-sky-500">Fly</span></span>
          </Link>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">
              {from !== '/' ? 'Sign in to continue' : 'Welcome back'}
            </h2>
            <p className="text-slate-500">
              {from !== '/' ? 'Please sign in to access BabaFly.' : 'Sign in to your BabaFly account'}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-white transition-all ${errors.email ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`} />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none bg-white transition-all ${errors.password ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />Remember me
              </label>
              <a href="#" className="text-sm text-sky-600 hover:text-sky-700 font-medium">Forgot password?</a>
            </div>
            <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-glow-blue disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 hover:text-sky-700 font-semibold">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
