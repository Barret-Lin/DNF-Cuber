import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Video, Image as ImageIcon, Plus, Trash2, Shield, X, AlertCircle, HardDrive } from 'lucide-react';

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
  const [storageUsed, setStorageUsed] = useState(0);
  const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB limit

  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateStorage = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          total += item.length * 2; // roughly 2 bytes per char
        }
      }
    }
    setStorageUsed(total);
  };

  useEffect(() => {
    try {
      localStorage.setItem('live_highlights', JSON.stringify(items));
      calculateStorage();
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setWarningMessage('儲存空間已滿！無法儲存更多圖片或影片。請刪除一些舊項目。');
        calculateStorage();
        // Revert to previous state if possible, or just let the user know
      } else {
        console.error('Failed to save highlights:', e);
      }
    }
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

    if (isVideo) {
      if (file.size <= 1024 * 1024) {
        // Already under 1MB, just read and save
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addItem(event.target.result as string, 'video');
          }
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Compress video if > 1MB
      setWarningMessage('影片較大，正在進行壓縮處理 (降低解析度與影格率)...');
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        video.play().then(() => {
          const canvas = document.createElement('canvas');
          // Limit resolution to 480p max
          const MAX_WIDTH = 480;
          let width = video.videoWidth;
          let height = video.videoHeight;
          if (width > MAX_WIDTH) {
            height = Math.floor(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Limit framerate to 15fps
          const stream = canvas.captureStream(15);
          // Use a low bitrate to ensure small file size
          const recorder = new MediaRecorder(stream, { 
            mimeType: 'video/webm;codecs=vp8',
            videoBitsPerSecond: 250000 
          });
          const chunks: Blob[] = [];

          recorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            if (blob.size > 1024 * 1024) {
              setWarningMessage('壓縮後影片仍超過 1MB，請上傳更短的影片或改用 YouTube 連結。');
            } else {
              const reader = new FileReader();
              reader.onloadend = () => {
                addItem(reader.result as string, 'video');
                setWarningMessage('');
              };
              reader.readAsDataURL(blob);
            }
            URL.revokeObjectURL(video.src);
          };

          recorder.start();

          const drawFrame = () => {
            if (video.paused || video.ended) {
              recorder.stop();
              return;
            }
            ctx?.drawImage(video, 0, 0, width, height);
            requestAnimationFrame(drawFrame);
          };
          drawFrame();
        }).catch(err => {
          console.error('Video playback failed for compression:', err);
          setWarningMessage('影片壓縮失敗，請上傳小於 1MB 的影片。');
        });
      };
      
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // 限制最大解析度，約等同於 400 dpi 的網頁顯示需求 (最大邊長 1200px)
          const MAX_DIMENSION = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // 壓縮為 JPEG，品質 0.7
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          addItem(compressedDataUrl, 'image');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold text-purple-400 flex items-center m-0">
              <Plus className="w-5 h-5 mr-2" /> 新增花絮
            </h3>
            
            <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
              <HardDrive className="w-4 h-4 text-slate-400" />
              <div className="flex-1 min-w-[120px]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">儲存空間使用量</span>
                  <span className={`${storageUsed > STORAGE_LIMIT * 0.9 ? 'text-red-400' : 'text-slate-300'}`}>
                    {(storageUsed / (1024 * 1024)).toFixed(2)} / {(STORAGE_LIMIT / (1024 * 1024)).toFixed(0)} MB
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${storageUsed > STORAGE_LIMIT * 0.9 ? 'bg-red-500' : 'bg-purple-500'}`}
                    style={{ width: `${Math.min(100, (storageUsed / STORAGE_LIMIT) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
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
