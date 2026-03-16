import { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Send, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

// Safely get API key for both AI Studio and Vercel/Vite environments
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
  } catch (e) {}
  
  try {
    if (import.meta.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {}
  
  return '';
};

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: getApiKey() || 'missing-api-key' });

export default function AISolverPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `你是一位世界頂尖的魔術方塊教練與演算法專家。
請根據以下使用者的問題，綜整世界紀錄保持人的解法（如 CFOP, Roux, Yau 等），提供創新、最佳、最快速的魔方復原策略或建議。
請用繁體中文回答，並使用 Markdown 格式排版，讓步驟清晰易讀。

使用者的問題：${query}`,
      });

      setResponse(result.text || '無法生成回應。');
    } catch (err: any) {
      console.error('AI Error:', err);
      setError('發生錯誤，請檢查您的 API Key 或稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQueries = [
    "如何突破 3x3 CFOP 15秒的瓶頸？",
    "請分析 Roux Method 在單手解法上的優勢。",
    "4x4 Yau Method 的邊塊組裝有什麼創新技巧？",
    "給初學者的盲解記憶法建議。",
    "如何優化 F2L 的觀察與預判 (Look-ahead)？",
    "Square-1 復原形狀 (Cube Shape) 的最佳學習路徑？",
    "五魔方 (Megaminx) S2L 階段如何減少找塊時間？",
    "3x3 最少步數 (FMC) 中 Domino Reduction 的核心概念是什麼？",
    "魔錶 (Clock) 7-Simul 技巧的原理與練習方法？",
    "金字塔 (Pyraminx) L4E 最佳化公式有哪些？"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 border border-slate-700 rounded-2xl mb-2 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <BrainCircuit className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">AI 智能解法創新</h1>
        <p className="text-lg text-slate-400">綜整頂尖選手智慧，為您量身打造最佳復原策略</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50">
          <form onSubmit={handleAskAI} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="輸入您的魔方問題，例如：如何優化 F2L 的觀察？"
              className="w-full pl-4 pr-12 py-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-lg shadow-inner transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 py-1">試試看：</span>
            {suggestedQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => setQuery(sq)}
                className="text-sm bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 min-h-[300px] bg-slate-900/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
              <p className="font-mono text-sm">AI 正在分析頂尖選手解法...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-12 font-mono">{error}</div>
          ) : response ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert prose-cyan max-w-none"
            >
              <div className="flex items-center text-cyan-400 mb-6 font-bold border-b border-slate-800 pb-4">
                <Sparkles className="h-5 w-5 mr-2" />
                AI 最佳策略建議
              </div>
              <div className="markdown-body text-slate-300 leading-relaxed">
                <Markdown>{response}</Markdown>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 py-12">
              <BrainCircuit className="h-16 w-16 opacity-20" />
              <p className="font-mono text-sm">輸入問題，讓 AI 為您解答魔方難題</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
