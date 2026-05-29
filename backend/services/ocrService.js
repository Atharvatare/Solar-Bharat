import { GoogleGenAI } from '@google/genai';
import config from '../config/config.js';
import logger from '../utils/logger.js';

// Initialize the Google Gemini SDK
// It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

/**
 * Converts a multer file buffer into the format required by the Gemini API
 */
function fileToGenerativePart(fileBuffer, mimeType) {
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType
    },
  };
}

/**
 * Extracts structured data from an electricity bill image using Gemini 1.5 Flash
 * @param {Buffer} fileBuffer - The image or PDF buffer
 * @param {string} mimeType - e.g., 'image/jpeg', 'application/pdf'
 * @returns {Promise<Object>} - Extracted JSON data
 */
export const extractBillData = async (fileBuffer, mimeType) => {
  try {
    const imagePart = fileToGenerativePart(fileBuffer, mimeType);

    const prompt = `
      You are an expert OCR AI specializing in Indian electricity bills (like MSEDCL, BESCOM, Adani Electricity, Tata Power, etc.).
      Analyze this electricity bill and extract the following information. 
      Respond ONLY with a valid JSON object. Do not include markdown formatting or backticks.
      
      Extract exactly these fields:
      - "units": The total electricity consumed in this billing cycle in kWh (number). Look for "Units Consumed", "Billed Units", or "Total Consumption".
      - "amount": The total bill amount payable in INR (number). Look for "Net Bill Amount", "Total Payable", or "Amount Due".
      - "billingCycle": The billing month and year (string, e.g., "May 2026").
      - "provider": The name of the electricity distribution company (string, e.g., "MSEDCL").
      - "consumerNumber": The consumer ID or account number (string).
      
      If you cannot confidently find a value, set it to null.
      
      JSON output format:
      {
        "units": 250,
        "amount": 1850,
        "billingCycle": "May 2026",
        "provider": "MSEDCL",
        "consumerNumber": "0123456789"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [prompt, imagePart],
      config: {
        temperature: 0.1, // Low temperature for high accuracy data extraction
      }
    });

    const responseText = response.text;
    
    // Clean up potential markdown formatting if the AI disobeys instructions
    const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
    
    const extractedData = JSON.parse(jsonString);
    
    logger.info(`✅ OCR Extraction successful: ${extractedData.units} units, ₹${extractedData.amount}`);
    
    return extractedData;

  } catch (error) {
    logger.error('❌ OCR Extraction failed:', error);
    throw new Error('Failed to analyze the electricity bill image. Please ensure the image is clear and readable.');
  }
};
