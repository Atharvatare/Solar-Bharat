import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCalculator,
  HiOutlineBolt,
  HiOutlineCurrencyRupee,
  HiOutlineSun,
  HiOutlineArrowTrendingUp,
  HiOutlineGlobeAlt,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2';
import AreaChartWidget from '../components/charts/AreaChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Kolkata', 'Ahmedabad', 'Lucknow'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function SolarCalculatorPage() {
  const [inputs, setInputs] = useState({
    roofArea: 500,
    monthlyBill: 5000,
    electricityRate: 8,
    sunlightHours: 5.5,
    location: 'Mumbai',
    panelType: 'monocrystalline',
    includeSubsidy: true,
  });
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setCalculated(false);
  };

  const calculate = () => {
    const { monthlyBill, electricityRate, sunlightHours, roofArea, includeSubsidy } = inputs;
    const systemSize = Math.round(((monthlyBill / electricityRate) / (sunlightHours * 30)) * 1.2 * 10) / 10;
    const panels = Math.ceil(systemSize * 1000 / 400);
    const cost = Math.round(systemSize * 1000 * 40);
    const subsidyCost = includeSubsidy ? Math.round(cost * 0.6) : cost;
    const annualSavings = Math.round(monthlyBill * 12 * 0.85);
    const payback = Math.round((subsidyCost / annualSavings) * 10) / 10;
    const co2Saved = Math.round(systemSize * 1500);
    const treesEquiv = Math.round(co2Saved / 22);
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
      savings: Math.round(annualSavings / 12 * (0.7 + Math.random() * 0.6)),
    }));
    const roiData = Array.from({ length: 26 }, (_, i) => ({
      year: `Y${i}`,
      savings: Math.round(annualSavings * i),
      cost: subsidyCost,
    }));

    setResults({ systemSize, panels, cost, subsidyCost, annualSavings, payback, co2Saved, treesEquiv, monthlyData, roiData });
    setCalculated(true);
    setAnimatedSavings(0);
  };

  useEffect(() => {
    if (!calculated || !results) return;
    let current = 0;
    const target = results.annualSavings;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedSavings(target);
        clearInterval(timer);
      } else {
        setAnimatedSavings(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [calculated, results]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
          Solar Calculator
        </h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">Estimate your solar savings in minutes</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div variants={item} className="glass p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white">System Parameters</h3>

          {/* Roof Area */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-navy-700 dark:text-navy-300">Roof Area (sq ft)</label>
              <span className="text-sm font-mono font-bold text-solar-500">{inputs.roofArea}</span>
            </div>
            <input type="range" min="100" max="5000" step="50" value={inputs.roofArea}
              onChange={(e) => handleChange('roofArea', Number(e.target.value))}
              className="w-full h-2 bg-navy-200 dark:bg-navy-700 rounded-full appearance-none cursor-pointer accent-solar-500"
            />
            <div className="flex justify-between text-xs text-navy-400 mt-1"><span>100</span><span>5,000</span></div>
          </div>

          {/* Monthly Bill */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-navy-700 dark:text-navy-300">Monthly Bill (₹)</label>
              <span className="text-sm font-mono font-bold text-solar-500">₹{inputs.monthlyBill.toLocaleString()}</span>
            </div>
            <input type="range" min="500" max="50000" step="500" value={inputs.monthlyBill}
              onChange={(e) => handleChange('monthlyBill', Number(e.target.value))}
              className="w-full h-2 bg-navy-200 dark:bg-navy-700 rounded-full appearance-none cursor-pointer accent-solar-500"
            />
            <div className="flex justify-between text-xs text-navy-400 mt-1"><span>₹500</span><span>₹50,000</span></div>
          </div>

          {/* Electricity Rate */}
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-2">Electricity Rate (₹/unit)</label>
            <input type="number" value={inputs.electricityRate}
              onChange={(e) => handleChange('electricityRate', Number(e.target.value))}
              className="input-solar" min="3" max="20" step="0.5"
            />
          </div>

          {/* Sunlight Hours */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-navy-700 dark:text-navy-300">Avg. Sunlight Hours</label>
              <span className="text-sm font-mono font-bold text-solar-500">{inputs.sunlightHours} hrs</span>
            </div>
            <input type="range" min="3" max="8" step="0.5" value={inputs.sunlightHours}
              onChange={(e) => handleChange('sunlightHours', Number(e.target.value))}
              className="w-full h-2 bg-navy-200 dark:bg-navy-700 rounded-full appearance-none cursor-pointer accent-solar-500"
            />
            <div className="flex justify-between text-xs text-navy-400 mt-1"><span>3 hrs</span><span>8 hrs</span></div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-2">Location</label>
            <select value={inputs.location} onChange={(e) => handleChange('location', e.target.value)} className="input-solar">
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Panel Type */}
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-3">Panel Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'monocrystalline', label: 'Mono', desc: 'High efficiency' },
                { id: 'polycrystalline', label: 'Poly', desc: 'Cost effective' },
                { id: 'thinfilm', label: 'Thin Film', desc: 'Flexible' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleChange('panelType', p.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    inputs.panelType === p.id
                      ? 'border-solar-500 bg-solar-500/10 text-solar-600 dark:text-solar-400'
                      : 'border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-400 hover:border-navy-300'
                  }`}
                >
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subsidy Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700 dark:text-navy-300">Include Subsidy</p>
              <p className="text-xs text-navy-400">PM Surya Ghar (~40% off)</p>
            </div>
            <button
              onClick={() => handleChange('includeSubsidy', !inputs.includeSubsidy)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                inputs.includeSubsidy ? 'bg-solar-500' : 'bg-navy-300 dark:bg-navy-600'
              }`}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ left: inputs.includeSubsidy ? '26px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <button onClick={calculate} className="btn-primary w-full flex items-center justify-center gap-2">
            <HiOutlineCalculator className="w-5 h-5" />
            Calculate Savings
          </button>
        </motion.div>

        {/* Results Panel */}
        <motion.div variants={item} className="space-y-6">
          <AnimatePresence mode="wait">
            {!calculated ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <div className="w-20 h-20 rounded-full bg-solar-500/10 flex items-center justify-center mb-4 animate-pulse-slow">
                  <HiOutlineSun className="w-10 h-10 text-solar-500" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 dark:text-white">Configure & Calculate</h3>
                <p className="text-navy-500 dark:text-navy-400 mt-2 max-w-xs">
                  Adjust the parameters on the left and click "Calculate Savings" to see your results.
                </p>
              </motion.div>
            ) : results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Hero Savings */}
                <div className="glass p-8 rounded-2xl gradient-border text-center">
                  <p className="text-sm text-navy-500 dark:text-navy-400 uppercase tracking-wider font-medium">Annual Savings</p>
                  <p className="text-4xl md:text-5xl font-display font-bold text-solar-gradient mt-2">
                    ₹{animatedSavings.toLocaleString('en-IN')}
                  </p>
                  <p className="text-navy-500 dark:text-navy-400 mt-1">per year</p>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'System Size', value: `${results.systemSize} kW`, icon: HiOutlineBolt },
                    { label: 'Panels', value: results.panels, icon: HiOutlineSun },
                    { label: 'Cost (After Subsidy)', value: `₹${(results.subsidyCost / 100000).toFixed(1)}L`, icon: HiOutlineCurrencyRupee },
                    { label: 'Payback Period', value: `${results.payback} yrs`, icon: HiOutlineArrowTrendingUp },
                  ].map((s) => (
                    <div key={s.label} className="glass p-4 rounded-xl text-center">
                      <s.icon className="w-6 h-6 text-solar-500 mx-auto mb-2" />
                      <p className="text-xs text-navy-500 dark:text-navy-400">{s.label}</p>
                      <p className="text-lg font-bold font-mono text-navy-900 dark:text-white mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Environmental Impact */}
                <div className="glass p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-navy-900 dark:text-white mb-3">Environmental Impact</h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <HiOutlineGlobeAlt className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-navy-900 dark:text-white">{results.co2Saved}</p>
                      <p className="text-xs text-navy-500">kg CO₂/year</p>
                    </div>
                    <div>
                      <span className="text-2xl">🌳</span>
                      <p className="text-lg font-bold text-navy-900 dark:text-white mt-1">{results.treesEquiv}</p>
                      <p className="text-xs text-navy-500">Trees equiv.</p>
                    </div>
                    <div>
                      <span className="text-2xl">🏠</span>
                      <p className="text-lg font-bold text-navy-900 dark:text-white mt-1">{Math.max(1, Math.round(results.systemSize / 3))}</p>
                      <p className="text-xs text-navy-500">Homes powered</p>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="glass p-5 rounded-2xl">
                  <BarChartWidget
                    data={results.monthlyData}
                    bars={[{ dataKey: 'savings', color: '#F59E0B', name: 'Monthly Savings (₹)' }]}
                    xAxisKey="month"
                    title="Monthly Savings Estimate"
                    height={220}
                  />
                </div>

                <div className="glass p-5 rounded-2xl">
                  <AreaChartWidget
                    data={results.roiData}
                    dataKey="savings"
                    xAxisKey="year"
                    title="25-Year ROI Projection"
                    color="#10B981"
                    height={220}
                    gradientFill
                  />
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary flex items-center gap-2">
                    Get Custom Quote
                  </button>
                  <button className="btn-outline flex items-center gap-2">
                    <HiOutlineArrowDownTray className="w-5 h-5" />
                    Download Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
