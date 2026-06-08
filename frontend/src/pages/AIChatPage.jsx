import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePaperAirplane,
  HiOutlineCpuChip,
  HiOutlineUser,
  HiOutlineSparkles,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { chatAPI } from '../services/api';
import { useMediaQuery } from '../hooks/useMediaQuery';
import toast from 'react-hot-toast';

const topics = [
  { name: 'Subsidies', desc: 'Government incentives & schemes', prompt: 'What solar subsidies are available in India under PM Surya Ghar Yojana?' },
  { name: 'Net Metering', desc: 'Export energy to the grid', prompt: 'How does net metering work for rooftop solar in India?' },
  { name: 'Maintenance', desc: 'Panel care & cleaning', prompt: 'How should I maintain and clean my solar panels?' },
  { name: 'Cost & ROI', desc: 'Investment & returns', prompt: 'What is the cost and ROI of a 5kW solar system in India?' },
  { name: 'Installation', desc: 'Setup process & timeline', prompt: 'What is the step-by-step process to install rooftop solar?' },
  { name: 'Battery Storage', desc: 'Backup power options', prompt: 'Should I add battery storage to my solar system? What are the options?' },
];

const quickSuggestions = [
  'How much can I save with solar?',
  'What size solar system do I need?',
  'Are solar panels worth it in India?',
  'How to apply for solar subsidy?',
  'Explain my electricity bill',
  'Best solar panels for home?',
];

const solarFacts = [
  "India receives about 5,000 trillion kWh of solar energy per year!",
  "A single solar panel can offset ~1 ton of CO₂ over its lifetime.",
  "Solar panels can last 25-30 years with minimal maintenance.",
  "India's largest solar park is in Bhadla, Rajasthan — 2,245 MW capacity.",
  "Solar energy is now cheaper than coal power in India.",
  "PM Surya Ghar scheme offers up to ₹78,000 subsidy for 3kW systems.",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm **Solar Bharat AI Assistant** ☀️ — powered by Google Gemini AI.\n\nI can help you with:\n• 📋 Government subsidies & schemes\n• 💰 Solar cost, savings & ROI\n• 🔧 Panel maintenance tips\n• ⚡ Net metering & grid export\n• 🏠 Installation guidance\n• 🌱 Environmental impact\n\nAsk me anything about solar energy!",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [fact] = useState(solarFacts[Math.floor(Math.random() * solarFacts.length)]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: msgText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage(msgText, sessionId);
      const data = response.data.data;

      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Chat cleared! How can I help you today? ☀️",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }]);
    setSessionId(null);
    toast.success('Chat cleared');
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="glass p-4 rounded-2xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center">
              <HiOutlineCpuChip className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-navy-900 dark:text-white">Solar AI Assistant</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-navy-500 dark:text-navy-400">Powered by Google Gemini AI · Online</p>
            </div>
          </div>
          <button onClick={clearChat} className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors" title="Clear chat">
            <HiOutlineTrash className="w-5 h-5 text-navy-400" />
          </button>
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
                <p className={msg.role === 'assistant' ? 'text-navy-800 dark:text-navy-100 whitespace-pre-wrap' : 'whitespace-pre-wrap'}
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCpuChip className="w-4 h-4 text-white" />
                </div>
                <div className="glass px-5 py-4 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-2 h-2 bg-solar-500 rounded-full"
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
          {quickSuggestions.map((sug) => (
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
                  onClick={() => sendMessage(topic.prompt)}
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
