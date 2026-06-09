import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Plane, ArrowRight, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loginStart, loginSuccess } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().min(2, 'Min 2 chars').required('Full name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password'),
});
type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(s => s.auth);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    dispatch(loginStart());
    await new Promise(r => setTimeout(r, 1000));
    dispatch(loginSuccess({ id: 'new_' + Date.now(), name: data.name, email: data.email, token: 'jwt_' + Date.now() }));
    toast.success('Account created! Welcome to BabaFly!', { style: { borderRadius: '12px', background: '#0F172A', color: '#fff' } });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-900/70 to-sky-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Plane className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-bold text-white">Baba<span className="text-sky-300">Fly</span></span>
          </Link>
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">Join the Elite<br />Flying Club</h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">Create your premium account and unlock exclusive access to first-class upgrades, lounge passes, and luxury travel experiences.</p>
              <div className="space-y-3">
                {['Exclusive member-only pricing', 'Priority boarding on all flights', 'Dedicated concierge service', 'Earn miles on every purchase'].map(perk => (
                  <div key={perk} className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md py-8">
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center"><Plane className="w-4 h-4 text-white" /></div>
            <span className="text-xl font-bold text-navy-900">Baba<span className="text-sky-500">Fly</span></span>
          </Link>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Create account</h2>
            <p className="text-slate-500">Join millions of premium travelers</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { field: 'name', label: 'Full name', placeholder: 'Alex Johnson', type: 'text', Icon: User },
              { field: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email', Icon: Mail },
            ].map(({ field, label, placeholder, type, Icon }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input {...register(field as any)} type={type} placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-white transition-all ${errors[field as keyof FormData] ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`} />
                </div>
                {errors[field as keyof FormData] && <p className="mt-1.5 text-xs text-red-500">{errors[field as keyof FormData]?.message}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none bg-white transition-all ${errors.password ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('confirmPassword')} type="password" placeholder="Repeat password"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none bg-white transition-all ${errors.confirmPassword ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`} />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <p className="text-xs text-slate-400">By creating an account you agree to our <a href="#" className="text-sky-600 hover:underline">Terms</a> and <a href="#" className="text-sky-600 hover:underline">Privacy Policy</a>.</p>
            <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
