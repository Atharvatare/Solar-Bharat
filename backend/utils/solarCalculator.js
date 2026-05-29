/**
 * Solar PV System Calculator Engine
 * Calculates recommended capacity, cost, savings, and ROI based on monthly electricity consumption.
 */

// Basic Assumptions for India
const SUN_HOURS_PER_DAY = 4.5;
const DAYS_IN_MONTH = 30;
const SYSTEM_EFFICIENCY = 0.75; // 75% efficiency (accounting for dust, heat, wire losses)
const COST_PER_KW = 50000; // Average cost in INR per kW (approx ₹50,000 for standard residential)
const LIFESPAN_YEARS = 25; // Standard solar panel warranty/lifespan
const ANNUAL_DEGRADATION = 0.007; // 0.7% degradation per year

/**
 * Calculates the recommended Solar PV system size and financial metrics.
 * 
 * @param {number} monthlyUnits - The monthly electricity consumption in kWh
 * @param {number} monthlyBillAmount - The monthly bill amount in INR
 * @returns {Object} Complete analysis report
 */
export const calculateSolarMetrics = (monthlyUnits, monthlyBillAmount) => {
  // 1. Calculate Required Capacity (kW)
  // Formula: (Monthly Units) / (30 days * Sun Hours * Efficiency)
  let requiredCapacityKW = monthlyUnits / (DAYS_IN_MONTH * SUN_HOURS_PER_DAY * SYSTEM_EFFICIENCY);
  
  // Round up to nearest 0.5 kW (standard system sizes)
  requiredCapacityKW = Math.ceil(requiredCapacityKW * 2) / 2;
  
  // Calculate actual generation of the recommended system
  const monthlyGeneration = requiredCapacityKW * SUN_HOURS_PER_DAY * DAYS_IN_MONTH * SYSTEM_EFFICIENCY;
  
  // 2. Financials
  const estimatedCost = requiredCapacityKW * COST_PER_KW;
  
  // Government Subsidy Estimate (PM Surya Ghar Muft Bijli Yojana rules approx)
  let subsidy = 0;
  if (requiredCapacityKW <= 2) {
    subsidy = requiredCapacityKW * 30000;
  } else if (requiredCapacityKW <= 3) {
    subsidy = 60000 + ((requiredCapacityKW - 2) * 18000); // 30k for first 2, 18k for 3rd
  } else {
    subsidy = 78000; // Max subsidy capped
  }
  
  const finalCostAfterSubsidy = estimatedCost - subsidy;
  
  // 3. Savings and ROI
  const effectiveTariff = monthlyBillAmount / monthlyUnits; // Cost per unit
  
  // Monthly savings = Units saved * Tariff (capped at their actual consumption)
  const unitsSaved = Math.min(monthlyGeneration, monthlyUnits);
  const monthlySavings = unitsSaved * effectiveTariff;
  const annualSavings = monthlySavings * 12;
  
  const paybackPeriodYears = finalCostAfterSubsidy / annualSavings;
  
  // Lifetime savings calculation (accounting for degradation and 3% annual tariff increase)
  let lifetimeSavings = 0;
  let currentTariff = effectiveTariff;
  let currentGeneration = annualSavings / effectiveTariff; // Annual generation
  
  for (let year = 1; year <= LIFESPAN_YEARS; year++) {
    lifetimeSavings += currentGeneration * currentTariff;
    currentGeneration *= (1 - ANNUAL_DEGRADATION); // Generation decreases
    currentTariff *= 1.03; // Tariff increases by 3% every year
  }
  
  // Subtract the initial cost to get net lifetime savings
  const netLifetimeSavings = lifetimeSavings - finalCostAfterSubsidy;

  // 4. Environmental Impact
  // 1 kWh = ~0.82 kg of CO2 equivalent
  const co2SavedKgPerYear = (monthlyGeneration * 12) * 0.82;
  const treesPlantedEquivalent = (co2SavedKgPerYear / 21); // 1 tree absorbs ~21kg CO2 per year

  return {
    consumption: {
      monthlyUnits,
      monthlyBillAmount,
      effectiveTariff: parseFloat(effectiveTariff.toFixed(2))
    },
    recommendation: {
      systemSizeKw: requiredCapacityKW,
      panelsRequired: Math.ceil(requiredCapacityKW / 0.54), // Assuming 540W panels
      spaceRequiredSqFt: requiredCapacityKW * 100 // ~100 sq ft per kW
    },
    financials: {
      estimatedCost,
      subsidy,
      finalCost: finalCostAfterSubsidy,
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      paybackPeriodYears: parseFloat(paybackPeriodYears.toFixed(1)),
      netLifetimeSavings: Math.round(netLifetimeSavings)
    },
    environmental: {
      co2SavedKgPerYear: Math.round(co2SavedKgPerYear),
      treesEquivalent: Math.round(treesPlantedEquivalent)
    }
  };
};
