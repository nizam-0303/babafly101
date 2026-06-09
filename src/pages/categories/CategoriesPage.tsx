import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeletons';
import { CATEGORIES, MOCK_PRODUCTS } from '../../utils/mockData';

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setActiveCategory(params.get('cat'));
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [location.search]);

  const filteredProducts = activeCategory ? MOCK_PRODUCTS.filter(p => p.category === activeCategory) : [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sky-500 text-sm font-semibold uppercase tracking-wider mb-2">Explore</p>
            <h1 className="text-4xl font-bold text-navy-900">Categories</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <button
                  onClick={() => navigate(activeCategory === cat.id ? '/categories' : `/categories?cat=${cat.id}`)}
                  className={`group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 ${
                    activeCategory === cat.id ? 'ring-2 ring-sky-500 ring-offset-2 shadow-card-lg' : 'shadow-card hover:shadow-card-lg hover:-translate-y-1'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-50`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                      <p className="text-white/70 text-xs">{cat.count} products</p>
                    </div>
                    {activeCategory === cat.id && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-slate-500 text-xs leading-relaxed">{cat.description}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-sky-600 text-xs font-semibold">
                      Browse <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {activeCategory && (
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 capitalize">{CATEGORIES.find(c => c.id === activeCategory)?.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">{filteredProducts.length} products</p>
                </div>
                <Link to={`/products?cat=${activeCategory}`} className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
                </div>
              )}
            </div>
          )}

          {!activeCategory && (
            <div className="bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-xl font-bold text-navy-900 mb-6">All Products Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div>
                      <h3 className="font-semibold text-navy-900">{cat.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                    </div>
                    <button onClick={() => navigate(`/categories?cat=${cat.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 transition-colors whitespace-nowrap">
                      View <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
