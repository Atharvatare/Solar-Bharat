import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMapPin,
  HiOutlineSun,
  HiOutlineBolt,
  HiOutlineClock,
  HiOutlineSquare3Stack3D,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineCloudArrowUp,
  HiOutlineXMark,
  HiOutlineEye,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { solarAPI } from '../services/api';
import MapWidget from '../components/dashboard/MapWidget';

const analysisSteps = [
  'Uploading image...',
  'Detecting rooftop boundaries...',
  'Analyzing shadows & obstructions...',
  'Calculating solar potential...',
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function RooftopAnalysisPage() {
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    const maxSize = 10 * 1024 * 1024;
    if (f.size > maxSize) { toast.error('File must be under 10MB'); return; }
    if (!f.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setShowResults(false);
    setAnalysisData(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setShowResults(false);
    setAnalysisData(null);
  };

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a rooftop image first'); return; }

    setAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);
    setShowResults(false);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        const next = prev + 3;
        setCurrentStep(Math.min(Math.floor(next / 25), 3));
        return next;
      });
    }, 600);

    try {
      const formData = new FormData();
      formData.append('rooftopImage', file);
      if (location) {
        formData.append('lat', location.lat);
        formData.append('lng', location.lng);
        formData.append('address', location.address);
      }

      const response = await solarAPI.analyzeRooftopImage(formData);

      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep(3);

      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisData(response.data.data.analysis);
        setShowResults(true);
        toast.success('Rooftop analysis complete!');
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setAnalyzing(false);
      toast.error(err.response?.data?.message || err.message || 'Analysis failed');
    }
  };

  const a = analysisData;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
          AI Rooftop Analysis
        </h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">Upload a satellite/aerial image of your rooftop for AI-powered solar analysis</p>
      </motion.div>

      {/* Step 1: Map — Select Location */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mb-3">
          Step 1 — Select Your Location (Optional)
        </h3>
        <MapWidget onLocationSelect={setLocation} />
      </motion.div>

      {/* Step 2: Upload Rooftop Image */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mb-3">
          Step 2 — Upload Rooftop Image
        </h3>
        <div className="glass p-6 rounded-2xl">
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? 'border-solar-500 bg-solar-500/5'
                  : 'border-navy-300 dark:border-navy-600 hover:border-solar-500/50'
              }`}
            >
              <HiOutlineCloudArrowUp className="w-12 h-12 text-solar-500 mx-auto mb-3" />
              <p className="text-navy-900 dark:text-white font-semibold mb-1">Drop your rooftop image here</p>
              <p className="text-sm text-navy-500 dark:text-navy-400">
                Use Google Maps satellite view → screenshot your rooftop → upload here
              </p>
              <p className="text-xs text-navy-400 mt-2">JPG, PNG up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img src={preview} alt="Rooftop" className="w-full h-64 object-cover" />
                <button
                  onClick={removeFile}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-navy-500 dark:text-navy-400">{file.name}</p>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="btn-primary flex items-center gap-2"
                >
                  {analyzing ? <HiOutlineArrowPath className="w-5 h-5 animate-spin" /> : <HiOutlineEye className="w-5 h-5" />}
                  {analyzing ? 'Analyzing...' : 'Analyze Rooftop'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass p-6 rounded-2xl">
            <div className="relative w-full h-48 bg-navy-800/50 dark:bg-navy-900/60 rounded-xl overflow-hidden mb-6">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="border border-navy-700/20" />
                ))}
              </div>
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-solar-500 to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-solar-400 font-mono animate-pulse">AI analyzing rooftop structure...</p>
              </div>
            </div>
            <div className="w-full bg-navy-200 dark:bg-navy-700 rounded-full h-2 mb-4">
              <motion.div className="bg-solar-500 h-2 rounded-full" animate={{ width: `${progress}%` }} />
            </div>
            <div className="space-y-3">
              {analysisSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i <= currentStep ? (
                    <HiOutlineCheckCircle className={`w-5 h-5 flex-shrink-0 ${i < currentStep ? 'text-emerald-500' : 'text-solar-500 animate-pulse'}`} />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-navy-300 dark:border-navy-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${i <= currentStep ? 'text-navy-900 dark:text-white font-medium' : 'text-navy-400'}`}>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && a && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Usable Area', value: `${a.usableArea} sq ft`, sub: `of ${a.totalRoofArea} total`, icon: HiOutlineSquare3Stack3D, color: 'text-solar-500' },
                { label: 'Sun Hours', value: `${a.shadowAnalysis?.peakSunHours} hrs/day`, sub: 'peak average', icon: HiOutlineSun, color: 'text-yellow-500' },
                { label: 'Panel Count', value: `${a.panelRecommendation?.panelCount} panels`, sub: `${a.panelRecommendation?.systemSizeKw} kW system`, icon: HiOutlineBolt, color: 'text-blue-500' },
                { label: 'Annual Output', value: `${(a.annualGeneration || 0).toLocaleString()} kWh`, sub: 'estimated yearly', icon: HiOutlineClock, color: 'text-emerald-500' },
              ].map((card, i) => (
                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-5 rounded-2xl text-center">
                  <card.icon className={`w-8 h-8 ${card.color} mx-auto mb-2`} />
                  <p className="text-xl font-bold font-mono text-navy-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">{card.sub}</p>
                  <p className="text-sm font-medium text-navy-700 dark:text-navy-300 mt-2">{card.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="glass p-6 rounded-2xl space-y-5">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Detailed Analysis</h3>
              {[
                { label: 'Roof Type', value: a.roofType, badge: a.orientationRating, badgeColor: a.orientationRating === 'Excellent' ? 'success' : 'info' },
                { label: 'Roof Orientation', value: a.roofOrientation, badge: a.orientationRating, badgeColor: a.orientationRating === 'Excellent' ? 'success' : 'info' },
                { label: 'Shadow Impact', value: `${a.shadowAnalysis?.shadowPercentage}% area affected`, progress: 100 - (a.shadowAnalysis?.shadowPercentage || 0) },
                { label: 'Optimal Tilt Angle', value: `${a.panelRecommendation?.tiltAngle}°`, badge: 'Configured', badgeColor: 'info' },
                { label: 'Panel Layout', value: a.panelRecommendation?.layout },
                { label: 'AI Confidence', value: `${a.confidence}% confidence`, progress: a.confidence },
              ].map((d) => (
                <div key={d.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-navy-100 dark:border-navy-800 last:border-0">
                  <div>
                    <p className="text-sm text-navy-500 dark:text-navy-400">{d.label}</p>
                    <p className="font-medium text-navy-900 dark:text-white">{d.value}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {d.progress !== undefined && (
                      <div className="w-32 h-2 bg-navy-200 dark:bg-navy-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${d.progress}%` }} transition={{ duration: 1, delay: 0.5 }} />
                      </div>
                    )}
                    {d.badge && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${d.badgeColor === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {d.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Obstructions */}
            {a.obstructions?.length > 0 && (
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineExclamationTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Detected Obstructions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.obstructions.map((obs, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {obs}
                    </span>
                  ))}
                </div>
                {a.shadowAnalysis?.shadowSources?.length > 0 && (
                  <p className="text-sm text-navy-500 dark:text-navy-400 mt-3">
                    Shadow sources: {a.shadowAnalysis.shadowSources.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Recommendation */}
            <div className="glass p-6 rounded-2xl gradient-border">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-3">Our Recommendation</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'System Size', value: `${a.panelRecommendation?.systemSizeKw} kW` },
                  { label: 'Annual Generation', value: `${((a.annualGeneration || 0) / 1000).toFixed(1)} MWh` },
                  { label: 'Panel Tilt', value: `${a.panelRecommendation?.tiltAngle}°` },
                ].map((r) => (
                  <div key={r.label} className="text-center p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
                    <p className="text-xs text-navy-500">{r.label}</p>
                    <p className="text-lg font-bold text-navy-900 dark:text-white mt-1">{r.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard/calculator" className="btn-primary">Proceed to Calculator</Link>
                <Link to="/dashboard/bill-upload" className="btn-outline">Upload Bill Instead</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
