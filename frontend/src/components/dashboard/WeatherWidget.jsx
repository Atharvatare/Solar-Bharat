import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineSun,
  HiOutlineCloud,
  HiOutlineEye,
  HiOutlineBolt,
} from 'react-icons/hi2';

const weatherIcons = {
  clear: '☀️',
  partlyCloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  foggy: '🌫️',
};

function getWeatherCondition(weatherCode) {
  if (weatherCode <= 1) return { condition: 'Clear Sky', icon: weatherIcons.clear, solarRating: 'Excellent' };
  if (weatherCode <= 3) return { condition: 'Partly Cloudy', icon: weatherIcons.partlyCloudy, solarRating: 'Good' };
  if (weatherCode <= 48) return { condition: 'Cloudy / Foggy', icon: weatherIcons.foggy, solarRating: 'Low' };
  if (weatherCode <= 67) return { condition: 'Rainy', icon: weatherIcons.rainy, solarRating: 'Very Low' };
  if (weatherCode <= 77) return { condition: 'Snowy', icon: weatherIcons.cloudy, solarRating: 'Very Low' };
  if (weatherCode <= 99) return { condition: 'Stormy', icon: weatherIcons.stormy, solarRating: 'None' };
  return { condition: 'Unknown', icon: '❓', solarRating: 'Unknown' };
}

function getSolarColor(rating) {
  const colors = {
    'Excellent': 'text-emerald-500',
    'Good': 'text-solar-500',
    'Low': 'text-orange-500',
    'Very Low': 'text-red-500',
    'None': 'text-red-600',
  };
  return colors[rating] || 'text-navy-500';
}

export default function WeatherWidget({ className }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,cloud_cover&daily=sunrise,sunset&timezone=auto&forecast_days=1`
        );
        const data = await res.json();
        const current = data.current;
        const daily = data.daily;

        const { condition, icon, solarRating } = getWeatherCondition(current.weather_code);
        const solarWindow = `${daily.sunrise[0]?.split('T')[1]?.slice(0, 5)} – ${daily.sunset[0]?.split('T')[1]?.slice(0, 5)}`;

        setWeather({
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          cloudCover: current.cloud_cover,
          condition,
          icon,
          solarRating,
          solarWindow,
          estimatedGeneration: Math.round((100 - current.cloud_cover) / 100 * 5.5 * 10) / 10, // rough kW estimate
        });
      } catch {
        setError('Weather data unavailable');
      } finally {
        setLoading(false);
      }
    };

    // Try browser geolocation, fallback to Delhi coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(28.6139, 77.2090), // Default: New Delhi
        { timeout: 5000 }
      );
    } else {
      fetchWeather(28.6139, 77.2090);
    }
  }, []);

  if (loading) {
    return (
      <div className={`glass p-6 rounded-2xl animate-pulse ${className || ''}`}>
        <div className="h-4 bg-navy-200 dark:bg-navy-700 rounded w-1/3 mb-4" />
        <div className="h-12 bg-navy-200 dark:bg-navy-700 rounded w-1/2 mb-3" />
        <div className="h-3 bg-navy-200 dark:bg-navy-700 rounded w-full" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`glass p-6 rounded-2xl ${className || ''}`}>
        <p className="text-navy-500 dark:text-navy-400 text-sm">{error || 'No weather data'}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-2xl ${className || ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-display font-semibold text-navy-900 dark:text-white">
          Weather & Solar Forecast
        </h3>
        <span className="text-3xl">{weather.icon}</span>
      </div>

      {/* Temperature + Condition */}
      <div className="mb-5">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold font-mono text-navy-900 dark:text-white">
            {weather.temperature}°C
          </span>
          <span className="text-sm text-navy-500 dark:text-navy-400 pb-1">
            {weather.condition}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
          <HiOutlineCloud className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-navy-500 dark:text-navy-400">Cloud Cover</p>
            <p className="text-sm font-semibold font-mono text-navy-900 dark:text-white">{weather.cloudCover}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
          <HiOutlineEye className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-navy-500 dark:text-navy-400">Humidity</p>
            <p className="text-sm font-semibold font-mono text-navy-900 dark:text-white">{weather.humidity}%</p>
          </div>
        </div>
      </div>

      {/* Solar Forecast */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-solar-500/10 to-orange-500/10 border border-solar-500/20">
        <div className="flex items-center gap-2 mb-2">
          <HiOutlineSun className="w-5 h-5 text-solar-500" />
          <span className="text-sm font-semibold text-navy-900 dark:text-white">Solar Generation Forecast</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-navy-500 dark:text-navy-400">Expected Output</p>
            <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">{weather.estimatedGeneration} kWh/kW</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-navy-500 dark:text-navy-400">Rating</p>
            <p className={`text-sm font-bold ${getSolarColor(weather.solarRating)}`}>{weather.solarRating}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <HiOutlineBolt className="w-3.5 h-3.5 text-solar-500" />
          <p className="text-xs text-navy-500 dark:text-navy-400">Solar Window: {weather.solarWindow}</p>
        </div>
      </div>
    </motion.div>
  );
}
