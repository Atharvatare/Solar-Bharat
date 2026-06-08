import { GoogleGenAI } from '@google/genai';
import logger from '../utils/logger.js';

const ai = new GoogleGenAI({});

// ── System prompt for the Solar Bharat AI Assistant ──────────────────────────
const SYSTEM_PROMPT = `You are Solar Bharat AI Assistant — India's expert on solar energy. You help users with:
- Government subsidies (PM Surya Ghar Muft Bijli Yojana)
- Solar system sizing, cost, and ROI
- Net metering and grid export
- Panel maintenance and cleaning
- Rooftop analysis guidance
- Installation process and timeline
- Environmental impact

Always respond in a helpful, conversational tone. Use **bold** for important points.
Keep responses concise (2-3 paragraphs max).
If unsure, say so honestly.
Always relate answers to the Indian context.`;

// ── Knowledge base for fallback responses ────────────────────────────────────
const KNOWLEDGE_BASE = {
  subsidy: {
    keywords: ['subsidy', 'scheme', 'eligible', 'government', 'pm surya', 'surya ghar', 'incentive', 'rebate'],
    response: `Under the **PM Surya Ghar Muft Bijli Yojana**, you can get subsidies:\n\n• **Up to 3kW**: ₹30,000/kW (max ₹90,000)\n• **3kW to 10kW**: ₹18,000/kW for additional capacity\n• **Above 10kW**: No additional subsidy\n\nFor a typical 5kW system, the subsidy is approximately ₹1,26,000. Applications are made through the official PM Surya Ghar portal.`,
  },
  savings: {
    keywords: ['save', 'saving', 'cost', 'money', 'bill', 'reduce', 'roi', 'payback', 'return', 'investment'],
    response: `A typical **5kW residential solar system** in India can save you:\n\n• **Monthly Savings**: ₹3,000 – ₹5,000\n• **Annual Savings**: ₹36,000 – ₹60,000\n• **25-Year Savings**: ₹12 – ₹15 lakhs\n• **Payback Period**: 3-4 years (after subsidies)\n\nThe actual savings depend on your location, consumption pattern, and electricity tariff.`,
  },
  maintenance: {
    keywords: ['maintenance', 'clean', 'cleaning', 'wash', 'panel care', 'dust', 'repair'],
    response: `Solar panel maintenance is simple:\n\n• **Cleaning**: Every 2-3 weeks with water and soft cloth\n• **Inspection**: Annual professional check recommended\n• **Monsoon**: Rain naturally cleans panels\n• **Inverter**: Check indicator lights monthly\n• **Wiring**: Annual inspection for wear\n\n**Pro tip**: Clean panels early morning or late evening to avoid thermal shock.`,
  },
  net_metering: {
    keywords: ['net meter', 'metering', 'export', 'grid', 'feed-in', 'surplus', 'sell'],
    response: `**Net metering** lets you export excess solar energy to the grid:\n\n• Your meter runs backward when exporting\n• You earn credits on your electricity bill\n• Settlement is typically annual\n• Most Indian states support net metering\n• Maximum allowed: up to sanctioned load\n\nContact your local **DISCOM** (Distribution Company) to apply.`,
  },
  installation: {
    keywords: ['install', 'installation', 'setup', 'rooftop', 'time', 'how long', 'process', 'step'],
    response: `The solar installation process:\n\n1. **Site Survey** (Day 1): Roof assessment & shading analysis\n2. **Design** (Day 2-3): System design & permits\n3. **Procurement** (Day 4-7): Equipment ordering\n4. **Installation** (Day 8-10): Mounting, wiring, inverter\n5. **Inspection** (Day 11-12): DISCOM inspection\n6. **Commissioning** (Day 13-14): Net meter installation & go-live\n\n**Total**: 2-3 weeks from start to finish.`,
  },
  types: {
    keywords: ['type', 'panel', 'monocrystalline', 'polycrystalline', 'thin film', 'which panel', 'best panel'],
    response: `Solar panel types comparison:\n\n| Type | Efficiency | Cost | Best For |\n|------|-----------|------|----------|\n| **Monocrystalline** | 20-22% | ₹₹₹ | Limited roof space |\n| **Polycrystalline** | 15-17% | ₹₹ | Budget-friendly |\n| **Thin Film** | 10-13% | ₹ | Large areas, flexible |\n\n**Recommendation**: Monocrystalline for residential rooftops (best efficiency/area ratio).`,
  },
  battery: {
    keywords: ['battery', 'storage', 'backup', 'power cut', 'blackout', 'off-grid'],
    response: `Solar battery storage options:\n\n• **Lithium-ion**: Most popular, 10-15 year lifespan, 90%+ efficiency\n• **Lead-acid**: Cheaper but shorter life (3-5 years)\n• **Capacity**: 5-10 kWh for typical homes\n• **Cost**: ₹50,000 – ₹2,00,000 depending on capacity\n\n**Note**: With net metering, batteries are optional. They're mainly useful for power backup during outages.`,
  },
  environment: {
    keywords: ['environment', 'carbon', 'co2', 'green', 'eco', 'pollution', 'climate', 'tree'],
    response: `Environmental impact of going solar:\n\n• **1 kW system** offsets ~1,500 kg CO₂/year\n• **5 kW system** = planting ~350 trees\n• **25-year lifetime**: 37.5 tonnes CO₂ offset\n• India receives **5,000 trillion kWh** solar energy/year\n• Solar is now **cheaper than coal** in India\n\nBy going solar, you directly contribute to India's goal of **500 GW renewable energy by 2030**.`,
  },
};

