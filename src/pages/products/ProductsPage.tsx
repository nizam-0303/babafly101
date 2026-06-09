import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, Search } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeletons';
import { MOCK_PRODUCTS } from '../../utils/mockData';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setCategory, setPriceRange, setMetalType, setPolishType, setSortBy, setPage, resetFilters } from '../../redux/slices/filterSlice';

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { category, priceRange, metalType, polishType, sortBy, page } = useAppSelector(s => s.filter);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQ(q);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [location.search]);

  const filtered = useMemo(() => {
    let products = [...MOCK_PRODUCTS];
    if (searchQ) products = products.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.description.toLowerCase().includes(searchQ.toLowerCase()));
    if (category !== 'all') products = products.filter(p => p.category === category);
    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (metalType !== 'all') products = products.filter(p => p.metalType === metalType);
    if (polishType !== 'all') products = products.filter(p => p.polishType === polishType);
    if (sortBy === 'price_asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
    return products;
  }, [searchQ, category, priceRange, metalType, polishType, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeFiltersCount = [category !== 'all', priceRange[0] !== 0 || priceRange[1] !== 1500, metalType !== 'all', polishType !== 'all'].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-navy-900 mb-3">Category</h4>
        <div className="space-y-2">
          {['all', 'travel', 'accessories', 'services', 'insurance'].map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="category" checked={category === cat} onChange={() => dispatch(setCategory(cat))}
                className="w-4 h-4 text-sky-500 border-slate-300 cursor-pointer" />
              <span className={`text-sm capitalize transition-colors ${category === cat ? 'text-sky-600 font-medium' : 'text-slate-600 group-hover:text-navy-900'}`}>
                {cat === 'all' ? 'All Categories' : cat}
              </span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-slate-100" />
      <div>
        <h4 className="text-sm font-semibold text-navy-900 mb-3">Price Range</h4>
        <input type="range" min={0} max={1500} value={priceRange[1]}
          onChange={e => dispatch(setPriceRange([priceRange[0], +e.target.value]))}
          className="w-full accent-sky-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>${priceRange[0]}</span><span>${priceRange[1]}</span>
        </div>
      </div>
      <hr className="border-slate-100" />
      <div>
        <h4 className="text-sm font-semibold text-navy-900 mb-3">Type</h4>
        <div className="space-y-2">
          {['all', 'gold', 'silver', 'platinum'].map(m => (
            <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="metalType" checked={metalType === m} onChange={() => dispatch(setMetalType(m))}
                className="w-4 h-4 text-sky-500 border-slate-300 cursor-pointer" />
              <span className={`text-sm capitalize transition-colors ${metalType === m ? 'text-sky-600 font-medium' : 'text-slate-600 group-hover:text-navy-900'}`}>
                {m === 'all' ? 'All Types' : m}
              </span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-slate-100" />
      <div>
        <h4 className="text-sm font-semibold text-navy-900 mb-3">Finish</h4>
        <div className="space-y-2">
          {['all', 'glossy', 'matte', 'brushed'].map(p => (
            <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="polishType" checked={polishType === p} onChange={() => dispatch(setPolishType(p))}
                className="w-4 h-4 text-sky-500 border-slate-300 cursor-pointer" />
              <span className={`text-sm capitalize transition-colors ${polishType === p ? 'text-sky-600 font-medium' : 'text-slate-600 group-hover:text-navy-900'}`}>
                {p === 'all' ? 'All Finishes' : p}
              </span>
            </label>
          ))}
        </div>
      </div>
      {activeFiltersCount > 0 && (
        <button onClick={() => dispatch(resetFilters())}
          className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-1">All Products</h1>
            <p className="text-slate-500 text-sm">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-navy-900">Filters</h3>
                  {activeFiltersCount > 0 && <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-600 text-xs font-bold">{activeFiltersCount}</span>}
                </div>
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={searchQ} onChange={e => { setSearchQ(e.target.value); dispatch(setPage(1)); }}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
                </div>
                <div className="relative">
                  <select value={sortBy} onChange={e => dispatch(setSortBy(e.target.value))}
                    className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-navy-900 outline-none focus:border-sky-400 cursor-pointer">
                    <option value="latest">Latest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <button onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-navy-900 hover:bg-slate-50 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters {activeFiltersCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-sky-500 text-white text-xs font-bold">{activeFiltersCount}</span>}
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(ITEMS_PER_PAGE)].map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : paginated.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">No products found</h3>
                  <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search query.</p>
                  <button onClick={() => { dispatch(resetFilters()); setSearchQ(''); }}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors">
                    Reset Filters
                  </button>
                </div>
              )}

              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => dispatch(setPage(Math.max(1, page - 1)))} disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => dispatch(setPage(i + 1))}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${page === i + 1 ? 'bg-sky-500 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))} disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-navy-900/50 z-40 lg:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto p-6 lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-navy-900 text-lg">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
