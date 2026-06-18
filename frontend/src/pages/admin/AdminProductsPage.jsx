import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCube, HiOutlineStar, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import Badge from '../../components/common/Badge';

const demoProducts = [
  { id: 1, name: 'Tata 400W Mono PERC', brand: 'Tata Power Solar', category: 'solar_panel', mrp: 18000, price: 15500, discount: 14, wattage: 400, efficiency: 21.3, warranty: 25, rating: 4.8, inStock: true },
  { id: 2, name: 'Luminous 3kW On-Grid', brand: 'Luminous', category: 'inverter', mrp: 42000, price: 38500, discount: 8, wattage: 3000, efficiency: 97.5, warranty: 10, rating: 4.6, inStock: true },
  { id: 3, name: 'Exide 150Ah Tubular', brand: 'Exide', category: 'battery', mrp: 14500, price: 12800, discount: 12, wattage: null, efficiency: null, warranty: 5, rating: 4.3, inStock: true },
  { id: 4, name: 'Adani 540W Bifacial', brand: 'Adani Solar', category: 'solar_panel', mrp: 24000, price: 21000, discount: 13, wattage: 540, efficiency: 22.1, warranty: 30, rating: 4.9, inStock: true },
  { id: 5, name: 'Havells 5kW Hybrid', brand: 'Havells', category: 'inverter', mrp: 85000, price: 76000, discount: 11, wattage: 5000, efficiency: 98.2, warranty: 10, rating: 4.7, inStock: false },
  { id: 6, name: 'GI Rail Mounting Kit', brand: 'SolarMount', category: 'mounting', mrp: 4500, price: 3800, discount: 16, wattage: null, efficiency: null, warranty: 15, rating: 4.1, inStock: true },
  { id: 7, name: 'Amara Raja 200Ah', brand: 'Amara Raja', category: 'battery', mrp: 18000, price: 15500, discount: 14, wattage: null, efficiency: null, warranty: 5, rating: 4.4, inStock: true },
  { id: 8, name: 'MC4 Connector Set', brand: 'SolarLink', category: 'accessories', mrp: 350, price: 280, discount: 20, wattage: null, efficiency: null, warranty: 2, rating: 4.0, inStock: true },
];

const categories = ['All', 'solar_panel', 'inverter', 'battery', 'mounting', 'accessories'];
const categoryLabels = { All: 'All', solar_panel: 'Solar Panels', inverter: 'Inverters', battery: 'Batteries', mounting: 'Mounting', accessories: 'Accessories' };
const categoryColors = { solar_panel: 'from-solar-400 to-orange-500', inverter: 'from-blue-400 to-indigo-500', battery: 'from-emerald-400 to-teal-500', mounting: 'from-purple-400 to-pink-500', accessories: 'from-gray-400 to-slate-500' };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? demoProducts : demoProducts.filter(p => p.category === activeCategory);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Product Catalog</h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">{demoProducts.length} products across {categories.length - 1} categories</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm"><HiOutlineCube className="w-4 h-4" /> Add Product</button>
      </motion.div>

      {/* Category Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === c ? 'bg-solar-500 text-white shadow-md' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-700'}`}>
            {categoryLabels[c]}
          </button>
        ))}
      </motion.div>

      {/* Product Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <motion.div key={p.id} variants={item} className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Gradient Header */}
            <div className={`h-28 bg-gradient-to-br ${categoryColors[p.category] || 'from-gray-400 to-gray-500'} flex items-center justify-center relative`}>
              <HiOutlineCube className="w-12 h-12 text-white/80" />
              {p.discount > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{p.discount}%</span>}
              {!p.inStock && <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Out of Stock</span>}
            </div>
            <div className="p-4">
              <Badge variant="info" size="sm">{categoryLabels[p.category]}</Badge>
              <h3 className="font-semibold text-navy-900 dark:text-white text-sm mt-2 line-clamp-1">{p.name}</h3>
              <p className="text-xs text-navy-500 dark:text-navy-400">{p.brand}</p>

              {p.wattage && <p className="text-xs text-navy-500 mt-1">{p.wattage}W · {p.efficiency}% eff</p>}
              <p className="text-xs text-navy-500">{p.warranty}yr warranty</p>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-navy-900 dark:text-white">₹{p.price.toLocaleString()}</span>
                <span className="text-xs text-navy-400 line-through">₹{p.mrp.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-200 dark:border-navy-700">
                <div className="flex items-center gap-1">
                  <HiOutlineStar className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-sm font-medium text-navy-900 dark:text-white">{p.rating}</span>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg bg-navy-200 dark:bg-navy-700 hover:bg-navy-300 dark:hover:bg-navy-600"><HiOutlinePencilSquare className="w-3.5 h-3.5 text-navy-600 dark:text-navy-300" /></button>
                  <button className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200"><HiOutlineTrash className="w-3.5 h-3.5 text-red-500" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
