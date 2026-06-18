import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBolt, HiOutlineSignal, HiOutlineSun,
  HiOutlineCpuChip, HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import Badge from '../components/common/Badge';
import AreaChartWidget from '../components/charts/AreaChartWidget';

// Realistic solar curve data generation
const generateSolarCurve = () => {
  const data = [];
  const now = new Date();
  for (let h = 0; h < 24; h++) {
    const t = h;
    let power = 0;
    if (t >= 5 && t < 7) power = ((t - 5) / 2) * 800;
    else if (t >= 7 && t < 10) power = 800 + ((t - 7) / 3) * 2700;
    else if (t >= 10 && t < 14) power = 3500 + Math.sin(((t - 10) / 4) * Math.PI) * 1200;
    else if (t >= 14 && t < 17) power = 3500 - ((t - 14) / 3) * 2000;
    else if (t >= 17 && t < 19) power = 1500 - ((t - 17) / 2) * 1500;
    power = Math.max(0, power * (0.9 + Math.random() * 0.2));
    const isPast = h <= now.getHours();
    data.push({ time: `${String(h).padStart(2, '0')}:00`, power: isPast ? Math.round(power) : null, projected: Math.round(power) });
  }
  return data;
};

const generateLiveValue = (base, variation) => +(base + (Math.random() - 0.5) * variation).toFixed(1);

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function IoTDashboardPage() {
  const hour = new Date().getHours();
  const isGenerating = hour >= 6 && hour < 19;
  const peakFactor = isGenerating ? (hour >= 10 && hour < 14 ? 1 : hour >= 7 && hour < 10 ? 0.6 : 0.3) : 0;

  const [live, setLive] = useState({
    voltage: isGenerating ? generateLiveValue(350 * peakFactor + 50, 10) : 0,
    current: isGenerating ? generateLiveValue(12 * peakFactor, 2) : 0,
    power: isGenerating ? generateLiveValue(4200 * peakFactor, 200) : 0,
    energy: generateLiveValue(18.5, 2),
    temperature: generateLiveValue(35 + 15 * peakFactor, 3),
    efficiency: isGenerating ? generateLiveValue(20 + peakFactor * 2, 1) : 0,
    frequency: generateLiveValue(50, 0.3),
    irradiance: isGenerating ? generateLiveValue(800 * peakFactor, 50) : 0,
  });

  const [chartData] = useState(generateSolarCurve);

  // Simulate live data updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLive({
        voltage: isGenerating ? generateLiveValue(350 * peakFactor + 50, 10) : 0,
        current: isGenerating ? generateLiveValue(12 * peakFactor, 2) : 0,
        power: isGenerating ? generateLiveValue(4200 * peakFactor, 200) : 0,
        energy: prev => +(prev.energy || 18.5) + +(Math.random() * 0.05).toFixed(3),
        temperature: generateLiveValue(35 + 15 * peakFactor, 3),
        efficiency: isGenerating ? generateLiveValue(20 + peakFactor * 2, 1) : 0,
        frequency: generateLiveValue(50, 0.3),
        irradiance: isGenerating ? generateLiveValue(800 * peakFactor, 50) : 0,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isGenerating, peakFactor]);

  const liveEnergy = typeof live.energy === 'function' ? 18.5 : live.energy;

  const metrics = [
    { label: 'Voltage', value: `${live.voltage}`, unit: 'V', icon: HiOutlineBolt, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10' },
    { label: 'Current', value: `${live.current}`, unit: 'A', icon: HiOutlineSignal, color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-500/10' },
    { label: 'Power', value: `${Math.round(live.power)}`, unit: 'W', icon: HiOutlineSun, color: 'from-solar-500 to-orange-600', bg: 'bg-solar-500/10' },
    { label: 'Energy Today', value: `${liveEnergy.toFixed(1)}`, unit: 'kWh', icon: HiOutlineArrowTrendingUp, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10' },
  ];

  const dailyStats = [
    { label: 'Peak Power', value: '4,680 W', sub: 'at 12:35 PM' },
    { label: 'Avg Efficiency', value: `${live.efficiency}%`, sub: 'panel efficiency' },
    { label: 'Sunshine Hours', value: `${isGenerating ? (hour - 6).toFixed(1) : '0'}h`, sub: 'today' },
    { label: 'CO₂ Offset', value: `${(liveEnergy * 0.82).toFixed(1)} kg`, sub: 'carbon saved' },
    { label: 'Temperature', value: `${live.temperature}°C`, sub: 'panel temp' },
    { label: 'Irradiance', value: `${Math.round(live.irradiance)} W/m²`, sub: 'solar radiation' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <HiOutlineCpuChip className="w-8 h-8 text-solar-500" />
            <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-navy-900 ${isGenerating ? 'bg-emerald-500 animate-pulse' : 'bg-navy-400'}`} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">IoT Energy Monitor</h1>
            <p className="text-navy-500 dark:text-navy-400 text-sm flex items-center gap-2">
              <Badge variant={isGenerating ? 'success' : 'neutral'} dot size="sm">{isGenerating ? 'Generating' : 'Standby'}</Badge>
              · Updates every 3s
            </p>
          </div>
        </div>
        <div className="glass px-4 py-2 rounded-xl">
          <p className="text-xs text-navy-500 dark:text-navy-400">Device</p>
          <p className="text-sm font-semibold text-navy-900 dark:text-white">Solar Inverter (5 kW)</p>
        </div>
      </motion.div>

      {/* Live Metrics */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <motion.div key={m.label} whileHover={{ y: -2 }} className="glass-strong p-5 rounded-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${m.bg} rounded-full -translate-x-4 -translate-y-4 blur-xl`} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                  <m.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-navy-500 dark:text-navy-400">{m.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-navy-900 dark:text-white transition-all duration-500">{m.value}</span>
                <span className="text-sm text-navy-500">{m.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Generation Chart */}
      <motion.div variants={item} className="glass p-6 rounded-2xl">
        <AreaChartWidget
          data={chartData}
          dataKey="power"
          xAxisKey="time"
          title="Power Generation Today"
          color="#F59E0B"
          height={300}
          gradientFill
        />
      </motion.div>

      {/* Daily Summary */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {dailyStats.map(s => (
          <div key={s.label} className="glass p-4 rounded-xl text-center">
            <p className="text-lg font-bold text-navy-900 dark:text-white">{s.value}</p>
            <p className="text-xs font-medium text-navy-600 dark:text-navy-400 mt-0.5">{s.label}</p>
            <p className="text-xs text-navy-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Device Info */}
      <motion.div variants={item} className="glass p-5 rounded-2xl">
        <h3 className="font-semibold text-navy-900 dark:text-white mb-3">Device Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-navy-500 dark:text-navy-400">Device ID</p><p className="font-medium text-navy-900 dark:text-white">SB-INV-001</p></div>
          <div><p className="text-navy-500 dark:text-navy-400">Status</p><p className="flex items-center gap-1"><Badge variant="success" dot size="sm">Online</Badge></p></div>
          <div><p className="text-navy-500 dark:text-navy-400">Firmware</p><p className="font-medium text-navy-900 dark:text-white">v2.4.1</p></div>
          <div><p className="text-navy-500 dark:text-navy-400">System Capacity</p><p className="font-medium text-navy-900 dark:text-white">5 kW</p></div>
          <div><p className="text-navy-500 dark:text-navy-400">Frequency</p><p className="font-medium text-navy-900 dark:text-white">{live.frequency} Hz</p></div>
          <div><p className="text-navy-500 dark:text-navy-400">Type</p><p className="font-medium text-navy-900 dark:text-white">Solar Inverter</p></div>
          <div><p className="text-navy-500 dark:text-navy-400">Last Seen</p><p className="font-medium text-navy-900 dark:text-white">Just now</p></div>
          <div><p className="text-navy-500 dark:text-navy-400">Uptime</p><p className="font-medium text-navy-900 dark:text-white">99.7%</p></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
