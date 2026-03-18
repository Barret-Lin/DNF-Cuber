import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Youtube, ExternalLink, Shield, Plus, Trash2, X } from 'lucide-react';

interface Video {
  id: string;
  type: 'video' | 'short';
  title: string;
  start?: number;
  date: string;
}

const defaultVideos: Video[] = [
  { id: 'mF6F3Gzw_Q8', type: 'video', title: '賽程轉播', start: 65, date: '2024-01-01T00:00:00.000Z' },
  { id: '2eGlXar9B_o', type: 'short', title: 'Shorts 1', date: '2024-01-02T00:00:00.000Z' },
  { id: 'eGsepfDXkQo', type: 'short', title: 'Shorts 2', date: '2024-01-03T00:00:00.000Z' },
  { id: 'yEAgn3xYYeM', type: 'short', title: 'Shorts 3', date: '2024-01-04T00:00:00.000Z' },
  { id: '1tsjydjjolo', type: 'short', title: 'Shorts 4', date: '2024-01-05T00:00:00.000Z' },
  { id: 'HGj4ntqNJdQ', type: 'short', title: 'Shorts 5', date: '2024-01-06T00:00:00.000Z' },
  { id: 'orC81ipd0ts', type: 'short', title: 'Shorts 6', date: '2024-01-07T00:00:00.000Z' },
  { id: '125LuEnnIok', type: 'short', title: 'Shorts 7', date: '2024-01-08T00:00:00.000Z' },
];

export default function DNFCuberPage() {
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('dnf_videos');
    return saved ? JSON.parse(saved) : defaultVideos;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDate, setNewVideoDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('dnf_videos', JSON.stringify(videos));
  }, [videos]);

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

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl) return;

    let id = '';
    let type: 'video' | 'short' = 'video';
    let start: number | undefined = undefined;

    try {
      const urlObj = new URL(newVideoUrl);
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname.includes('/shorts/')) {
          id = urlObj.pathname.split('/shorts/')[1].split('?')[0];
          type = 'short';
        } else {
          id = urlObj.searchParams.get('v') || '';
          const t = urlObj.searchParams.get('t');
          if (t) start = parseInt(t.replace('s', ''));
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        id = urlObj.pathname.slice(1).split('?')[0];
        const t = urlObj.searchParams.get('t');
        if (t) start = parseInt(t.replace('s', ''));
      }
    } catch (err) {
      // Fallback regex
      const match = newVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match) id = match[1];
      if (newVideoUrl.includes('shorts')) type = 'short';
    }

    if (!id) {
      alert('無法解析 YouTube 網址，請確認格式');
      return;
    }

    const newVideo: Video = {
      id,
      type,
      title: newVideoTitle || (type === 'short' ? 'New Short' : 'New Video'),
      date: new Date(newVideoDate).toISOString(),
      ...(start && { start })
    };

    setVideos(prev => [...prev, newVideo].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleDelete = (idToDelete: string) => {
    if (window.confirm('確定要刪除這部影片嗎？')) {
      setVideos(videos.filter(v => v.id !== idToDelete));
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-red-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8 md:mb-12 relative">
        <button 
          onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
          className="absolute right-0 top-0 p-2 text-slate-500 hover:text-red-400 transition-colors"
          title={isAdmin ? "登出管理者" : "管理者登入"}
        >
          <Shield className="w-5 h-5" />
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center justify-center gap-3">
          <Youtube className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
          DNF Cuber
        </h1>
        <p className="text-base md:text-lg text-slate-400">
          賽程轉播與精彩短影音
        </p>
        <a 
          href="https://www.youtube.com/@%E6%9E%97%E5%B1%95%E9%82%91-f6x" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors font-medium"
        >
          前往 YouTube 頻道 <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

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
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500/50"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
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
          className="bg-slate-900/80 p-6 rounded-2xl border border-red-500/30 shadow-lg mb-8"
        >
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" /> 新增影片
          </h3>
          <form onSubmit={handleAddVideo} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="YouTube 網址 (支援一般影片或 Shorts)"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500/50"
              required
            />
            <input
              type="text"
              placeholder="影片標題 (選填)"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              className="w-full md:w-48 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500/50"
            />
            <input
              type="date"
              value={newVideoDate}
              onChange={(e) => setNewVideoDate(e.target.value)}
              className="w-full md:w-40 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-red-500/50"
              required
            />
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 font-medium transition-colors whitespace-nowrap"
            >
              新增
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Main Video */}
        {[...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).filter(v => v.type === 'video').map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden p-2 md:p-4 relative group"
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(video.id)}
                className="absolute top-6 right-6 z-10 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="刪除影片"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}${video.start ? `?start=${video.start}` : ''}`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        ))}

        {/* Shorts */}
        {[...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).filter(v => v.type === 'short').map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden flex justify-center p-2 relative group"
          >
            {isAdmin && (
              <button
                onClick={() => handleDelete(video.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="刪除影片"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
