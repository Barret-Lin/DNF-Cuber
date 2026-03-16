import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Send, Loader2, Sparkles, Video, Link as LinkIcon, X, FileVideo, Key } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

export default function AISolverPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear API key on unmount (離開網頁後清除內存)
  useEffect(() => {
    return () => {
      setApiKey('');
      setTempApiKey('');
    };
  }, []);

  const handleAskAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !videoFile && !youtubeLink) return;

    if (!apiKey && !process.env.GEMINI_API_KEY) {
      setShowApiKeyInput(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });
      
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

      const result = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: { parts },
        config: {
          tools: youtubeLink ? [{ googleSearch: {} }] : undefined
        }
      });

      setResponse(result.text || '無法生成回應。');
    } catch (err: any) {
      console.error('AI Error:', err);
      setError('發生錯誤，請檢查您的 API Key 是否正確或稍後再試。' + (err.message || ''));
      if (err.message?.includes('API key not valid') || err.message?.includes('403')) {
        setApiKey('');
        setShowApiKeyInput(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      setShowApiKeyInput(false);
      if (query.trim() || videoFile || youtubeLink) {
        setTimeout(() => {
          handleAskAI();
        }, 100);
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
    "如何突破 3x3 CFOP 15秒的瓶頸？",
    "請分析 Roux Method 在單手解法上的優勢。",
    "4x4 Yau Method 的邊塊組裝有什麼創新技巧？",
    "給初學者的盲解記憶法建議。",
    "如何優化 F2L 的觀察與預判 (Look-ahead)？"
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
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowApiKeyInput(false)}
                      className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={!tempApiKey.trim()}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-cyan-500/20"
                    >
                      驗證並發送問題
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
