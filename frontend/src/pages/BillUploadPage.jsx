import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlineCheckCircle,
  HiOutlineArrowDownTray,
  HiOutlineBolt,
  HiOutlineCurrencyRupee,
  HiOutlineClock,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Badge from '../components/common/Badge';
import { billHistory } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { solarAPI } from '../services/api';

const analysisSteps = [
  'Scanning document...',
  'Extracting data...',
  'Analyzing consumption...',
  'Generating insights...',
];

const getResultCards = (data) => [
  { label: 'Monthly Consumption', value: `${data?.extractedData?.units || 0} kWh`, icon: HiOutlineBolt, color: 'text-solar-500' },
  { label: 'Bill Amount', value: `₹${data?.extractedData?.amount || 0}`, icon: HiOutlineCurrencyRupee, color: 'text-emerald-500' },
  { label: 'System Recommended', value: `${data?.analysis?.recommendation?.systemSizeKw || 0} kW`, icon: HiOutlineChartBar, color: 'text-purple-500' },
  { label: 'Potential Savings', value: `₹${data?.analysis?.financials?.monthlySavings || 0}/mo`, icon: HiOutlineCurrencyRupee, color: 'text-blue-500' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function BillUploadPage() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((f) => {
    const maxSize = 10 * 1024 * 1024;
    if (f.size > maxSize) {
      toast.error('File too large. Max 10MB.');
      return;
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(f.type)) {
      toast.error('Invalid file type. Supports PDF, JPG, PNG.');
      return;
    }
    setFile(f);
    setShowResults(false);
    setAnalyzing(false);
    setProgress(0);
    setCurrentStep(0);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);
    setShowResults(false);
    
    // Simulate progress bar moving while waiting for API
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        const next = prev + 5;
        setCurrentStep(Math.min(Math.floor(next / 25), 3));
        return next;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('bill', file);

      const response = await solarAPI.analyzeBill(formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep(3);
      
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisData(response.data);
        setShowResults(true);
        toast.success('Bill analysis complete!');
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setAnalyzing(false);
      toast.error(err.message || 'Failed to analyze bill');
    }
  };

  const removeFile = () => {
    setFile(null);
    setShowResults(false);
    setAnalyzing(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
          Bill Upload & Analysis
        </h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">Upload your electricity bill for AI-powered analysis</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={item}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative glass p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 text-center ${
            dragOver
              ? 'border-solar-500 bg-solar-500/10 shadow-solar'
              : file
              ? 'border-emerald-500/50'
              : 'border-navy-300 dark:border-navy-600 hover:border-solar-500/50 hover:bg-solar-500/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />

          {!file ? (
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={dragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="w-16 h-16 rounded-2xl bg-solar-500/10 dark:bg-solar-500/20 flex items-center justify-center"
              >
                <HiOutlineCloudArrowUp className="w-8 h-8 text-solar-500" />
              </motion.div>
              <div>
                <p className="text-lg font-semibold text-navy-900 dark:text-white">
                  Drag & Drop your electricity bill here
                </p>
                <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">
                  or <span className="text-solar-500 font-medium">click to browse</span>
                </p>
              </div>
              <p className="text-xs text-navy-400 dark:text-navy-500">Supports PDF, JPG, PNG (max 10MB)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-solar-500/10 flex items-center justify-center">
                  <HiOutlineDocumentText className="w-6 h-6 text-solar-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-navy-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-navy-500 dark:text-navy-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeFile(); }} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                <HiOutlineXMark className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>

        {file && !analyzing && !showResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex justify-center">
            <button onClick={handleAnalyze} className="btn-primary inline-flex items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5" />
              Analyze Bill
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Analysis Progress */}
      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Analyzing Your Bill...</h3>
            <div className="w-full h-3 bg-navy-200 dark:bg-navy-700 rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-solar-400 to-solar-600 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="space-y-3">
              {analysisSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i <= currentStep ? (
                    <HiOutlineCheckCircle className={`w-5 h-5 flex-shrink-0 ${i < currentStep ? 'text-emerald-500' : 'text-solar-500 animate-pulse'}`} />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-navy-300 dark:border-navy-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${i <= currentStep ? 'text-navy-900 dark:text-white font-medium' : 'text-navy-400 dark:text-navy-500'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getResultCards(analysisData).map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5 rounded-2xl"
                >
                  <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
                  <p className="text-sm text-navy-500 dark:text-navy-400">{card.label}</p>
                  <p className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-1">{card.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="glass p-6 rounded-2xl gradient-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white">AI Recommendation</h3>
                  <p className="text-navy-600 dark:text-navy-300 mt-2">
                    Based on your bill analysis ({analysisData?.extractedData?.provider || 'your provider'}), we recommend a <strong>{analysisData?.analysis?.recommendation?.systemSizeKw || 0}kW solar system</strong> that can save you approximately
                    <strong className="text-solar-500"> ₹{analysisData?.analysis?.financials?.monthlySavings || 0}/month</strong>. With government subsidies of ₹{analysisData?.analysis?.financials?.subsidy || 0}, your total investment would be around ₹{analysisData?.analysis?.financials?.finalCost || 0}
                    with a payback period of just {analysisData?.analysis?.financials?.paybackPeriodYears || 0} years.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button className="btn-primary text-sm py-2">Get Detailed Report</button>
                    <button className="btn-outline text-sm py-2" onClick={() => window.location.href = '/dashboard/solar-calculator'}>Solar Calculator →</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload History */}
      <motion.div variants={item} className="glass p-6 rounded-2xl overflow-hidden">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Previous Bills</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                {['File', 'Date', 'Amount', 'Status', 'Est. Savings', ''].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {billHistory.map((bill, i) => (
                <tr key={bill.id} className={`border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/40 transition-colors ${i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocumentText className="w-5 h-5 text-solar-500" />
                      <span className="text-sm font-medium text-navy-900 dark:text-white">{bill.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{formatDate(bill.date)}</td>
                  <td className="py-3 px-4 text-sm font-medium text-navy-900 dark:text-white">{formatCurrency(bill.amount)}</td>
                  <td className="py-3 px-4"><Badge variant="success" size="sm">Analyzed</Badge></td>
                  <td className="py-3 px-4 text-sm font-medium text-emerald-500">{formatCurrency(bill.savings)}</td>
                  <td className="py-3 px-4">
                    <button className="p-2 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg transition-colors">
                      <HiOutlineArrowDownTray className="w-4 h-4 text-navy-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
