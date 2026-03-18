import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowLeft, PlayCircle, Globe, Clock as ClockIcon, ChevronDown, ExternalLink, RefreshCw } from 'lucide-react';

const puzzles = [
  { id: '333', name: '3x3x3 Cube', category: 'NxNxN', desc: '最經典的魔術方塊，所有速解的基礎。' },
  { id: '222', name: '2x2x2 Cube', category: 'NxNxN', desc: '沒有中心塊和邊塊，只有角塊的魔方。' },
  { id: '444', name: '4x4x4 Cube', category: 'NxNxN', desc: '偶數階魔方，需要處理中心塊和邊塊的組合。' },
  { id: '555', name: '5x5x5 Cube', category: 'NxNxN', desc: '高階魔方的入門，中心塊組合更為複雜。' },
  { id: '666', name: '6x6x6 Cube', category: 'NxNxN', desc: '大型偶數階魔方，考驗觀察力與穩定度。' },
  { id: '777', name: '7x7x7 Cube', category: 'NxNxN', desc: 'WCA 官方比賽中最高階的正階魔方。' },
  { id: '333bf', name: '3x3x3 Blindfolded', category: '盲解', desc: '記憶後遮住眼睛復原 3x3 魔方。' },
  { id: '444bf', name: '4x4x4 Blindfolded', category: '盲解', desc: '記憶後遮住眼睛復原 4x4 魔方。' },
  { id: '555bf', name: '5x5x5 Blindfolded', category: '盲解', desc: '記憶後遮住眼睛復原 5x5 魔方。' },
  { id: '333mbf', name: '3x3x3 Multi-Blind', category: '盲解', desc: '一次記憶並盲解多顆 3x3 魔方。' },
  { id: '333fm', name: '3x3x3 Fewest Moves', category: '特殊', desc: '在 1 小時內找出步數最少的解法。' },
  { id: '333oh', name: '3x3x3 One-Handed', category: '特殊', desc: '僅使用單手復原 3x3 魔方。' },
  { id: 'clock', name: 'Clock (魔錶)', category: '其他', desc: '雙面都有時鐘指針的益智玩具，非旋轉類。' },
  { id: 'minx', name: 'Megaminx (五魔方)', category: '異形', desc: '十二個面的魔方，解法類似 3x3 的延伸。' },
  { id: 'pyram', name: 'Pyraminx (金字塔)', category: '異形', desc: '四面體結構，解法相對簡單直觀。' },
  { id: 'sq1', name: 'Square-1 (SQ1)', category: '異形', desc: '形狀會改變的魔方，需要先將其復原成正方體。' },
  { id: 'skewb', name: 'Skewb (斜轉)', category: '異形', desc: '沿著對角線旋轉的魔方，手感獨特。' },
];

