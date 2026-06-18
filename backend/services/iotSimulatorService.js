// ============================================
// SOLAR BHARAT — IoT Simulator Service
// Generates realistic solar energy data
// based on time-of-day patterns
// ============================================

/**
 * Add random noise to a value (±percentage)
 * @param {number} value - Base value
 * @param {number} pct - Noise percentage (default 5%)
 * @returns {number} Value with noise applied
 */
const addNoise = (value, pct = 5) => {
  if (value === 0) return 0;
  const noise = 1 + (Math.random() * 2 - 1) * (pct / 100);
  return Math.max(0, value * noise);
};

/**
 * Round a number to specified decimal places
 */
const round = (value, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

/**
 * Get generation profile for a given hour of the day.
 * Returns { voltageFactor, powerFactor, tempOffset, irradianceFactor }
 * where factors are 0-1 representing fraction of peak capacity.
 *
 * @param {number} hour - Hour of day (0-23)
 * @param {number} minute - Minute of hour (0-59)
 * @returns {object} Generation profile factors
 */
const getTimeProfile = (hour, minute = 0) => {
  const t = hour + minute / 60;

  // Nighttime: 0–5 AM and 7 PM–12 AM
  if (t < 5 || t >= 19) {
    return { voltageFactor: 0, powerFactor: 0, tempOffset: 0, irradianceFactor: 0 };
  }

  // Sunrise ramp-up: 5–7 AM
  if (t < 7) {
    const progress = (t - 5) / 2; // 0 → 1 over 2 hours
    return {
      voltageFactor: 0.25 + progress * 0.25,   // 25% → 50% of max voltage
      powerFactor: progress * 0.15,              // 0% → 15% of peak power
      tempOffset: progress * 5,                  // +0 → +5°C
      irradianceFactor: progress * 0.15,         // 0 → 150 W/m²
    };
  }

  // Morning generation: 7–10 AM
  if (t < 10) {
    const progress = (t - 7) / 3; // 0 → 1 over 3 hours
    return {
      voltageFactor: 0.5 + progress * 0.38,     // 50% → 88%
      powerFactor: 0.3 + progress * 0.4,         // 30% → 70%
      tempOffset: 5 + progress * 15,             // +5 → +20°C
      irradianceFactor: 0.3 + progress * 0.45,   // 300 → 750 W/m²
    };
  }

  // Peak generation: 10 AM–2 PM
  if (t < 14) {
    const peakCenter = 12;
    const distFromPeak = Math.abs(t - peakCenter) / 2; // 0 at noon, 1 at edges
    return {
      voltageFactor: 0.88 + (1 - distFromPeak) * 0.12, // 88% → 100%
      powerFactor: 0.8 + (1 - distFromPeak) * 0.2,      // 80% → 100%
      tempOffset: 20 + (1 - distFromPeak) * 10,          // +20 → +30°C
      irradianceFactor: 0.75 + (1 - distFromPeak) * 0.25, // 750 → 1000 W/m²
    };
  }

  // Afternoon decline: 2–5 PM
  if (t < 17) {
    const progress = (t - 14) / 3; // 0 → 1 over 3 hours
    return {
      voltageFactor: 0.88 - progress * 0.38,     // 88% → 50%
      powerFactor: 0.7 - progress * 0.3,          // 70% → 40%
      tempOffset: 20 - progress * 10,             // +20 → +10°C
      irradianceFactor: 0.75 - progress * 0.45,   // 750 → 300 W/m²
    };
  }

  // Sunset ramp-down: 5–7 PM
  const progress = (t - 17) / 2; // 0 → 1 over 2 hours
  return {
    voltageFactor: 0.5 - progress * 0.5,       // 50% → 0%
    powerFactor: 0.4 - progress * 0.4,          // 40% → 0%
    tempOffset: 10 - progress * 10,             // +10 → 0°C
    irradianceFactor: 0.3 - progress * 0.3,     // 300 → 0 W/m²
  };
};

/**
 * Generate a single live reading based on current system time.
 *
 * @param {number} systemCapacityKw - System capacity in kW (default 5)
 * @returns {object} Reading with all sensor values
 */
export const generateLiveReading = (systemCapacityKw = 5) => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  return generateReadingForTime(systemCapacityKw, hour, minute, now);
};

/**
 * Internal: generate a reading for a specific time.
 */
