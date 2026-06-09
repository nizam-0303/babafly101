import { motion } from 'framer-motion';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../utils/types';
import { useAppDispatch } from '../../hooks/useRedux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const dispatch = useAppDispatch();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`, {
      style: { borderRadius: '12px', background: '#0F172A', color: '#fff' },
      iconTheme: { primary: '#3B82F6', secondary: '#fff' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1">
          <div className="relative overflow-hidden h-52">
            <img src={product.image} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500 text-white shadow-sm">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white">
                -{discount}%
              </span>
            )}
            <motion.button onClick={handleAddToCart} whileTap={{ scale: 0.95 }}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white shadow-card-lg flex items-center justify-center text-sky-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-500 hover:text-white">
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 capitalize">{product.category}</p>
            <h3 className="text-sm font-semibold text-navy-900 leading-snug mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                ))}
              </div>
              <span className="text-xs text-slate-400">({product.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-navy-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.stock <= 20 && product.stock > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Zap className="w-3 h-3" />Only {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
