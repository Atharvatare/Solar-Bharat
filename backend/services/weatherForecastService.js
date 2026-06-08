import logger from '../utils/logger.js';

// ── Fallback estimates for when APIs are unreachable ─────────────────────────
const FALLBACK_MONTHLY = {
  avgIrradiance: 5.5,
  avgTemp: 28,
  avgHumidity: 55,
  avgWindSpeed: 3.0,
  peakSunHours: 5.0,
  estimatedMonthlyKwh: 637.5, // 5 * 5 * 0.85 * 30
};

const WEATHER_CODE_LABELS = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
  55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Slight showers',
  81: 'Moderate showers', 82: 'Violent showers', 95: 'Thunderstorm',
  96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
};

// ── Helper: rate a day's solar generation ────────────────────────────────────
const rateSolar = (estimatedKwh) => {
  if (estimatedKwh > 25) return 'Excellent';
  if (estimatedKwh > 18) return 'Good';
  if (estimatedKwh > 12) return 'Average';
  return 'Low';
};

// ── Fetch wrapper with timeout ───────────────────────────────────────────────
const fetchWithTimeout = async (url, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

// ── NASA POWER API ───────────────────────────────────────────────────────────
const fetchNasaPower = async (lat, lng) => {
  const url =
    `https://power.larc.nasa.gov/api/temporal/daily/point` +
    `?parameters=ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN,T2M,RH2M,WS2M` +
    `&community=RE&longitude=${lng}&latitude=${lat}` +
    `&start=20250101&end=20250131&format=JSON`;

  const data = await fetchWithTimeout(url, 20000);
  const params = data?.properties?.parameter;
  if (!params) throw new Error('NASA POWER returned unexpected payload');

  // Average each parameter over all days in the response
  const avg = (obj) => {
    const vals = Object.values(obj).filter((v) => v > -990); // NASA uses -999 for missing
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  return {
    avgIrradiance: Math.round((avg(params.ALLSKY_SFC_SW_DWN) ?? 5.5) * 100) / 100,
    avgTemp: Math.round((avg(params.T2M) ?? 28) * 10) / 10,
    avgHumidity: Math.round((avg(params.RH2M) ?? 55) * 10) / 10,
    avgWindSpeed: Math.round((avg(params.WS2M) ?? 3) * 10) / 10,
  };
};

// ── Open-Meteo Forecast API ──────────────────────────────────────────────────
const fetchOpenMeteo = async (lat, lng) => {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
    `sunshine_duration,uv_index_max,precipitation_sum,cloud_cover_mean` +
    `&timezone=auto&forecast_days=7`;

  const data = await fetchWithTimeout(url);
  const d = data?.daily;
  if (!d || !d.time) throw new Error('Open-Meteo returned unexpected payload');

  return d.time.map((date, i) => ({
    date,
    weatherCode: d.weather_code[i],
    weatherLabel: WEATHER_CODE_LABELS[d.weather_code[i]] || 'Unknown',
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    sunshineDuration: d.sunshine_duration[i], // seconds
    uvIndex: d.uv_index_max[i],
    precipitation: d.precipitation_sum[i],
    cloudCover: d.cloud_cover_mean[i],
  }));
};

// ── Main exported function ───────────────────────────────────────────────────

/**
 * Fetch 7-day solar forecast + monthly irradiance averages for a location.
 * @param {number} lat  Latitude
 * @param {number} lng  Longitude
 * @returns {Promise<object>} Structured forecast object
 */
export const getSolarForecast = async (lat, lng) => {
  // Fire both API calls in parallel
  const [nasaResult, meteoResult] = await Promise.allSettled([
    fetchNasaPower(lat, lng),
    fetchOpenMeteo(lat, lng),
  ]);

  // ── Monthly averages from NASA ──────────────────────────────────────────
  let monthlyAverage;
  if (nasaResult.status === 'fulfilled') {
    const nasa = nasaResult.value;
    const peakSunHours = Math.round((nasa.avgIrradiance / 1000) * (nasa.avgIrradiance > 0 ? nasa.avgIrradiance : 5) * 100) / 100;
    // More practical: peakSunHours ≈ avgIrradiance (kWh/m²/day) directly for daily irradiance
    const practicalPeakSunHours = Math.round(nasa.avgIrradiance * 100) / 100;
    const estimatedMonthlyKwh = Math.round(practicalPeakSunHours * 5 * 0.85 * 30 * 100) / 100; // 5kW system, 85% efficiency, 30 days

    monthlyAverage = {
      ...nasa,
      peakSunHours: practicalPeakSunHours,
      estimatedMonthlyKwh,
    };
  } else {
    logger.warn(`NASA POWER API failed: ${nasaResult.reason?.message}`);
    monthlyAverage = { ...FALLBACK_MONTHLY };
  }

  // ── Weekly forecast from Open-Meteo ─────────────────────────────────────
  let weeklyForecast;
  if (meteoResult.status === 'fulfilled') {
    weeklyForecast = meteoResult.value.map((day) => {
      // sunshine_duration is in seconds; convert to hours
      const sunshineHours = day.sunshineDuration / 3600;

      // peakSunHours for this day = irradiance-based estimate scaled by sunshine
      const dayPeakSunHours = monthlyAverage.peakSunHours * (sunshineHours / 12); // normalise to 12h day

      // estimatedGeneration (kWh) for a 5kW system
      const estimatedGeneration =
        Math.round(
          dayPeakSunHours * 5 * (1 - day.cloudCover / 100) * 0.85 * 100
        ) / 100;

      const solarRating = rateSolar(estimatedGeneration);

      return {
        ...day,
        sunshineHours: Math.round(sunshineHours * 10) / 10,
        solarRating,
        estimatedGeneration,
      };
    });
  } else {
    logger.warn(`Open-Meteo API failed: ${meteoResult.reason?.message}`);
    // Generate fallback 7-day forecast
    weeklyForecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        weatherCode: 1,
        weatherLabel: 'Mainly clear',
        tempMax: 35,
        tempMin: 24,
        sunshineDuration: 36000,
        sunshineHours: 10,
        uvIndex: 8,
        precipitation: 0,
        cloudCover: 20,
        solarRating: 'Good',
        estimatedGeneration: 21.25,
      };
    });
  }

  return {
    location: { lat, lng },
    weeklyForecast,
    monthlyAverage,
  };
};

export default { getSolarForecast };
