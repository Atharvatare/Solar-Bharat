import { GoogleGenAI } from '@google/genai';
import logger from '../utils/logger.js';

const ai = new GoogleGenAI({});

function fileToGenerativePart(fileBuffer, mimeType) {
  return {
    inlineData: {
      data: fileBuffer.toString('base64'),
      mimeType,
    },
  };
}

/**
 * AI Rooftop Analysis — Uses Gemini Vision to detect rooftop features from aerial images
 * @param {Buffer} fileBuffer - The aerial/satellite image buffer
 * @param {string} mimeType - e.g., 'image/jpeg'
 * @param {Object} location - { lat, lng, address }
 * @returns {Promise<Object>} - Structured rooftop analysis
 */
export const analyzeRooftopImage = async (fileBuffer, mimeType, location = {}) => {
  try {
    const imagePart = fileToGenerativePart(fileBuffer, mimeType);

    const prompt = `
      You are an expert AI solar engineer analyzing an aerial/satellite image of a rooftop in India.
      Location: ${location.address || 'India'} (Lat: ${location.lat || 'unknown'}, Lng: ${location.lng || 'unknown'})

      Analyze this rooftop image and provide a detailed solar installation assessment.
      Respond ONLY with a valid JSON object. Do not include markdown formatting or backticks.

      Extract and estimate these fields:
      - "totalRoofArea": Estimated total roof area in square feet (number)
      - "usableArea": Usable area for solar panels after excluding obstructions (number, sq ft)
      - "obstructions": Array of detected obstructions (e.g., ["water tank", "AC unit", "staircase housing"])
      - "roofType": Type of roof (e.g., "Flat RCC", "Sloped Tile", "Metal Sheet")
      - "roofOrientation": Primary orientation (e.g., "South-facing", "East-West", "North-South")
      - "orientationRating": Rating of orientation for solar (string: "Excellent", "Good", "Average", "Poor")
      - "shadowAnalysis": Object with:
        - "shadowPercentage": Estimated percentage of roof area affected by shadows (number)
        - "shadowSources": Array of shadow sources (e.g., ["neighboring building", "tree", "water tank"])
        - "peakSunHours": Estimated peak sun hours per day considering shadows (number)
      - "panelRecommendation": Object with:
        - "panelCount": Recommended number of standard 540W panels (number)
        - "systemSizeKw": Total system capacity in kW (number)
        - "tiltAngle": Recommended tilt angle in degrees (number)
        - "azimuthAngle": Recommended azimuth angle in degrees (number, 180 = due south)
        - "layout": Description of optimal panel arrangement (string)
      - "annualGeneration": Estimated annual energy generation in kWh (number)
      - "confidence": Your confidence in this analysis (number 0-100)
      
      If you cannot determine a value from the image, make a reasonable estimate based on typical Indian residential buildings and note lower confidence.

      JSON output:
      {
        "totalRoofArea": 600,
        "usableArea": 450,
        "obstructions": ["water tank", "staircase housing"],
        "roofType": "Flat RCC",
        "roofOrientation": "South-facing",
        "orientationRating": "Excellent",
        "shadowAnalysis": {
          "shadowPercentage": 12,
          "shadowSources": ["neighboring building"],
          "peakSunHours": 5.2
        },
        "panelRecommendation": {
          "panelCount": 12,
          "systemSizeKw": 6.5,
          "tiltAngle": 15,
          "azimuthAngle": 180,
          "layout": "4 rows of 3 panels facing south"
        },
        "annualGeneration": 9200,
        "confidence": 78
      }
    `;

    let response = null;
    let lastError = null;
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-2.5-pro'];

    for (const modelName of modelsToTry) {
      try {
        logger.info(`Rooftop AI: Attempting with model ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: [prompt, imagePart],
          config: { temperature: 0.1 },
        });
        break;
      } catch (err) {
        lastError = err;
        logger.warn(`Model ${modelName} failed: ${err.message}`);
        if (err.message.includes('404') || err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('NOT_FOUND')) {
          continue;
        }
        throw err;
      }
    }

    if (!response) {
      throw new Error(lastError ? lastError.message : 'All AI models unavailable. Try again later.');
    }

    const responseText = response.text;
    const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const analysisData = JSON.parse(jsonString);

    logger.info(`✅ Rooftop AI: ${analysisData.usableArea} sq ft usable, ${analysisData.panelRecommendation?.panelCount} panels`);

    return analysisData;
  } catch (error) {
    logger.error('❌ Rooftop AI failed:', error);
    throw new Error(`Rooftop AI Failed: ${error.message}`);
  }
};
