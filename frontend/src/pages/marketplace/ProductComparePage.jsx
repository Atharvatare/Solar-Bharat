import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineStar } from 'react-icons/hi2';

const compareProducts = [
  { id: '1', name: 'Tata 400W Mono PERC', brand: 'Tata Power Solar', category: 'Solar Panel', price: 15500, mrp: 18000, wattage: 400, voltage: 41.5, efficiency: 21.3, warranty: 25, weight: 21.5, dimensions: '1755×1038×35 mm', rating: 4.8, vendor: 'SunPower India' },
  { id: '2', name: 'Adani 540W Bifacial', brand: 'Adani Solar', category: 'Solar Panel', price: 21000, mrp: 24000, wattage: 540, voltage: 49.8, efficiency: 22.1, warranty: 30, weight: 28.2, dimensions: '2278×1134×35 mm', rating: 4.9, vendor: 'GreenSolar Tech' },
  { id: '7', name: 'Waaree 370W Poly', brand: 'Waaree Energies', category: 'Solar Panel', price: 12800, mrp: 15000, wattage: 370, voltage: 39.2, efficiency: 19.8, warranty: 25, weight: 20.8, dimensions: '1960×992×40 mm', rating: 4.5, vendor: 'BharatSolar Corp' },
];

const specs = [
  { label: 'Price', key: 'price', format: v => `₹${v.toLocaleString()}`, best: 'low' },
  { label: 'MRP', key: 'mrp', format: v => `₹${v.toLocaleString()}` },
  { label: 'Wattage', key: 'wattage', format: v => `${v}W`, best: 'high' },
  { label: 'Voltage', key: 'voltage', format: v => `${v}V`, best: 'high' },
  { label: 'Efficiency', key: 'efficiency', format: v => `${v}%`, best: 'high' },
  { label: 'Warranty', key: 'warranty', format: v => `${v} years`, best: 'high' },
  { label: 'Weight', key: 'weight', format: v => `${v} kg`, best: 'low' },
  { label: 'Dimensions', key: 'dimensions', format: v => v },
  { label: 'Rating', key: 'rating', format: v => `${v}/5`, best: 'high' },
  { label: 'Vendor', key: 'vendor', format: v => v },
];

const getBestIndex = (products, key, direction) => {
  if (!direction) return -1;
  const values = products.map(p => p[key]);
  if (direction === 'high') return values.indexOf(Math.max(...values));
  return values.indexOf(Math.min(...values));
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function ProductComparePage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center gap-4">
        <Link to="/marketplace" className="p-2 rounded-lg hover:bg-navy-200 dark:hover:bg-navy-700 transition"><HiOutlineArrowLeft className="w-5 h-5 text-navy-600 dark:text-navy-400" /></Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Compare Products</h1>
          <p className="text-navy-500 dark:text-navy-400">Side-by-side specification comparison</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Product Headers */}
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                <th className="py-4 px-6 text-left text-sm font-semibold text-navy-500 dark:text-navy-400 w-40">Specification</th>
                {compareProducts.map(p => (
                  <th key={p.id} className="py-4 px-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-solar-400/20 to-orange-400/20 flex items-center justify-center mb-2">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <p className="font-semibold text-navy-900 dark:text-white text-sm">{p.name}</p>
                    <p className="text-xs text-navy-500">{p.brand}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, i) => {
                const bestIdx = getBestIndex(compareProducts, spec.key, spec.best);
                return (
                  <motion.tr key={spec.key} variants={item}
                    className={`border-b border-navy-100 dark:border-navy-800 ${i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''}`}>
                    <td className="py-3 px-6 text-sm font-medium text-navy-600 dark:text-navy-400">{spec.label}</td>
                    {compareProducts.map((p, j) => (
                      <td key={p.id} className={`py-3 px-6 text-center text-sm font-medium ${j === bestIdx ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-navy-900 dark:text-white'}`}>
                        <span className="flex items-center justify-center gap-1">
                          {spec.format(p[spec.key])}
                          {j === bestIdx && <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Verdict */}
      <motion.div variants={item} className="glass-strong p-6 rounded-2xl">
        <h3 className="font-semibold text-navy-900 dark:text-white mb-2">💡 Our Recommendation</h3>
        <p className="text-navy-600 dark:text-navy-400 text-sm">
          The <strong className="text-solar-500">Adani 540W Bifacial</strong> offers the best overall value with highest efficiency (22.1%), longest warranty (30 years), and top rating (4.9/5). For budget-conscious buyers, the <strong>Waaree 370W</strong> is the most affordable option at ₹12,800.
        </p>
      </motion.div>
    </motion.div>
  );
}