const DEFAULT_RESPONSE = `That's a great question about solar energy! India has enormous solar potential with over **300 sunny days** in most regions.\n\nI can help you with:\n• 📋 **Subsidies & Schemes** — Government incentives\n• 💰 **Cost & Savings** — Investment and ROI\n• 🔧 **Maintenance** — Panel care tips\n• 🏠 **Installation** — Process and timeline\n• ⚡ **Net Metering** — Sell excess power\n• 🌱 **Environmental Impact** — Carbon offset\n\nWhat would you like to know more about?`;

// ── Fallback: keyword-based response (used when Gemini is unavailable) ───────
const fallbackResponse = (userMessage) => {
  const lower = userMessage.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const [, data] of Object.entries(KNOWLEDGE_BASE)) {
    const score = data.keywords.reduce((sum, keyword) => {
      return sum + (lower.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = data;
    }
  }

  return bestScore > 0 ? bestMatch.response : DEFAULT_RESPONSE;
};

// ── Primary: Gemini AI response ──────────────────────────────────────────────

/**
 * Generate AI chat response using Google Gemini, with fallback to knowledge base.
 * @param {string} userMessage         The user's latest message
 * @param {Array}  conversationHistory  Previous messages (role + content)
 * @returns {Promise<string>} AI-generated response text
 */
export const generateResponse = async (userMessage, conversationHistory = []) => {
  // Build conversation context from last 6 messages
  const recentHistory = conversationHistory.slice(-6).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let response = null;

  for (const model of modelsToTry) {
    try {
      response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Understood! I am Solar Bharat AI Assistant, India\'s expert on solar energy. I\'m ready to help with subsidies, system sizing, net metering, maintenance, installation, and more. How can I assist you today?' }] },
          ...recentHistory,
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        config: { temperature: 0.7, maxOutputTokens: 1024 },
      });
      break; // success — stop trying models
    } catch (err) {
      logger.warn(`Chat AI model ${model} failed: ${err.message}`);
      // Retry with next model on 404 (model not found) or 503 (service unavailable)
      if (err.message.includes('404') || err.message.includes('503')) continue;
      throw err;
    }
  }

  if (!response) {
    logger.warn('All Gemini models failed — falling back to knowledge base');
    return fallbackResponse(userMessage);
  }

  return response.text;
};

/**
 * Generate a new session ID
 */
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Classify message topic
 */
export const classifyTopic = (message) => {
  const lower = message.toLowerCase();

  for (const [topic, data] of Object.entries(KNOWLEDGE_BASE)) {
    const hasMatch = data.keywords.some((kw) => lower.includes(kw));
    if (hasMatch) return topic;
  }

  return 'general';
};

export default {
  generateResponse,
  generateSessionId,
  classifyTopic,
};