const initialPuzzleRecords: Record<string, any[]> = {
  '333': [{ type: '單次 (Single)', time: '2.76 秒', holder: 'Teodor Zajder', country: '波蘭', date: '2026-02-08', competition: 'GLS Big Cubes Gdańsk 2026', videoId: '', rawTime: 276 }],
  '222': [{ type: '單次 (Single)', time: '0.39 秒', holder: 'Ziyu Ye', country: '中國', date: '2025-10-25', competition: 'Hefei Open 2025', videoId: '', rawTime: 39 }],
  '444': [{ type: '單次 (Single)', time: '15.18 秒', holder: 'Tymon Kolasiński', country: '波蘭', date: '2025-12-08', competition: 'Spanish Championship 2025', videoId: '', rawTime: 1518 }],
  '555': [{ type: '單次 (Single)', time: '30.45 秒', holder: 'Tymon Kolasiński', country: '波蘭', date: '2024-11-04', competition: 'Rubik\'s WCA Asian Championship 2024', videoId: '', rawTime: 3045 }],
  '666': [{ type: '單次 (Single)', time: '57.69 秒', holder: 'Max Park', country: '美國', date: '2025-04-26', competition: 'Burbank Big Cubes 2025', videoId: '', rawTime: 5769 }],
  '777': [{ type: '單次 (Single)', time: '1:33.48', holder: 'Max Park', country: '美國', date: '2025-10-04', competition: 'Nub Open Trabuco Hills Fall 2025', videoId: '', rawTime: 9348 }],
  '333bf': [{ type: '單次 (Single)', time: '11.67 秒', holder: 'Charlie Eggins', country: '澳洲', date: '2026-01-11', competition: 'Cubing at The Cube 2026', videoId: '', rawTime: 1167 }],
  '333fm': [{ type: '單次 (Single)', time: '16 步', holder: 'Sebastiano Tronto 等', country: '多國', date: '2019-2024', competition: '多場賽事', videoId: '', rawTime: 16 }],
  '333oh': [{ type: '單次 (Single)', time: '5.66 秒', holder: 'Dhruva Sai Meruva', country: '瑞士', date: '2024-10-06', competition: 'Swiss Nationals 2024', videoId: '', rawTime: 566 }],
  'clock': [{ type: '單次 (Single)', time: '1.53 秒', holder: 'Lachlan Gibson', country: '紐西蘭', date: '2025-09-27', competition: 'Hasty Hastings 2025', videoId: '', rawTime: 153 }],
  'minx': [{ type: '單次 (Single)', time: '21.99 秒', holder: 'Timofei Tarasenko', country: '俄羅斯', date: '2025-12-07', competition: 'Tashkent Open 2025', videoId: '', rawTime: 2199 }],
  'pyram': [{ type: '單次 (Single)', time: '0.73 秒', holder: 'Simon Kellum', country: '美國', date: '2023-12-21', competition: 'Middleton Meetup Thursday 2023', videoId: '', rawTime: 73 }],
  'sq1': [{ type: '單次 (Single)', time: '3.40 秒', holder: 'Hassan Khanani', country: '美國', date: '2026-01-24', competition: 'Steel City Sprint PA 2026', videoId: '', rawTime: 340 }],
  'skewb': [{ type: '單次 (Single)', time: '0.73 秒', holder: 'Vojtěch Grohmann', country: '捷克', date: '2026-03-08', competition: 'Głuszyca Open 2026', videoId: '', rawTime: 73 }],
  '444bf': [{ type: '單次 (Single)', time: '51.96 秒', holder: 'Stanley Chapel', country: '美國', date: '2023-01-28', competition: '4BLD in a Madison Hall 2023', videoId: '', rawTime: 5196 }],
  '555bf': [{ type: '單次 (Single)', time: '1:58.59', holder: 'Stanley Chapel', country: '美國', date: '2026-01-04', competition: 'Multi Mayhem VA 2026', videoId: '', rawTime: 11859 }],
  '333mbf': [{ type: '單次 (Single)', time: '63/65 58:23', holder: 'Graham Siggins', country: '美國', date: '2025-10-18', competition: 'Please Be Quiet Reno 2025', videoId: '', rawTime: 380350302 }],
};

const categories = ['全部', 'NxNxN', '盲解', '特殊', '異形', '其他'];