const generateReadingForTime = (systemCapacityKw, hour, minute, timestamp) => {
  const peakPower = systemCapacityKw * 1000; // watts
  const maxVoltage = 400; // V (DC bus voltage)
  const profile = getTimeProfile(hour, minute);

  // Electrical measurements
  const voltage = round(addNoise(profile.voltageFactor * maxVoltage));
  const power = round(addNoise(profile.powerFactor * peakPower));
  const current = voltage > 0 ? round(power / voltage, 3) : 0;

  // Cumulative energy approximation (kWh generated up to this hour)
  const energyHours = Math.max(0, Math.min(hour + minute / 60 - 5, 14)); // hours since sunrise (5 AM)
  const avgPowerFraction = profile.powerFactor * 0.6; // average over the day ramp
  const energy = round(avgPowerFraction * peakPower * energyHours / 1000, 3);

  // Environmental
  const baseTemp = 25;
  const temperature = round(addNoise(baseTemp + profile.tempOffset, 3)); // panel temp
  const ambientTemp = round(addNoise(baseTemp + profile.tempOffset * 0.5, 3));
  const irradiance = round(addNoise(profile.irradianceFactor * 1000));
  const humidity = round(addNoise(50 - profile.tempOffset * 0.5, 8)); // inverse relationship with temp

  // Derived
  const efficiency = power > 0 ? round(15 + profile.powerFactor * 7, 2) : 0; // 15-22%
  const powerFactor = power > 0 ? round(0.85 + Math.random() * 0.14, 3) : 0; // 0.85–0.99
  const frequency = round(addNoise(50, 0.4), 2); // 49.8–50.2 Hz

  return {
    voltage,
    current,
    power,
    energy,
    frequency,
    temperature,
    ambientTemp,
    irradiance,
    humidity: round(Math.max(30, Math.min(70, humidity))),
    efficiency,
    powerFactor,
    timestamp: timestamp || new Date(),
  };
};

/**
 * Generate 288 readings (every 5 minutes) for a full day.
 *
 * @param {number} systemCapacityKw - System capacity in kW
 * @param {Date} date - Date to generate readings for (default: today)
 * @returns {Array<object>} Array of 288 reading objects
 */
export const generateDailyReadings = (systemCapacityKw = 5, date = new Date()) => {
  const readings = [];
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 288; i++) {
    const minuteOfDay = i * 5;
    const hour = Math.floor(minuteOfDay / 60);
    const minute = minuteOfDay % 60;

    const timestamp = new Date(baseDate);
    timestamp.setHours(hour, minute, 0, 0);

    readings.push(generateReadingForTime(systemCapacityKw, hour, minute, timestamp));
  }

  return readings;
};

/**
 * Generate aggregated daily statistics.
 *
 * @param {number} systemCapacityKw - System capacity in kW
 * @returns {object} Daily stats summary
 */
export const generateDailyStats = (systemCapacityKw = 5) => {
  const readings = generateDailyReadings(systemCapacityKw);
  const peakPower = systemCapacityKw * 1000;

  // Total energy: sum of power readings × 5-minute intervals, converted to kWh
  const totalEnergy = round(
    readings.reduce((sum, r) => sum + r.power, 0) * (5 / 60) / 1000,
    2
  );

  // Peak power recorded
  const maxPower = round(Math.max(...readings.map((r) => r.power)));

  // Average voltage (only during generation hours)
  const activeReadings = readings.filter((r) => r.voltage > 0);
  const avgVoltage = activeReadings.length > 0
    ? round(activeReadings.reduce((sum, r) => sum + r.voltage, 0) / activeReadings.length)
    : 0;

  // Average efficiency (only during generation hours)
  const effReadings = readings.filter((r) => r.efficiency > 0);
  const avgEfficiency = effReadings.length > 0
    ? round(effReadings.reduce((sum, r) => sum + r.efficiency, 0) / effReadings.length)
    : 0;

  // Sunshine hours (hours where power > 10% of peak)
  const sunshineReadings = readings.filter((r) => r.power > peakPower * 0.1);
  const sunshineHours = round(sunshineReadings.length * 5 / 60, 1);

  // CO2 offset: 0.82 kg CO2 per kWh (Indian grid average)
  const co2Offset = round(totalEnergy * 0.82, 2);

  return {
    totalEnergy,
    peakPower: maxPower,
    avgVoltage,
    avgEfficiency,
    sunshineHours,
    co2Offset,
  };
};
