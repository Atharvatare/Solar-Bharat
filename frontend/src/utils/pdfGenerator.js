import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Solar Bharat — PDF Report Generator
 * Generates professional downloadable PDF reports
 */

const COLORS = {
  primary: [245, 158, 11],    // solar-500
  dark: [15, 23, 42],         // navy-950
  gray: [100, 116, 139],      // navy-500
  white: [255, 255, 255],
  green: [16, 185, 129],
  blue: [59, 130, 246],
};

function addHeader(doc, title) {
  // Background bar
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, 210, 40, 'F');

  // Solar accent
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 38, 210, 3, 'F');

  // Logo text
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('☀ Solar Bharat', 15, 20);

  // Subtitle
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 15, 30);

  // Date
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 210 - 15, 30, { align: 'right' });

  return 50; // y position after header
}

function addFooter(doc, pageNum, totalPages) {
  const y = 285;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, 195, y);
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.gray);
  doc.text('Solar Bharat — AI-Powered Renewable Energy Platform | www.solarbharat.in', 15, y + 5);
  doc.text(`Page ${pageNum} of ${totalPages}`, 195, y + 5, { align: 'right' });
}

function addSectionTitle(doc, y, title) {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text(title, 15, y);
  doc.setFillColor(...COLORS.primary);
  doc.rect(15, y + 2, 40, 1.5, 'F');
  return y + 12;
}

