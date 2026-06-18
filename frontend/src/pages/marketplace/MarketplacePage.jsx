import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineMagnifyingGlass, HiOutlineStar, HiOutlineArrowsRightLeft,
  HiOutlineFunnel, HiOutlineCube, HiOutlineBolt,
} from 'react-icons/hi2';

const demoProducts = [
  { id: '1', name: 'Tata 400W Mono PERC Panel', brand: 'Tata Power Solar', category: 'Solar Panels', wattage: 400, efficiency: 21.3, price: 15500, mrp: 18000, rating: 4.8, reviews: 234, warranty: 25 },
  { id: '2', name: 'Adani 540W Bifacial Panel', brand: 'Adani Solar', category: 'Solar Panels', wattage: 540, efficiency: 22.1, price: 21000, mrp: 24000, rating: 4.9, reviews: 189, warranty: 30 },
  { id: '3', name: 'Luminous 3kW On-Grid Inverter', brand: 'Luminous', category: 'Inverters', wattage: 3000, efficiency: 97.5, price: 38500, mrp: 42000, rating: 4.6, reviews: 156, warranty: 10 },
  { id: '4', name: 'Havells 5kW Hybrid Inverter', brand: 'Havells', category: 'Inverters', wattage: 5000, efficiency: 98.2, price: 76000, mrp: 85000, rating: 4.7, reviews: 98, warranty: 10 },
  { id: '5', name: 'Exide 150Ah Tubular Battery', brand: 'Exide', category: 'Batteries', wattage: null, efficiency: null, price: 12800, mrp: 14500, rating: 4.3, reviews: 312, warranty: 5 },
  { id: '6', name: 'Amara Raja 200Ah Battery', brand: 'Amara Raja', category: 'Batteries', wattage: null, efficiency: null, price: 15500, mrp: 18000, rating: 4.4, reviews: 178, warranty: 5 },
  { id: '7', name: 'Waaree 370W Poly Panel', brand: 'Waaree Energies', category: 'Solar Panels', wattage: 370, efficiency: 19.8, price: 12800, mrp: 15000, rating: 4.5, reviews: 145, warranty: 25 },
  { id: '8', name: 'GI Rail Mounting System', brand: 'SolarMount India', category: 'Mounting', wattage: null, efficiency: null, price: 3800, mrp: 4500, rating: 4.1, reviews: 89, warranty: 15 },
  { id: '9', name: 'Microtek 10kW Grid-Tie', brand: 'Microtek', category: 'Inverters', wattage: 10000, efficiency: 98.5, price: 145000, mrp: 165000, rating: 4.8, reviews: 67, warranty: 10 },
];

const categories = ['All', 'Solar Panels', 'Inverters', 'Batteries', 'Mounting'];
const categoryIcons = { 'Solar Panels': '☀️', Inverters: '⚡', Batteries: '🔋', Mounting: '🔧' };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [compareList, setCompareList] = useState([]);
  const [sort, setSort] = useState('rating');

  let filtered = demoProducts
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const toggleCompare = (id) => {
    setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero */}
      <motion.div variants={item} className="text-center py-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold">
          <span className="text-navy-900 dark:text-white">Solar </span>
          <span className="bg-gradient-to-r from-solar-400 to-orange-500 bg-clip-text text-transparent">Marketplace</span>
        </h1>
        <p className="text-navy-500 dark:text-navy-400 mt-3 max-w-lg mx-auto">Browse premium solar panels, inverters, batteries and accessories from India's top brands</p>
      </motion.div>

      {/* Search + Sort */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white placeholder:text-navy-400 border border-navy-200 dark:border-navy-700 focus:border-solar-500 focus:ring-1 focus:ring-solar-500 outline-none transition" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white border border-navy-200 dark:border-navy-700 focus:border-solar-500 outline-none">
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </motion.div>

      {/* Category Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${category === c ? 'bg-gradient-to-r from-solar-500 to-orange-500 text-white shadow-lg shadow-solar-500/25' : 'glass text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-700'}`}>
            {categoryIcons[c] && <span>{categoryIcons[c]}</span>}{c}
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => {
          const discount = Math.round((1 - p.price / p.mrp) * 100);
          const isComparing = compareList.includes(p.id);
          return (
            <motion.div key={p.id} variants={item} className={`glass rounded-2xl overflow-hidden hover:shadow-xl transition-all group ${isComparing ? 'ring-2 ring-solar-500' : ''}`}>
              {/* Header */}
              <div className="h-32 bg-gradient-to-br from-solar-400/20 to-orange-400/20 dark:from-solar-900/40 dark:to-orange-900/40 flex items-center justify-center relative">
                <HiOutlineCube className="w-14 h-14 text-solar-500/60" />
                {discount > 0 && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>}
                <span className="absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full bg-navy-900/10 dark:bg-white/10 text-navy-600 dark:text-navy-300">{p.category}</span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-navy-900 dark:text-white line-clamp-1">{p.name}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-400">{p.brand}</p>

                {/* Specs */}
                {p.wattage && (
                  <div className="flex items-center gap-3 mt-2 text-xs text-navy-500">
                    <span className="flex items-center gap-1"><HiOutlineBolt className="w-3.5 h-3.5" />{p.wattage}W</span>
                    <span>{p.efficiency}% eff</span>
                    <span>{p.warranty}yr</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xl font-bold text-navy-900 dark:text-white">₹{p.price.toLocaleString()}</span>
                  <span className="text-sm text-navy-400 line-through">₹{p.mrp.toLocaleString()}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => <HiOutlineStar key={i} className={`w-4 h-4 ${i < Math.floor(p.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-navy-300'}`} />)}
                  <span className="text-sm text-navy-500 ml-1">{p.rating} ({p.reviews})</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link to={`/marketplace/${p.id}`} className="flex-1 btn-primary text-center text-sm py-2">View Details</Link>
                  <button onClick={() => toggleCompare(p.id)}
                    className={`p-2 rounded-xl transition-all ${isComparing ? 'bg-solar-500 text-white' : 'bg-navy-200 dark:bg-navy-700 text-navy-600 dark:text-navy-300 hover:bg-solar-100 dark:hover:bg-solar-900/30'}`}>
                    <HiOutlineArrowsRightLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-xl border-t border-navy-700 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiOutlineArrowsRightLeft className="w-5 h-5 text-solar-500" />
              <span className="text-white font-medium">{compareList.length} products selected</span>
              <div className="flex gap-2">
                {compareList.map(id => {
                  const p = demoProducts.find(x => x.id === id);
                  return p && <span key={id} className="text-xs bg-navy-700 text-navy-300 px-2 py-1 rounded-full">{p.brand}</span>;
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCompareList([])} className="px-4 py-2 rounded-lg text-sm text-navy-400 hover:text-white transition">Clear</button>
              <Link to={`/marketplace/compare?ids=${compareList.join(',')}`} className="btn-primary text-sm px-6 py-2">Compare Now</Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
