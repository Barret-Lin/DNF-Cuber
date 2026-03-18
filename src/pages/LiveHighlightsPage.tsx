import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Video, Image as ImageIcon, Plus, Trash2, Shield, X, AlertCircle } from 'lucide-react';

interface HighlightItem {
  id: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  date: string;
}

export default function LiveHighlightsPage() {
  const [items, setItems] = useState<HighlightItem[]>(() => {
    const saved = localStorage.getItem('live_highlights');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'youtube'>('image');
  const [warningMessage, setWarningMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('live_highlights', JSON.stringify(items));
  }, [items]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0818') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('密碼錯誤');
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl && newType === 'youtube') return;

    let finalUrl = newUrl;
    let finalType: 'image' | 'video' | 'youtube' = newType;

    if (newType === 'youtube') {
      let id = '';
      try {
        const urlObj = new URL(newUrl);
        if (urlObj.hostname.includes('youtube.com')) {
          id = urlObj.searchParams.get('v') || '';
        } else if (urlObj.hostname.includes('youtu.be')) {
          id = urlObj.pathname.slice(1).split('?')[0];
        }
      } catch (err) {
        const match = newUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
        if (match) id = match[1];
      }

      if (!id) {
        alert('無法解析 YouTube 網址，請確認格式');
        return;
      }
      finalUrl = id;
    }

    addItem(finalUrl, finalType);
    setNewUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('請上傳圖片或影片檔案');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addItem(event.target.result as string, isVideo ? 'video' : 'image');
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addItem = (url: string, type: 'image' | 'video' | 'youtube') => {
    const newItem: HighlightItem = {
      id: Date.now().toString(),
      type,
      url,
      date: new Date().toISOString(),
    };

    setItems(prev => {
      let nextItems = [newItem, ...prev];
      
      const videos = nextItems.filter(i => i.type === 'video' || i.type === 'youtube');
      const images = nextItems.filter(i => i.type === 'image');
      
      let message = '';
      
      if (videos.length > 3) {
        message += '影片數量超過 3 則限制，已自動刪除最舊的影片。';
        const videosToKeep = videos.slice(0, 3);
        nextItems = [...videosToKeep, ...images];
      }
      
      if (images.length > 20) {
        message += (message ? ' ' : '') + '圖片數量超過 20 張限制，已自動刪除最舊的圖片。';
        const imagesToKeep = images.slice(0, 20);
        nextItems = [...nextItems.filter(i => i.type === 'video' || i.type === 'youtube'), ...imagesToKeep];
      }

      if (message) {
        setWarningMessage(message);
        setTimeout(() => setWarningMessage(''), 5000);
      }

      return nextItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const handleDelete = (idToDelete: string) => {
    if (window.confirm('確定要刪除這個項目嗎？')) {
      setItems(items.filter(i => i.id !== idToDelete));
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8 md:mb-12 relative">
        <button 
          onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
          className="absolute right-0 top-0 p-2 text-slate-500 hover:text-purple-400 transition-colors"
          title={isAdmin ? "登出管理者" : "管理者登入"}
        >
          <Shield className="w-5 h-5" />
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center justify-center gap-3">
          <Video className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
          直播花絮
        </h1>
        <p className="text-base md:text-lg text-slate-400">
          精彩直播瞬間與幕後花絮
        </p>
      </div>

      {warningMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-900/20 border border-amber-500/50 text-amber-400 p-4 rounded-xl flex items-start"
        >
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{warningMessage}</p>
        </motion.div>
      )}

      {showLogin && !isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative"
        >
          <button 
            onClick={() => setShowLogin(false)}
            className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-slate-200 mb-4">管理者登入</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
            >
              登入
            </button>
          </form>
        </motion.div>
      )}

      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30 shadow-lg mb-8"
        >
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" /> 新增花絮
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">上傳圖片或影片 (最大 20 張圖片, 3 則影片)</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-500/10 file:text-purple-400
                  hover:file:bg-purple-500/20 cursor-pointer"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-slate-900/80 text-sm text-slate-500">或</span>
              </div>
            </div>

            <form onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-4">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'image' | 'youtube')}
                className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
              >
                <option value="youtube">YouTube 網址</option>
                <option value="image">圖片網址</option>
              </select>
              <input
                type="text"
                placeholder="輸入網址..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-purple-500/50"
                required
              />
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-medium transition-colors whitespace-nowrap"
              >
                新增
              </button>
            </form>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden relative group ${
              item.type === 'youtube' || item.type === 'video' ? 'col-span-1 sm:col-span-2' : 'col-span-1'
            }`}
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="刪除項目"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            {item.type === 'image' && (
              <div className="relative w-full aspect-square overflow-hidden">
                <img src={item.url} alt="Highlight" className="w-full h-full object-cover" />
              </div>
            )}
            
            {item.type === 'video' && (
              <div className="relative w-full aspect-video overflow-hidden bg-black">
                <video src={item.url} controls className="w-full h-full object-contain" />
              </div>
            )}

            {item.type === 'youtube' && (
              <div className="relative w-full aspect-video overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${item.url}`}
                  title="YouTube video player"
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-slate-300">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>目前還沒有直播花絮</p>
          </div>
        )}
      </div>
    </div>
  );
}