function addKeyValue(doc, y, key, value, x = 15) {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(key, x, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text(String(value), x + 55, y);
  return y + 7;
}

// ═══════════════════════════════════════════
// SOLAR ANALYSIS REPORT
// ═══════════════════════════════════════════
export function generateSolarAnalysisReport(data) {
  const doc = new jsPDF();
  let y = addHeader(doc, 'Solar System Analysis Report');

  // System Overview
  y = addSectionTitle(doc, y, 'System Overview');
  y = addKeyValue(doc, y, 'System Size:', `${data.systemSize || '5'} kW`);
  y = addKeyValue(doc, y, 'Panel Count:', `${data.panelCount || '14'} panels`);
  y = addKeyValue(doc, y, 'Panel Type:', data.panelType || 'Monocrystalline 540W');
  y = addKeyValue(doc, y, 'Roof Area Used:', `${data.roofArea || '420'} sq ft`);
  y = addKeyValue(doc, y, 'Tilt Angle:', `${data.tiltAngle || '15'}°`);
  y = addKeyValue(doc, y, 'Orientation:', data.orientation || 'South-facing');
  y += 5;

  // Financial Summary
  y = addSectionTitle(doc, y, 'Financial Summary');
  y = addKeyValue(doc, y, 'Total Cost:', `₹${(data.totalCost || 250000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Govt Subsidy:', `₹${(data.subsidy || 78000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Net Cost:', `₹${(data.netCost || 172000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Monthly Savings:', `₹${(data.monthlySavings || 3500).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Annual Savings:', `₹${(data.annualSavings || 42000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Payback Period:', `${data.payback || '3.8'} years`);
  y = addKeyValue(doc, y, '25-Year Savings:', `₹${(data.lifetimeSavings || 1200000).toLocaleString()}`);
  y += 5;

  // Energy Production
  y = addSectionTitle(doc, y, 'Energy Production');
  y = addKeyValue(doc, y, 'Daily Generation:', `${data.dailyGen || '22'} kWh`);
  y = addKeyValue(doc, y, 'Monthly Generation:', `${data.monthlyGen || '660'} kWh`);
  y = addKeyValue(doc, y, 'Annual Generation:', `${data.annualGen || '7920'} kWh`);
  y = addKeyValue(doc, y, 'Peak Sun Hours:', `${data.sunHours || '5.5'} hrs/day`);
  y += 5;

  // Environmental Impact
  y = addSectionTitle(doc, y, 'Environmental Impact');
  y = addKeyValue(doc, y, 'CO₂ Offset/Year:', `${data.co2Offset || '6336'} kg`);
  y = addKeyValue(doc, y, 'Trees Equivalent:', `${data.treesEquiv || '302'} trees`);
  y = addKeyValue(doc, y, '25-Year Impact:', `${data.lifetimeCO2 || '158'} tonnes CO₂`);

  addFooter(doc, 1, 1);
  doc.save(`Solar_Bharat_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ═══════════════════════════════════════════
// ROI REPORT
// ═══════════════════════════════════════════
export function generateROIReport(data) {
  const doc = new jsPDF();
  let y = addHeader(doc, 'Return on Investment Report');

  y = addSectionTitle(doc, y, 'Investment Summary');
  y = addKeyValue(doc, y, 'System Cost:', `₹${(data.systemCost || 250000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Subsidy:', `₹${(data.subsidy || 78000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Net Investment:', `₹${(data.netCost || 172000).toLocaleString()}`);
  y = addKeyValue(doc, y, 'Total ROI:', `${data.roi || '598'}%`);
  y = addKeyValue(doc, y, 'Payback Period:', `${data.payback || '3.8'} years`);
  y += 5;

  // Year-by-year projection table
  y = addSectionTitle(doc, y, '10-Year Savings Projection');

  const tableData = [];
  const netCost = data.netCost || 172000;
  let cumulative = 0;
  for (let yr = 1; yr <= 10; yr++) {
    const annual = (data.annualSavings || 42000) * (1 + 0.03 * (yr - 1));
    cumulative += annual;
    const profit = cumulative - netCost;
    tableData.push([
      `Year ${yr}`,
      `₹${Math.round(annual).toLocaleString()}`,
      `₹${Math.round(cumulative).toLocaleString()}`,
      profit > 0 ? `+₹${Math.round(profit).toLocaleString()}` : `-₹${Math.round(Math.abs(profit)).toLocaleString()}`,
    ]);
  }

  doc.autoTable({
    startY: y,
    head: [['Year', 'Annual Savings', 'Cumulative', 'Net Profit/Loss']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: COLORS.dark, textColor: COLORS.white, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 15, right: 15 },
  });

  addFooter(doc, 1, 1);
  doc.save(`Solar_Bharat_ROI_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ═══════════════════════════════════════════
// ENERGY ANALYTICS REPORT
// ═══════════════════════════════════════════
export function generateEnergyReport(data) {
  const doc = new jsPDF();
  let y = addHeader(doc, 'Energy Analytics Report');

  y = addSectionTitle(doc, y, 'Energy Overview');
  y = addKeyValue(doc, y, 'Total Generated:', `${data.totalGenerated || '4,280'} kWh`);
  y = addKeyValue(doc, y, 'Total Consumed:', `${data.totalConsumed || '2,850'} kWh`);
  y = addKeyValue(doc, y, 'Net Exported:', `${data.netExported || '1,430'} kWh`);
  y = addKeyValue(doc, y, 'Self-Consumption:', `${data.selfConsumption || '66.6'}%`);
  y = addKeyValue(doc, y, 'System Efficiency:', `${data.efficiency || '94.2'}%`);
  y = addKeyValue(doc, y, 'System Uptime:', `${data.uptime || '99.7'}%`);
  y += 5;

  // Monthly breakdown table
  y = addSectionTitle(doc, y, 'Monthly Breakdown');

  const months = data.monthlyData || [
    { month: 'Jan', gen: 580, cons: 450, saved: 2600 },
    { month: 'Feb', gen: 620, cons: 420, saved: 2800 },
    { month: 'Mar', gen: 710, cons: 400, saved: 3200 },
    { month: 'Apr', gen: 780, cons: 380, saved: 3600 },
    { month: 'May', gen: 820, cons: 410, saved: 3800 },
    { month: 'Jun', gen: 650, cons: 450, saved: 3000 },
    { month: 'Jul', gen: 550, cons: 480, saved: 2400 },
    { month: 'Aug', gen: 580, cons: 460, saved: 2600 },
    { month: 'Sep', gen: 680, cons: 430, saved: 3100 },
    { month: 'Oct', gen: 720, cons: 400, saved: 3300 },
    { month: 'Nov', gen: 640, cons: 380, saved: 2900 },
    { month: 'Dec', gen: 590, cons: 390, saved: 2700 },
  ];

  doc.autoTable({
    startY: y,
    head: [['Month', 'Generated (kWh)', 'Consumed (kWh)', 'Savings (₹)']],
    body: months.map(m => [m.month, m.gen, m.cons, `₹${m.saved.toLocaleString()}`]),
    theme: 'striped',
    headStyles: { fillColor: COLORS.dark, textColor: COLORS.white, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 15, right: 15 },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Carbon impact
  y = addSectionTitle(doc, y, 'Environmental Impact');
  y = addKeyValue(doc, y, 'CO₂ Saved:', `${data.co2Saved || '1,704'} kg`);
  y = addKeyValue(doc, y, 'Trees Equivalent:', `${data.trees || '81'} trees`);

  addFooter(doc, 1, 1);
  doc.save(`Solar_Bharat_Energy_${new Date().toISOString().split('T')[0]}.pdf`);
}
