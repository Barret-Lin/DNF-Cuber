import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Send, Loader2, Sparkles, Video, Link as LinkIcon, X, FileVideo, Key, Database, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { qaDatabase } from '../data/qaDatabase';

const BUILT_IN_KEYS = [
  'AIzaSyA0DQpsDGZAPgyPooqYcOC4lKbWBefBO70',
  'AIzaSyDTF2hcOOXHR2vLGlgmWmQBc9BMe9p3bSY',
  'AIzaSyAC1pRRkWxoVant1Yn1yyfg5qaX8OQZ5x8',
  'AIzaSyAgh2fSZsyATHZg5mkikAB5d3ZsNaeibo8',
  'AIzaSyDNnMnress1mTo4Vk2cLHdIGB7Ja2GQNGI',
  'AIzaSyBdilcrOcfZCfJb0-eji_RYZfS9xveMuKA'
];

export default function AISolverPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  
  const defaultApiKey = BUILT_IN_KEYS[0];
  
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [keyVerificationStatus, setKeyVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [keyErrorMessage, setKeyErrorMessage] = useState('');
  const [currentModel, setCurrentModel] = useState('gemini-2.5-flash');
  const [quotaTier, setQuotaTier] = useState('Free Tier (系統內建)');
  
  const [selectedQA, setSelectedQA] = useState<{question: string, answer: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!apiKey) {
      setQuotaTier('未設定');
    } else if (BUILT_IN_KEYS.includes(apiKey)) {
      const idx = BUILT_IN_KEYS.indexOf(apiKey) + 1;
      setQuotaTier(`Free Tier (系統內建 ${idx}/${BUILT_IN_KEYS.length})`);
    } else {
      setQuotaTier('自訂金鑰 (Paid / Free)');
    }
  }, [apiKey]);

  const handleAskAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !videoFile && !youtubeLink) return;

    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const parts: any[] = [];
      
      let promptText = `你是一位世界頂尖的魔術方塊教練與演算法專家。
請根據以下使用者的問題或提供的影片，提供創新、最佳、最快速的魔方復原策略或改善建議。
請用繁體中文回答，並使用 Markdown 格式排版，讓步驟清晰易讀。

使用者的問題：${query || '請分析這段影片並給予改善建議'}`;

      if (youtubeLink) {
        promptText += `\n\n影片連結：${youtubeLink}`;
      }
      
      parts.push({ text: promptText });

      if (videoFile) {
        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(videoFile);
        });
        
        parts.push({
          inlineData: {
            mimeType: videoFile.type,
            data: base64Data
          }
        });
      }

      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.1-pro-preview', 'gemini-3-flash-preview'];
      let success = false;
      let lastErrorMsg = '';

      const isCustomKey = !BUILT_IN_KEYS.includes(apiKey);
      let currentKeyIdx = BUILT_IN_KEYS.indexOf(apiKey);
      if (currentKeyIdx === -1) currentKeyIdx = 0;
      
      const keysToTry = isCustomKey 
        ? [apiKey] 
        : [...BUILT_IN_KEYS.slice(currentKeyIdx), ...BUILT_IN_KEYS.slice(0, currentKeyIdx)];

      for (const model of modelsToTry) {
        setCurrentModel(model);
        
        for (const keyToTry of keysToTry) {
          try {
            const ai = new GoogleGenAI({ apiKey: keyToTry });
            
            const result = await ai.models.generateContent({
              model: model,
              contents: { parts },
              config: {
                tools: youtubeLink ? [{ googleSearch: {} }] : undefined
              }
            });

            setResponse(result.text || '無法生成回應。');
            if (apiKey !== keyToTry) {
              setApiKey(keyToTry); // Update active key if we rotated
            }
            success = true;
            break; // Break key loop
          } catch (err: any) {
            const msg = err.message || String(err);
            console.warn(`Model ${model} with key ...${keyToTry.slice(-4)} failed:`, msg);
            
            const isQuotaError = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
            const isAuthError = msg.includes('API key not valid') || msg.includes('403') || msg.includes('API_KEY_INVALID');

            if (isQuotaError || (!isCustomKey && isAuthError)) {
              lastErrorMsg = msg;
              continue; // Try next key
            } else {
              throw err; // Throw immediately for custom key 403 or other errors
            }
          }
        }
        if (success) break; // Break model loop
      }

      if (!success) {
        throw new Error(lastErrorMsg || '所有模型與金鑰均請求失敗，請稍後再試。');
      }

    } catch (err: any) {
      console.error('AI Error:', err);
      const msg = err.message || String(err);
      
      const isQuotaError = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
      const isAuthError = msg.includes('API key not valid') || msg.includes('403') || msg.includes('API_KEY_INVALID');

      if (isQuotaError || isAuthError) {
        const isCustomKey = !BUILT_IN_KEYS.includes(apiKey);
        if (!isCustomKey) {
          setError('所有內建 API Key 均已失效或達上限。請輸入您自己的 API Key 或稍後再試。');
          setKeyErrorMessage('所有內建 API Key 均已耗盡或失效，請輸入新的 API Key。');
        } else {
          if (isAuthError) {
            setError('API Key 無效或無權限，請重新輸入。');
            setKeyErrorMessage('目前的 API Key 無效或無權限，請重新輸入。');
          } else {
            setError('API 請求次數已達上限 (Quota Exceeded)。已嘗試降級模型但仍失敗，請輸入付費 API Key 或稍後再試。');
            setKeyErrorMessage('目前的 API Key 請求次數已達上限，請輸入新的 API Key。');
          }
        }
        setApiKey('');
        setKeyVerificationStatus('error');
        setShowApiKeyInput(true);
      } else {
        let cleanMsg = msg;
        try {
          const jsonMatch = msg.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.error && parsed.error.message) {
              cleanMsg = parsed.error.message;
            }
          }
        } catch (e) {}
        setError('發生錯誤：' + cleanMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyApiKey = async (keyToTest: string) => {
    if (!keyToTest.trim()) return false;
    setIsVerifyingKey(true);
    setKeyVerificationStatus('idle');
    setKeyErrorMessage('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: keyToTest });
      // Make a lightweight call to test the key
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hi',
      });
      setKeyVerificationStatus('success');
      return true;
    } catch (err: any) {
      console.error('API Key Verification Error:', err);
      setKeyVerificationStatus('error');
      const msg = err.message || String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        setKeyErrorMessage('API Key 請求次數已達上限 (Quota Exceeded)。');
      } else if (msg.includes('API key not valid') || msg.includes('403')) {
        setKeyErrorMessage('API Key 無效或無權限。');
      } else {
        setKeyErrorMessage('驗證失敗：' + msg);
      }
      return false;
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempApiKey.trim()) {
      const isValid = await verifyApiKey(tempApiKey.trim());
      if (isValid) {
        setApiKey(tempApiKey.trim());
        setShowApiKeyInput(false);
        setKeyVerificationStatus('idle');
        if (query.trim() || videoFile || youtubeLink) {
          setTimeout(() => {
            handleAskAI();
          }, 100);
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        alert('影片檔案過大，請上傳 50MB 以下的影片。');
        return;
      }
      setVideoFile(file);
      setYoutubeLink('');
      setShowYoutubeInput(false);
    }
  };

  const suggestedQueries = [
    "如何有效練習 3x3 的 Cross 盲解？",
    "高階魔方 (5x5-7x7) 的中心組裝有哪些進階技巧？",
    "單手解法 (OH) 中，如何克服左手小指無力的問題？",
    "盲解 (BLD) 記憶時容易把邊塊和角塊搞混怎麼辦？",
    "如何判斷 OLL 該用哪一種指法最順手？",
    "魔方保養：潤滑油的種類與正確使用方式？",
    "比賽時容易緊張手抖，有什麼心理調適的方法？",
    "如何利用節拍器 (Metronome) 來穩定轉速 (TPS)？",
    "Square-1 的 EP 階段有哪些必背的公式？",
    "多步預判 (Multi-slotting) 在實戰中的應用時機？"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 border border-slate-700 rounded-2xl mb-2 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <BrainCircuit className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">AI 智能解法創新</h1>
        <p className="text-lg text-slate-400">上傳解法影片或輸入問題，讓 AI 為您量身打造最佳復原策略</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50">
          <form onSubmit={handleAskAI} className="space-y-4">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="輸入您的魔方問題，或描述您上傳的影片內容..."
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-lg shadow-inner transition-all min-h-[120px] resize-y"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    videoFile 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {videoFile ? '已選擇影片' : '上傳影片'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowYoutubeInput(!showYoutubeInput);
                    if (!showYoutubeInput) {
                      setVideoFile(null);
                    }
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    youtubeLink || showYoutubeInput
                      ? 'bg-red-500/20 text-red-300 border-red-500/50' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {youtubeLink ? '已連結 YouTube' : 'YouTube 連結'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!query.trim() && !videoFile && !youtubeLink)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-cyan-500/20 font-medium"
              >
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin mr-2" /> 分析中...</>
                ) : (
                  <><Send className="h-5 w-5 mr-2" /> 開始分析</>
                )}
              </button>
            </div>

            {/* Model Status & API Key Button */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700 gap-4">
              <div className="flex flex-col gap-2 text-sm text-slate-300">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
                  <span>目前運行模型：<strong className="text-cyan-400">{currentModel}</strong></span>
                  {currentModel !== 'gemini-2.5-flash' && (
                    <button
                      type="button"
                      onClick={() => setCurrentModel('gemini-2.5-flash')}
                      className="ml-3 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-xs rounded transition-colors flex items-center"
                      title="重置為預設模型"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> 重置
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-amber-400 mr-2" />
                  <span>API Key 狀態：<strong className="text-amber-400">{quotaTier}</strong></span>
                </div>
                <div className="flex items-center">
                  <Key className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>當前使用金鑰：<strong className="text-emerald-400 font-mono">{apiKey ? `${apiKey.slice(0, 12)}...${apiKey.slice(-4)}` : '無'}</strong></span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyInput(true)}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center bg-slate-800 px-3 py-2 rounded-md border border-slate-700 hover:border-cyan-500/50 whitespace-nowrap"
              >
                <Key className="w-3 h-3 mr-1.5" />
                升級版本 / 自訂 API Key
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              系統會自動偵測 API 額度並降級運行。如需強制使用最高階模型，請點擊上方按鈕輸入您的付費帳號 API Key。
            </p>

            {/* Attachments Preview */}
            {(videoFile || showYoutubeInput || youtubeLink) && (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-3">
                {videoFile && (
                  <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center text-cyan-400">
                      <FileVideo className="w-5 h-5 mr-3" />
                      <span className="text-sm truncate max-w-[200px] sm:max-w-xs">{videoFile.name}</span>
                      <span className="text-xs text-slate-500 ml-3">({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setVideoFile(null)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {(showYoutubeInput || youtubeLink) && (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="貼上 YouTube 影片網址..."
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500/50 text-sm"
                      autoFocus={showYoutubeInput && !youtubeLink}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setYoutubeLink('');
                        setShowYoutubeInput(false);
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 bg-slate-800 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 py-1">常見問題：</span>
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
              <p className="font-mono text-sm">AI 正在分析您的問題與影片...</p>
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
                AI 最佳策略與改善建議
              </div>
              <div className="markdown-body text-slate-300 leading-relaxed">
                <Markdown>{response}</Markdown>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 py-12">
              <BrainCircuit className="h-16 w-16 opacity-20" />
              <p className="font-mono text-sm">上傳您的解法影片，讓 AI 幫您找出進步的關鍵</p>
            </div>
          )}
        </div>
      </div>

      {/* QA Database Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
          <Database className="w-6 h-6 mr-3 text-cyan-400" />
          AI 智能解法範本資料庫
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qaDatabase.map((qa, index) => (
            <button
              key={index}
              onClick={() => setSelectedQA(qa)}
              className="text-left p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-cyan-500/50 transition-all group shadow-sm hover:shadow-cyan-500/10"
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                  {index + 1}
                </span>
                <span className="text-slate-300 group-hover:text-cyan-300 transition-colors font-medium leading-relaxed">
                  {qa.question}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* QA Modal */}
      <AnimatePresence>
        {selectedQA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-start gap-4 bg-slate-950/50">
                <h3 className="text-xl font-bold text-cyan-400 leading-snug flex items-start">
                  <Sparkles className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                  {selectedQA.question}
                </h3>
                <button 
                  onClick={() => setSelectedQA(null)}
                  className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-900/50">
                <div className="prose prose-invert prose-cyan max-w-none markdown-body text-slate-300 leading-relaxed">
                  <Markdown>{selectedQA.answer}</Markdown>
                </div>
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
                <button
                  onClick={() => {
                    setQuery(selectedQA.question);
                    setSelectedQA(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition-colors text-sm font-medium border border-slate-700 hover:border-cyan-500/50 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  將此問題帶入輸入框
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center text-cyan-400 font-bold text-lg">
                  <Key className="w-5 h-5 mr-2" />
                  系統驗證：請輸入 Gemini API Key
                </div>
                <button 
                  onClick={() => setShowApiKeyInput(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-slate-400 text-sm leading-relaxed">
                  為了提供專屬的 AI 智能解法分析，請輸入您的 Gemini API Key。
                  <br /><br />
                  <span className="text-amber-400/90 font-medium">安全提示：</span>此金鑰僅會暫存於您當前的瀏覽器記憶體中，當您離開此頁面或重新整理時，系統將會立即清除內存，絕不保留您的 API Key。
                </p>
                <form onSubmit={handleApiKeySubmit} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => {
                        setTempApiKey(e.target.value);
                        setKeyVerificationStatus('idle');
                        setKeyErrorMessage('');
                      }}
                      placeholder="AIzaSy..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${keyVerificationStatus === 'error' ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : keyVerificationStatus === 'success' ? 'border-emerald-500 focus:ring-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:ring-cyan-500/50 focus:border-cyan-500'} text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all font-mono text-sm`}
                      autoFocus
                    />
                  </div>
                  
                  <AnimatePresence>
                    {keyVerificationStatus === 'error' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-sm flex items-center overflow-hidden">
                        <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        {keyErrorMessage || 'API Key 驗證失敗，請檢查後重新輸入。'}
                      </motion.div>
                    )}
                    {keyVerificationStatus === 'success' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-emerald-400 text-sm flex items-center overflow-hidden">
                        <CheckCircle2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        API Key 驗證成功！
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowApiKeyInput(false)}
                      className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm font-medium"
                      disabled={isVerifyingKey}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyApiKey(tempApiKey.trim())}
                      disabled={!tempApiKey.trim() || isVerifyingKey}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-slate-700 flex items-center"
                    >
                      {isVerifyingKey ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                      驗證 Key
                    </button>
                    <button
                      type="submit"
                      disabled={!tempApiKey.trim() || isVerifyingKey}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-cyan-500/20 flex items-center"
                    >
                      {isVerifyingKey ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                      確認並發送
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
