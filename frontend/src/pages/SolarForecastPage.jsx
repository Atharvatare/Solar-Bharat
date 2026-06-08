import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineSun,
  HiOutlineCloud,
  HiOutlineBolt,
  HiOutlineEye,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import LineChartWidget from '../components/charts/LineChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';

function getWeatherEmoji(code) {
  if (code <= 1) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '☁️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  return '⛈️';
}

function getRatingColor(rating) {
  const map = { Excellent: 'text-emerald-500', Good: 'text-solar-500', Average: 'text-orange-500', Low: 'text-red-500' };
  return map[rating] || 'text-navy-500';
}

function getRatingBg(rating) {
  const map = { Excellent: 'bg-emerald-500/10', Good: 'bg-solar-500/10', Average: 'bg-orange-500/10', Low: 'bg-red-500/10' };
  return map[rating] || 'bg-navy-500/10';
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function SolarForecastPage() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const fetchForecast = async (lat, lng) => {
      setCoords({ lat, lng });
      setLoading(true);
      setError(null);
      try {
        // Fetch 7-day forecast from Open-Meteo (free, no key)
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunshine_duration,uv_index_max,precipitation_sum,cloud_cover_mean&timezone=auto&forecast_days=7&current=temperature_2m,cloud_cover,weather_code`
        );
        const data = await res.json();

        // Also fetch NASA POWER monthly irradiance (last full year)
        let nasaData = null;
        try {
          const nasaRes = await fetch(
            `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN,T2M&community=RE&longitude=${lng}&latitude=${lat}&start=2024&end=2024&format=JSON`
          );
          nasaData = await nasaRes.json();
        } catch { /* NASA API optional */ }

        // Process weekly forecast
        const weekly = data.daily.time.map((date, i) => {
          const cloudCover = data.daily.cloud_cover_mean[i];
          const sunshine = data.daily.sunshine_duration[i] / 3600; // seconds to hours
          const peakSunHours = sunshine * (1 - cloudCover / 100);
          const estGeneration = parseFloat((peakSunHours * 5 * 0.85).toFixed(1)); // 5kW system, 85% eff
          let solarRating = 'Low';
          if (estGeneration > 25) solarRating = 'Excellent';
          else if (estGeneration > 18) solarRating = 'Good';
          else if (estGeneration > 12) solarRating = 'Average';

          return {
            date,
            dayLabel: new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
            weatherCode: data.daily.weather_code[i],
            emoji: getWeatherEmoji(data.daily.weather_code[i]),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            sunshine: parseFloat(sunshine.toFixed(1)),
            uvIndex: data.daily.uv_index_max[i],
            precipitation: data.daily.precipitation_sum[i],
            cloudCover,
            solarRating,
            estGeneration,
          };
        });

        // Process NASA monthly data
        let monthlyIrradiance = null;
        if (nasaData?.properties?.parameter?.ALLSKY_SFC_SW_DWN) {
          const irr = nasaData.properties.parameter.ALLSKY_SFC_SW_DWN;
          const months = Object.entries(irr)
            .filter(([k]) => k.length === 6 && !k.endsWith('13')) // skip annual avg
            .map(([k, v]) => ({
              month: new Date(k.slice(0, 4), parseInt(k.slice(4)) - 1).toLocaleDateString('en-IN', { month: 'short' }),
              irradiance: parseFloat(v.toFixed(2)),
              estGeneration: parseFloat((v / 1000 * 5 * 5 * 0.85 * 30).toFixed(0)), // rough monthly kWh
            }));
          monthlyIrradiance = months;
        }

        setForecast({ weekly, monthlyIrradiance, current: data.current });
      } catch (err) {
        setError('Failed to fetch forecast data');
      } finally {
        setLoading(false);
      }
    };

    // Auto-detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchForecast(pos.coords.latitude, pos.coords.longitude),
        () => fetchForecast(28.6139, 77.2090), // Default: Delhi
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      fetchForecast(28.6139, 77.2090);
    }
  }, []);

  const totalWeekGen = forecast?.weekly?.reduce((s, d) => s + d.estGeneration, 0) || 0;
  const avgSunshine = forecast?.weekly?.reduce((s, d) => s + d.sunshine, 0) / (forecast?.weekly?.length || 1) || 0;
  const avgCloud = forecast?.weekly?.reduce((s, d) => s + d.cloudCover, 0) / (forecast?.weekly?.length || 1) || 0;
  const totalRain = forecast?.weekly?.reduce((s, d) => s + d.precipitation, 0) || 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-navy-200 dark:bg-navy-700 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 glass rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-80 glass rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-10 rounded-2xl text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
          Solar Forecast & Predictions
        </h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">
          Weather-integrated solar generation forecast for your location
          {coords && <span className="font-mono text-xs ml-2">({coords.lat.toFixed(2)}°N, {coords.lng.toFixed(2)}°E)</span>}
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '7-Day Generation', value: `${totalWeekGen.toFixed(0)} kWh`, icon: HiOutlineBolt, color: 'text-solar-500', sub: 'estimated for 5kW system' },
          { label: 'Avg Sunshine', value: `${avgSunshine.toFixed(1)} hrs/day`, icon: HiOutlineSun, color: 'text-yellow-500', sub: 'daily average' },
          { label: 'Avg Cloud Cover', value: `${avgCloud.toFixed(0)}%`, icon: HiOutlineCloud, color: 'text-blue-400', sub: 'weekly average' },
          { label: 'Total Rainfall', value: `${totalRain.toFixed(1)} mm`, icon: HiOutlineEye, color: 'text-cyan-500', sub: 'next 7 days' },
        ].map((s) => (
          <div key={s.label} className="glass p-5 rounded-2xl">
            <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
            <p className="text-xl font-bold font-mono text-navy-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">{s.label}</p>
            <p className="text-[10px] text-navy-400">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* 7-Day Forecast Cards */}
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-3">7-Day Solar Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.weekly.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass p-4 rounded-xl text-center"
            >
              <p className="text-xs font-semibold text-navy-500 dark:text-navy-400">{day.dayLabel}</p>
              <p className="text-3xl my-2">{day.emoji}</p>
              <p className="text-sm font-mono text-navy-900 dark:text-white">{day.tempMax}° / {day.tempMin}°</p>
              <div className="mt-2 pt-2 border-t border-navy-200 dark:border-navy-700">
                <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">{day.estGeneration}</p>
                <p className="text-[10px] text-navy-400">kWh est.</p>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getRatingBg(day.solarRating)} ${getRatingColor(day.solarRating)}`}>
                {day.solarRating}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Generation Chart */}
      <motion.div variants={item} className="glass p-6 rounded-2xl">
        <LineChartWidget
          data={forecast.weekly.map(d => ({
            day: d.dayLabel,
            'Est. Generation (kWh)': d.estGeneration,
            'Sunshine (hrs)': d.sunshine,
            'Cloud Cover (%)': d.cloudCover,
          }))}
          lines={[
            { dataKey: 'Est. Generation (kWh)', color: '#F59E0B', name: 'Est. Generation (kWh)' },
            { dataKey: 'Sunshine (hrs)', color: '#10B981', name: 'Sunshine (hrs)' },
          ]}
          xAxisKey="day"
          title="7-Day Solar Generation vs Sunshine"
          height={300}
        />
      </motion.div>

      {/* Detailed Table */}
      <motion.div variants={item} className="glass p-6 rounded-2xl overflow-x-auto">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Detailed Forecast</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-200 dark:border-navy-700">
              {['Day', 'Weather', 'Temp', 'Sun Hrs', 'Cloud', 'Rain', 'UV', 'Est. kWh', 'Rating'].map(h => (
                <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forecast.weekly.map((d) => (
              <tr key={d.date} className="border-b border-navy-100 dark:border-navy-800/50 hover:bg-navy-50 dark:hover:bg-navy-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-navy-900 dark:text-white">{d.dayLabel}</td>
                <td className="py-3 px-2">{d.emoji}</td>
                <td className="py-3 px-2 font-mono text-navy-700 dark:text-navy-300">{d.tempMax}°/{d.tempMin}°</td>
                <td className="py-3 px-2 font-mono">{d.sunshine}h</td>
                <td className="py-3 px-2 font-mono">{d.cloudCover}%</td>
                <td className="py-3 px-2 font-mono">{d.precipitation}mm</td>
                <td className="py-3 px-2 font-mono">{d.uvIndex}</td>
                <td className="py-3 px-2 font-bold font-mono text-navy-900 dark:text-white">{d.estGeneration}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRatingBg(d.solarRating)} ${getRatingColor(d.solarRating)}`}>
                    {d.solarRating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* NASA Monthly Irradiance */}
      {forecast.monthlyIrradiance && (
        <motion.div variants={item} className="glass p-6 rounded-2xl">
          <BarChartWidget
            data={forecast.monthlyIrradiance}
            bars={[{ dataKey: 'estGeneration', color: '#F59E0B', name: 'Est. Monthly kWh' }]}
            xAxisKey="month"
            title="Monthly Solar Generation Estimate (NASA POWER Data)"
            height={280}
          />
          <p className="text-xs text-navy-400 mt-3">Source: NASA POWER — Based on satellite-derived solar irradiance data for your location</p>
        </motion.div>
      )}
    </motion.div>
  );
}
