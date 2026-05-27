import { SOLAR_CONSTANTS } from '../utils/constants.js';

const {
  AVG_SUNLIGHT_HOURS,
  PANEL_WATT_RATING,
  COST_PER_WATT,
  SUBSIDY_PERCENT,
  SYSTEM_LOSS,
  CO2_PER_KWH,
  PANEL_LIFETIME_YEARS,
  DEGRADATION_RATE,
} = SOLAR_CONSTANTS;

// City-specific solar irradiance data (kWh/m²/day)
const CITY_IRRADIANCE = {
  'Mumbai': 5.2, 'Delhi': 5.5, 'Bangalore': 5.6, 'Chennai': 5.4,
  'Hyderabad': 5.7, 'Pune': 5.3, 'Jaipur': 6.2, 'Kolkata': 4.8,
  'Ahmedabad': 5.8, 'Lucknow': 5.1, 'Chandigarh': 5.4, 'Bhopal': 5.5,
  'Thiruvananthapuram': 5.0, 'Jodhpur': 6.5, 'Nagpur': 5.6,
  default: 5.5,
};

// Panel efficiency by type
const PANEL_EFFICIENCY = {
  monocrystalline: 0.21,
  polycrystalline: 0.17,
  thin_film: 0.13,
};

/**
 * Calculate solar system recommendation
 */
export const calculateSolarSystem = (inputs) => {
  const {
    roofArea = 500,
    monthlyBill = 5000,
    electricityRate = 8,
    sunlightHours,
    location = {},
    panelType = 'monocrystalline',
    includeSubsidy = true,
    monthlyConsumption,
  } = inputs;

  // Determine solar hours based on city or manual input
  const city = location.city || 'default';
  const effectiveSunlightHours = sunlightHours || CITY_IRRADIANCE[city] || AVG_SUNLIGHT_HOURS;
  
  // Calculate monthly consumption
  const consumption = monthlyConsumption || (monthlyBill / electricityRate); // kWh
  
  // Required daily generation (accounting for system losses)
  const dailyRequirement = (consumption / 30) / (1 - SYSTEM_LOSS / 100);
  
  // System size in kW
  const systemSize = Math.round((dailyRequirement / effectiveSunlightHours) * 10) / 10;
  
  // Number of panels
  const panelEfficiency = PANEL_EFFICIENCY[panelType] || 0.21;
  const panelArea = 2.0; // m² typical panel area
  const panelOutput = panelArea * 1000 * panelEfficiency; // Watts per panel in ideal conditions
  const numberOfPanels = Math.ceil((systemSize * 1000) / PANEL_WATT_RATING);
  
  // Required roof area (sq ft)
  const requiredRoofArea = numberOfPanels * 20; // ~20 sq ft per panel
  const usableRoofArea = Math.min(roofArea * 0.85, requiredRoofArea); // 85% usable
  
  // Costs
  const totalCost = Math.round(systemSize * 1000 * COST_PER_WATT);
  const subsidyAmount = includeSubsidy ? calculateSubsidy(systemSize) : 0;
  const costAfterSubsidy = totalCost - subsidyAmount;
  
  // Annual generation
  const annualGeneration = Math.round(
    systemSize * effectiveSunlightHours * 365 * (1 - SYSTEM_LOSS / 100)
  );
  
  // Savings
  const annualSavings = Math.round(annualGeneration * electricityRate * 0.85); // 85% self-consumption
  const monthlySavings = Math.round(annualSavings / 12);
  
  // Payback
  const paybackPeriod = Math.round((costAfterSubsidy / annualSavings) * 10) / 10;
  
  // Environmental
  const co2OffsetPerYear = Math.round(annualGeneration * CO2_PER_KWH);
  const treesEquivalent = Math.round(co2OffsetPerYear / 22);
  
  // Lifetime savings (25 years with degradation)
  let lifetimeSavings = 0;
  for (let year = 1; year <= PANEL_LIFETIME_YEARS; year++) {
    const degradationFactor = 1 - (DEGRADATION_RATE / 100) * (year - 1);
    lifetimeSavings += annualSavings * degradationFactor;
  }
  lifetimeSavings = Math.round(lifetimeSavings);
  
  // ROI
  const roi = Math.round(((lifetimeSavings - costAfterSubsidy) / costAfterSubsidy) * 100);
  
  // Monthly projection
  const monthlyProjection = generateMonthlyProjection(annualGeneration, monthlySavings);
  
  // ROI projection
  const roiProjection = generateROIProjection(annualSavings, costAfterSubsidy);

  return {
    systemSize,
    numberOfPanels,
    requiredRoofArea,
    totalCost,
    subsidyAmount,
    costAfterSubsidy,
    annualGeneration,
    annualSavings,
    monthlySavings,
    paybackPeriod,
    lifetimeSavings,
    co2OffsetPerYear,
    treesEquivalent,
    roi,
    monthlyProjection,
    roiProjection,
  };
};

