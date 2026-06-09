import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { MOCK_ORDERS } from '../../utils/mockData';
import { Order } from '../../utils/types';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: Clock, bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[order.status];
  const Icon = config.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900 font-mono">{order.id}</p>
              <p className="text-xs text-slate-400">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            <Icon className="w-3 h-3" />{config.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {order.items.slice(0, 3).map(item => (
            <img key={item.id} src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-semibold">
              +{order.items.length - 3}
            </div>
          )}
          <div className="ml-2">
            <p className="text-xs text-slate-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
            <p className="text-sm font-bold text-navy-900">${order.total.toFixed(2)}</p>
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-sky-600 font-medium hover:text-sky-700 transition-colors">
          {expanded ? 'Hide Details' : 'View Details'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">Qty: {item.qty} × ${item.price}</p>
                  </div>
                  <span className="text-sm font-semibold text-navy-900">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-sm font-semibold text-navy-900">Order Total</span>
                <span className="text-sm font-bold text-navy-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');
  const filtered = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);
  const counts = {
    all: MOCK_ORDERS.length,
    pending: MOCK_ORDERS.filter(o => o.status === 'pending').length,
    delivered: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
    cancelled: MOCK_ORDERS.filter(o => o.status === 'cancelled').length,
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900">My Orders</h1>
            <p className="text-slate-500 text-sm mt-1">{MOCK_ORDERS.length} total orders</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {(['all', 'pending', 'delivered', 'cancelled'] as const).map(tab => (
              <button key={tab} onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  filter === tab ? 'bg-navy-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                <span className="capitalize">{tab}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">No orders found</h3>
              <p className="text-slate-500 text-sm mb-5">You don't have any {filter !== 'all' ? filter : ''} orders yet.</p>
              <Link to="/products" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-colors">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
