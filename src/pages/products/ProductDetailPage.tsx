import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Shield, Package, Zap, Heart, Share2 } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import { MOCK_PRODUCTS } from '../../utils/mockData';
import { useAppDispatch } from '../../hooks/useRedux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const related = MOCK_PRODUCTS.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center pt-24">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-sky-600 hover:text-sky-700 font-medium">Browse all products</Link>
        </div>
      </MainLayout>
    );
  }

  const images = [product.image, product.image, product.image];
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`, {
      style: { borderRadius: '12px', background: '#0F172A', color: '#fff' },
      iconTheme: { primary: '#3B82F6', secondary: '#fff' },
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link to="/products" className="text-slate-400 hover:text-slate-600 transition-colors">Products</Link>
            <span className="text-slate-300">/</span>
            <span className="text-navy-900 font-medium truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative rounded-3xl overflow-hidden bg-white shadow-card-lg mb-4 aspect-square group cursor-zoom-in">
                <img src={images[activeImg]} alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-sm font-semibold bg-sky-500 text-white shadow-sm">{product.badge}</span>
                )}
                {discount > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-sm">-{discount}%</span>
                )}
              </div>
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-1 rounded-xl overflow-hidden aspect-square transition-all duration-200 ${activeImg === i ? 'ring-2 ring-sky-500 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-600 text-xs font-semibold capitalize">{product.category}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setWishlist(!wishlist)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 ${wishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${wishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-navy-900">{product.rating}</span>
                <span className="text-sm text-slate-400">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-bold text-navy-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-slate-400 line-through">${product.originalPrice}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 text-sm font-bold">Save ${product.originalPrice - product.price}</span>
                  </>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Type', value: product.metalType },
                  { label: 'Finish', value: product.polishType },
                  { label: 'Category', value: product.category },
                  { label: 'Stock', value: `${product.stock} available` },
                ].map(spec => (
                  <div key={spec.label}>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{spec.label}</p>
                    <p className="text-sm font-semibold text-navy-900 capitalize">{spec.value}</p>
                  </div>
                ))}
              </div>

              {product.stock <= 20 && product.stock > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 font-medium mb-5">
                  <Zap className="w-4 h-4" />Only {product.stock} left in stock — order soon!
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm">
                  <ShoppingCart className="w-4 h-4" />Add to Cart
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-all duration-200">
                  Buy Now
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-3">
                {[{ icon: Shield, text: 'Secure Payment' }, { icon: Package, text: 'Instant Delivery' }, { icon: Zap, text: '24/7 Support' }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Icon className="w-3.5 h-3.5 text-sky-400" />{text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {related.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl font-bold text-navy-900">Related Products</h2>
                <Link to="/products" className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors">View all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