/**
 * Calculate government subsidy (PM Surya Ghar scheme)
 */
const calculateSubsidy = (systemSize) => {
  // Up to 3kW: ₹30,000/kW subsidy
  // 3-10kW: ₹18,000/kW for additional capacity
  let subsidy = 0;
  if (systemSize <= 3) {
    subsidy = systemSize * 30000;
  } else {
    subsidy = 3 * 30000 + (Math.min(systemSize, 10) - 3) * 18000;
  }
  return Math.round(subsidy);
};

/**
 * Generate monthly projection with seasonal variation
 */
const generateMonthlyProjection = (annualGeneration, monthlySavings) => {
  const seasonalFactors = [0.85, 0.90, 1.05, 1.10, 1.15, 0.80, 0.65, 0.70, 0.85, 1.00, 1.05, 0.90];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, i) => ({
    month,
    generation: Math.round((annualGeneration / 12) * seasonalFactors[i]),
    savings: Math.round(monthlySavings * seasonalFactors[i]),
  }));
};

/**
 * Generate 25-year ROI projection
 */
const generateROIProjection = (annualSavings, investment) => {
  const projection = [];
  let cumulative = 0;
  
  for (let year = 0; year <= PANEL_LIFETIME_YEARS; year++) {
    const degradationFactor = year === 0 ? 0 : 1 - (DEGRADATION_RATE / 100) * (year - 1);
    const yearSavings = year === 0 ? 0 : Math.round(annualSavings * degradationFactor);
    cumulative += yearSavings;
    
    projection.push({
      year,
      cumulativeSavings: cumulative,
      netBenefit: cumulative - investment,
    });
  }
  
  return projection;
};

/**
 * Perform rooftop analysis
 */
export const analyzeRooftop = (inputs) => {
  const { address, roofArea = 500, pincode } = inputs;
  
  // Simulated AI analysis results
  const usableArea = Math.round(roofArea * (0.75 + Math.random() * 0.15));
  const shadingFactor = Math.round(85 + Math.random() * 12);
  const roofTilt = Math.round(10 + Math.random() * 10);
  const orientations = ['South-facing', 'South-West', 'South-East', 'East-facing', 'West-facing'];
  const roofOrientation = orientations[Math.floor(Math.random() * 3)]; // bias towards south
  
  const suitability = shadingFactor >= 85 ? 'suitable' : shadingFactor >= 70 ? 'marginal' : 'unsuitable';
  
  // Calculate based on usable area
  const calculatorInputs = {
    roofArea: usableArea,
    monthlyBill: 5000,
    electricityRate: 8,
    location: { city: address.split(',').pop()?.trim() || 'Mumbai' },
    panelType: 'monocrystalline',
    includeSubsidy: true,
  };
  
  const solarResults = calculateSolarSystem(calculatorInputs);
  
  return {
    rooftopAnalysis: {
      usableArea,
      roofOrientation,
      roofTilt,
      shadingFactor,
      structuralSuitability: suitability,
      estimatedOutput: solarResults.annualGeneration,
    },
    recommendation: solarResults,
  };
};

export default {
  calculateSolarSystem,
  analyzeRooftop,
};
