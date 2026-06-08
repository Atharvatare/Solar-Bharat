import { motion } from 'framer-motion';
import {
  HiOutlineDocumentArrowDown,
  HiOutlineSun,
  HiOutlineCurrencyRupee,
  HiOutlineBolt,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import {
  generateSolarAnalysisReport,
  generateROIReport,
  generateEnergyReport,
} from '../utils/pdfGenerator';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const reportTypes = [
  {
    id: 'solar',
    title: 'Solar Analysis Report',
    description: 'Complete solar system analysis including system sizing, panel recommendation, roof orientation, and energy production estimates.',
    icon: HiOutlineSun,
    color: 'from-solar-400 to-orange-500',
    bgColor: 'bg-solar-500/10',
    textColor: 'text-solar-600 dark:text-solar-400',
    includes: [
      'System overview (size, panels, type)',
      'Financial summary (cost, subsidy, savings)',
      'Energy production estimates',
      'Environmental impact (CO₂ offset)',
    ],
    generate: () => {
      generateSolarAnalysisReport({});
      toast.success('Solar Analysis Report downloaded!');
    },
  },
  {
    id: 'roi',
    title: 'ROI & Investment Report',
    description: 'Detailed return on investment analysis with 10-year savings projection table, payback period, and cumulative profit calculations.',
    icon: HiOutlineCurrencyRupee,
    color: 'from-emerald-400 to-green-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    includes: [
      'Investment summary',
      '10-year savings projection table',
      'Payback period calculation',
      'Cumulative profit/loss tracking',
    ],
    generate: () => {
      generateROIReport({});
      toast.success('ROI Report downloaded!');
    },
  },
  {
    id: 'energy',
    title: 'Energy Analytics Report',
    description: 'Comprehensive energy analytics with monthly breakdown of generation, consumption, savings, and environmental impact metrics.',
    icon: HiOutlineBolt,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    includes: [
      'Energy overview (generated, consumed, exported)',
      '12-month breakdown table',
      'Self-consumption & efficiency metrics',
      'Carbon savings & trees equivalent',
    ],
    generate: () => {
      generateEnergyReport({});
      toast.success('Energy Analytics Report downloaded!');
    },
  },
];

export default function ReportsPage() {
  const downloadAll = () => {
    generateSolarAnalysisReport({});
    setTimeout(() => generateROIReport({}), 500);
    setTimeout(() => generateEnergyReport({}), 1000);
    toast.success('All 3 reports downloaded!');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
            Reports & Documents
          </h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">
            Generate and download professional PDF reports
          </p>
        </div>
        <button onClick={downloadAll} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <HiOutlineDocumentArrowDown className="w-5 h-5" />
          Download All Reports
        </button>
      </motion.div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <motion.div key={report.id} variants={item} className="glass rounded-2xl overflow-hidden group">
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${report.color}`} />

            <div className="p-6 space-y-4">
              {/* Icon + Title */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${report.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <report.icon className={`w-6 h-6 ${report.textColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white">{report.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-400 mt-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Includes */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">Includes:</p>
                {report.includes.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-r ${report.color}`} />
                    <span className="text-sm text-navy-600 dark:text-navy-300">{inc}</span>
                  </div>
                ))}
              </div>

              {/* Download Button */}
              <button
                onClick={report.generate}
                className="w-full py-3 rounded-xl border-2 border-navy-200 dark:border-navy-700
                  text-navy-700 dark:text-navy-300 font-medium text-sm
                  hover:border-solar-500 hover:text-solar-500 dark:hover:text-solar-400
                  transition-all duration-200 flex items-center justify-center gap-2
                  group-hover:border-solar-500/50"
              >
                <HiOutlineDocumentArrowDown className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <motion.div variants={item} className="glass p-5 rounded-2xl">
        <div className="flex items-start gap-3">
          <HiOutlineChartBar className="w-5 h-5 text-solar-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-navy-900 dark:text-white">About Reports</p>
            <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">
              Reports are generated as professional PDF documents with Solar Bharat branding. 
              For personalized reports based on your actual data, first complete a bill upload or solar calculation, 
              then download reports from the respective pages.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
