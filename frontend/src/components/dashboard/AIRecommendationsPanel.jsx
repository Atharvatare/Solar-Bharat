import { motion } from 'framer-motion';
import {
  HiOutlineCpuChip,
  HiOutlineLightBulb,
  HiOutlineClock,
  HiOutlineBolt,
  HiOutlineWrenchScrewdriver,
  HiOutlineBanknotes,
} from 'react-icons/hi2';

const recommendations = [
  {
    id: 1,
    icon: HiOutlineClock,
    color: 'text-solar-500',
    bgColor: 'bg-solar-500/10',
    title: 'Shift Peak Usage',
    description: 'Your peak usage is 6-9 PM. Shift heavy appliances (washing machine, water heater) to 10AM-3PM to maximize solar self-consumption.',
    impact: 'Save ₹800/month',
    priority: 'high',
  },
  {
    id: 2,
    icon: HiOutlineWrenchScrewdriver,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    title: 'Panel Cleaning Due',
    description: 'Dust buildup can reduce output by 15-25%. Schedule a panel cleaning before the summer peak season.',
    impact: '+12% efficiency',
    priority: 'medium',
  },
  {
    id: 3,
    icon: HiOutlineBolt,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    title: 'Net Metering Opportunity',
    description: 'You exported 1,430 kWh last month. Apply for net metering with your DISCOM to earn credits for excess generation.',
    impact: 'Earn ₹1,200/month',
    priority: 'high',
  },
  {
    id: 4,
    icon: HiOutlineBanknotes,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    title: 'Subsidy Update Available',
    description: 'PM Surya Ghar Muft Bijli Yojana offers up to ₹78,000 subsidy for residential solar. Check your eligibility.',
    impact: 'Save ₹78,000',
    priority: 'high',
  },
  {
    id: 5,
    icon: HiOutlineLightBulb,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    title: 'LED Upgrade Recommended',
    description: 'Replacing remaining CFL/incandescent lights with LEDs can reduce lighting consumption by 60%.',
    impact: 'Save ₹400/month',
    priority: 'low',
  },
];

const priorityBadge = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-solar-500/10 text-solar-600 border-solar-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export default function AIRecommendationsPanel({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-2xl ${className || ''}`}
    >
      <div className="flex items-center gap-2 mb-5">
        <HiOutlineCpuChip className="w-5 h-5 text-solar-500" />
        <h3 className="text-base font-display font-semibold text-navy-900 dark:text-white">
          AI Smart Recommendations
        </h3>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            variants={item}
            className="flex items-start gap-3 p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 hover:bg-navy-100 dark:hover:bg-navy-800/80 transition-colors cursor-default"
          >
            <div className={`w-10 h-10 rounded-xl ${rec.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <rec.icon className={`w-5 h-5 ${rec.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-navy-900 dark:text-white">{rec.title}</h4>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge[rec.priority]}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-xs text-navy-500 dark:text-navy-400 leading-relaxed">{rec.description}</p>
              <p className="text-xs font-semibold text-emerald-500 mt-1.5">💡 {rec.impact}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