function formatWcaTime(eventId: string, time: number): string {
  if (eventId === '333fm') {
    return `${time} 步`;
  }
  if (eventId === '333mbf') {
    const str = String(time).padStart(9, '0');
    const dd = parseInt(str.substring(0, 2), 10);
    const ttttt = parseInt(str.substring(2, 7), 10);
    const mm = parseInt(str.substring(7, 9), 10);
    
    const difference = 99 - dd;
    const solved = difference + mm;
    const attempted = solved + mm;
    
    const hours = Math.floor(ttttt / 3600);
    const minutes = Math.floor((ttttt % 3600) / 60);
    const seconds = ttttt % 60;
    
    let timeStr = '';
    if (hours > 0) {
      timeStr += `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      timeStr += `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${solved}/${attempted} ${timeStr}`;
  }
  
  const seconds = time / 100;
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2).padStart(5, '0');
    return `${mins}:${secs}`;
  }
  return `${seconds.toFixed(2)} 秒`;
}

export default function WCAPuzzlesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [puzzleRecords, setPuzzleRecords] = useState(initialPuzzleRecords);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLatestRecords = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://www.worldcubeassociation.org/api/v0/records');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      const worldRecords = data.world_records;

      setPuzzleRecords(prevRecords => {
        const newRecords = { ...prevRecords };
        Object.keys(newRecords).forEach(eventId => {
          const apiRecord = worldRecords[eventId];
          if (apiRecord && apiRecord.single) {
            const recordList = newRecords[eventId];
            if (recordList.length > 0 && recordList[0].rawTime !== apiRecord.single) {
              // Record has been broken!
              newRecords[eventId] = [{
                ...recordList[0],
                time: formatWcaTime(eventId, apiRecord.single),
                rawTime: apiRecord.single,
                holder: '新紀錄保持人 (請見 WCA 官網)',
                country: '未知',
                date: '最新紀錄',
                competition: '最新賽事',
                videoId: '' // Clear video ID as it's outdated
              }];
            }
          }
        });
        return newRecords;
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching latest records:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Try to load cached records from sessionStorage
    const cachedRecords = sessionStorage.getItem('wca_puzzle_records');
    const cachedTime = sessionStorage.getItem('wca_puzzle_records_time');
    
    if (cachedRecords && cachedTime) {
      setPuzzleRecords(JSON.parse(cachedRecords));
      setLastUpdated(new Date(cachedTime));
      // Fetch in background to ensure data is up-to-date
      fetchLatestRecords();
    } else {
      fetchLatestRecords();
    }

    // Auto-refresh data every 1 minute to ensure immediate synchronization
    const intervalId = setInterval(() => {
      fetchLatestRecords();
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Save to sessionStorage whenever records update
    if (puzzleRecords !== initialPuzzleRecords) {
      try {
        sessionStorage.setItem('wca_puzzle_records', JSON.stringify(puzzleRecords));
        if (lastUpdated) {
          sessionStorage.setItem('wca_puzzle_records_time', lastUpdated.toISOString());
        }
      } catch (e) { console.warn('Failed to cache puzzle records', e); }
    }
  }, [puzzleRecords, lastUpdated]);

  const filteredPuzzles = useMemo(() => {
    if (activeCategory === '全部') return puzzles;
    return puzzles.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const selectedPuzzle = puzzles.find(p => p.id === selectedId);
  const records = selectedId ? (puzzleRecords[selectedId] || []) : [];

  return (
    <div className="space-y-6 md:space-y-8">
      <AnimatePresence mode="wait">
        {!selectedId ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-10 relative">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">WCA 認證比賽項目 (17項)</h1>
              <p className="text-base md:text-lg text-slate-400">世界魔方協會 (WCA) 認可的 17 項官方賽事</p>
              
              <div className="absolute top-0 right-0 flex flex-col items-end">
                <button
                  onClick={fetchLatestRecords}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                  <span className="hidden sm:inline">手動更新</span>
                </button>
                {lastUpdated && (
                  <span className="text-xs text-slate-500 mt-2 hidden sm:block">
                    最後更新: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Category Filter Dropdown for Mobile, Buttons for Desktop */}
            <div className="mb-6 md:mb-8 flex justify-center">
              <div className="w-full md:w-auto relative">
                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="md:hidden w-full appearance-none bg-slate-900 border border-slate-700 text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                
                <div className="hidden md:flex space-x-2 bg-slate-900/50 p-1.5 rounded-full border border-slate-800">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === cat 
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredPuzzles.map((puzzle, index) => (
                <motion.div
                  key={puzzle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setSelectedId(puzzle.id)}
                  className="group cursor-pointer bg-slate-900/50 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{puzzle.name}</h3>
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/20 whitespace-nowrap ml-2">
                      {puzzle.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{puzzle.desc}</p>
                  <div className="text-cyan-500 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-2">
                    查看世界紀錄 <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button 
              onClick={() => setSelectedId(null)}
              className="mb-6 md:mb-8 flex items-center text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> 返回項目列表
            </button>
            
            <div className="mb-8 md:mb-10 bg-slate-900/30 p-6 md:p-8 rounded-3xl border border-slate-800/50">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-2 md:mb-0">{selectedPuzzle?.name}</h1>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm font-medium rounded-full border border-cyan-500/20 w-fit">
                  {selectedPuzzle?.category}
                </span>
              </div>
              <p className="text-lg md:text-xl text-slate-400">{selectedPuzzle?.desc}</p>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-6 flex items-center">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 mr-2 text-yellow-500" /> 世界紀錄保持人
            </h2>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {records.map((record, idx) => (
                <div key={idx} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                  <div className="p-5 md:p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-base md:text-lg font-bold text-slate-300">{record.type}</h3>
                      <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                        WR
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-cyan-400 mb-6 tracking-tight">
                      {record.time}
                    </div>
                    <div className="space-y-2 md:space-y-3 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0" />
                        <span className="font-medium text-slate-200 mr-1">{record.holder}</span> 
                        <span className="truncate">({record.country})</span>
                      </div>
                      <div className="flex items-start">
                        <ClockIcon className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{record.date} @ {record.competition}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 px-5 md:px-6 py-3 md:py-4 border-t border-slate-800 flex items-center justify-between">
                    {record.videoId ? (
                      <a 
                        href={`https://www.youtube.com/watch?v=${record.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" /> 觀看賽事影片 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                      </a>
                    ) : (
                      <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${record.holder} ${selectedPuzzle?.name} ${record.time.replace(/[秒步]/g, '').trim()} World Record`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" /> 搜尋賽事影片 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                      </a>
                    )}
                    <a 
                      href={`https://www.worldcubeassociation.org/results/records?event=${selectedId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-300 font-medium text-xs flex items-center transition-colors"
                    >
                      <Globe className="w-3 h-3 mr-1" /> WCA 官網 <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
