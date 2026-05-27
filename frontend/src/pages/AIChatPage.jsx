import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePaperAirplane,
  HiOutlineCpuChip,
  HiOutlineUser,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { sampleChatMessages, chatSuggestions } from '../utils/mockData';
import { useMediaQuery } from '../hooks/useMediaQuery';

const aiResponses = {
  subsidy: "Great question! Under the **PM Surya Ghar Muft Bijli Yojana**, you can get subsidies of up to ₹78,000 for a 3kW system. For systems above 3kW (up to 10kW), the subsidy is ₹78,000 + ₹30,000 per additional kW. The application process is online through the official portal. Would you like me to check your eligibility?",
  save: "A typical 5kW residential solar system in India can save you **₹3,000–₹5,000 per month** depending on your location and consumption. Over 25 years, that's approximately **₹12–15 lakhs** in total savings! The payback period is usually 3-4 years after subsidies.",
  panel: "Solar panel maintenance is straightforward! **Clean your panels every 2-3 weeks** with plain water and a soft cloth. Avoid harsh chemicals. During monsoon, rain does most of the cleaning. In dusty areas, more frequent cleaning may be needed. Annual professional inspection is recommended.",
  net: "**Net metering** allows you to export excess solar energy to the grid and earn credits on your bill. When your panels produce more than you consume, the surplus goes to the grid. Your meter runs backward, effectively reducing your bill. Most Indian states support net metering — check with your local DISCOM for specific policies.",
  default: "Solar energy is one of the fastest-growing sectors in India. With over **300 sunny days** in most regions, India has enormous solar potential. The government aims to achieve **500 GW of renewable energy by 2030**. Installing solar panels not only saves money but also contributes to a cleaner environment. What specific aspect would you like to know more about?"
};

const topics = [
  { name: 'Subsidies', desc: 'Government incentives & schemes' },
  { name: 'Net Metering', desc: 'Export energy to the grid' },
  { name: 'Maintenance', desc: 'Panel care & cleaning' },
  { name: 'Cost & Savings', desc: 'Investment & ROI details' },
  { name: 'Installation', desc: 'Setup process & timeline' },
  { name: 'Environment', desc: 'Carbon footprint reduction' },
];

const solarFacts = [
  "India receives about 5,000 trillion kWh of solar energy per year!",
  "A single solar panel can offset ~1 ton of CO₂ over its lifetime.",
  "Solar panels can last 25-30 years with minimal maintenance.",
  "India's largest solar park is in Bhadla, Rajasthan — 2,245 MW capacity.",
  "Solar energy is now cheaper than coal power in India.",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState(sampleChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [fact] = useState(solarFacts[Math.floor(Math.random() * solarFacts.length)]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const getAIResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('subsidy') || lower.includes('scheme') || lower.includes('eligible')) return aiResponses.subsidy;
    if (lower.includes('save') || lower.includes('saving') || lower.includes('cost') || lower.includes('money')) return aiResponses.save;
    if (lower.includes('panel') || lower.includes('clean') || lower.includes('maintenance')) return aiResponses.panel;
    if (lower.includes('net meter') || lower.includes('metering') || lower.includes('export')) return aiResponses.net;
    return aiResponses.default;
  };

  const sendMessage = (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: msgText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getAIResponse(msgText),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="glass p-4 rounded-2xl mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center">
            <HiOutlineCpuChip className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-navy-900 dark:text-white">Solar AI Assistant</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-navy-500 dark:text-navy-400">Powered by AI · Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-4 pr-1">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <HiOutlineCpuChip className="w-4 h-4 text-white" />
                </div>
              )}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <HiOutlineUser className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[75%] p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-solar-500 text-white rounded-2xl rounded-br-md'
                  : 'glass rounded-2xl rounded-bl-md'
              }`}>
                <p className={msg.role === 'assistant' ? 'text-navy-800 dark:text-navy-100' : ''}
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60' : 'text-navy-400 dark:text-navy-500'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCpuChip className="w-4 h-4 text-white" />
                </div>
                <div className="glass px-5 py-4 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-solar-500 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          {chatSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => sendMessage(sug)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                bg-solar-500/10 text-solar-600 dark:text-solar-400
                hover:bg-solar-500/20 border border-solar-500/20 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="glass p-3 rounded-2xl flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything about solar energy..."
            className="flex-1 bg-transparent border-none outline-none text-navy-900 dark:text-white placeholder:text-navy-400 text-sm px-2"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-solar-500 hover:bg-solar-600 disabled:opacity-50 
              flex items-center justify-center transition-colors"
          >
            <HiOutlinePaperAirplane className="w-5 h-5 text-white -rotate-45" />
          </button>
        </div>
      </div>

      {/* Info Panel (desktop only) */}
      {!isMobile && (
        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="glass p-5 rounded-2xl">
            <h3 className="text-sm font-semibold text-navy-900 dark:text-white mb-3">Quick Topics</h3>
            <div className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => sendMessage(`Tell me about ${topic.name.toLowerCase()}`)}
                  className="w-full text-left p-3 rounded-xl hover:bg-solar-500/10 transition-colors group"
                >
                  <p className="text-sm font-medium text-navy-800 dark:text-navy-200 group-hover:text-solar-500">{topic.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{topic.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineSparkles className="w-4 h-4 text-solar-500" />
              <h3 className="text-sm font-semibold text-navy-900 dark:text-white">Solar Fact</h3>
            </div>
            <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">{fact}</p>
          </div>
        </div>
      )}
    </div>
  );
}
