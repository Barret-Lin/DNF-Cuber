import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Globe, Clock, PlayCircle, ChevronDown, ExternalLink, RefreshCw } from 'lucide-react';

const initialRecords = [
  { id: '333', event: '3x3x3 Cube', category: 'NxNxN', time: '2.76 秒', holder: 'Teodor Zajder', country: '波蘭', date: '2026-02-08', competition: 'GLS Big Cubes Gdańsk 2026', videoId: '', rawTime: 276 },
  { id: '222', event: '2x2x2 Cube', category: 'NxNxN', time: '0.39 秒', holder: 'Ziyu Ye', country: '中國', date: '2025-10-25', competition: 'Hefei Open 2025', videoId: '', rawTime: 39 },
  { id: '444', event: '4x4x4 Cube', category: 'NxNxN', time: '15.18 秒', holder: 'Tymon Kolasiński', country: '波蘭', date: '2025-12-08', competition: 'Spanish Championship 2025', videoId: '', rawTime: 1518 },
  { id: '555', event: '5x5x5 Cube', category: 'NxNxN', time: '30.45 秒', holder: 'Tymon Kolasiński', country: '波蘭', date: '2024-11-04', competition: 'Rubik\'s WCA Asian Championship 2024', videoId: '', rawTime: 3045 },
  { id: '666', event: '6x6x6 Cube', category: 'NxNxN', time: '57.69 秒', holder: 'Max Park', country: '美國', date: '2025-04-26', competition: 'Burbank Big Cubes 2025', videoId: '', rawTime: 5769 },
  { id: '777', event: '7x7x7 Cube', category: 'NxNxN', time: '1:33.48', holder: 'Max Park', country: '美國', date: '2025-10-04', competition: 'Nub Open Trabuco Hills Fall 2025', videoId: '', rawTime: 9348 },
  { id: '333bf', event: '3x3x3 Blindfolded', category: '盲解', time: '11.67 秒', holder: 'Charlie Eggins', country: '澳洲', date: '2026-01-11', competition: 'Cubing at The Cube 2026', videoId: '', rawTime: 1167 },
  { id: '444bf', event: '4x4x4 Blindfolded', category: '盲解', time: '51.96 秒', holder: 'Stanley Chapel', country: '美國', date: '2023-01-28', competition: '4BLD in a Madison Hall 2023', videoId: '', rawTime: 5196 },
  { id: '555bf', event: '5x5x5 Blindfolded', category: '盲解', time: '1:58.59', holder: 'Stanley Chapel', country: '美國', date: '2026-01-04', competition: 'Multi Mayhem VA 2026', videoId: '', rawTime: 11859 },
  { id: '333mbf', event: '3x3x3 Multi-Blind', category: '盲解', time: '63/65 58:23', holder: 'Graham Siggins', country: '美國', date: '2025-10-18', competition: 'Please Be Quiet Reno 2025', videoId: '', rawTime: 380350302 },
  { id: '333fm', event: '3x3x3 Fewest Moves', category: '特殊', time: '16 步', holder: 'Sebastiano Tronto 等', country: '多國', date: '2019-2024', competition: '多場賽事', videoId: '', rawTime: 16 },
  { id: '333oh', event: '3x3x3 One-Handed', category: '特殊', time: '5.66 秒', holder: 'Dhruva Sai Meruva', country: '瑞士', date: '2024-10-06', competition: 'Swiss Nationals 2024', videoId: '', rawTime: 566 },
  { id: 'clock', event: 'Clock', category: '其他', time: '1.53 秒', holder: 'Lachlan Gibson', country: '紐西蘭', date: '2025-09-27', competition: 'Hasty Hastings 2025', videoId: '', rawTime: 153 },
  { id: 'minx', event: 'Megaminx', category: '異形', time: '21.99 秒', holder: 'Timofei Tarasenko', country: '俄羅斯', date: '2025-12-07', competition: 'Tashkent Open 2025', videoId: '', rawTime: 2199 },
  { id: 'pyram', event: 'Pyraminx', category: '異形', time: '0.73 秒', holder: 'Simon Kellum', country: '美國', date: '2023-12-21', competition: 'Middleton Meetup Thursday 2023', videoId: '', rawTime: 73 },
  { id: 'sq1', event: 'Square-1', category: '異形', time: '3.40 秒', holder: 'Hassan Khanani', country: '美國', date: '2026-01-24', competition: 'Steel City Sprint PA 2026', videoId: '', rawTime: 340 },
  { id: 'skewb', event: 'Skewb', category: '異形', time: '0.73 秒', holder: 'Vojtěch Grohmann', country: '捷克', date: '2026-03-08', competition: 'Głuszyca Open 2026', videoId: '', rawTime: 73 },
];

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

export default function WorldRecordsPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [records, setRecords] = useState(initialRecords);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLatestRecords = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://www.worldcubeassociation.org/api/v0/records');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      const worldRecords = data.world_records;

      setRecords(prevRecords => prevRecords.map(record => {
        const apiRecord = worldRecords[record.id];
        if (apiRecord && apiRecord.single && apiRecord.single !== record.rawTime) {
          // Record has been broken!
          return {
            ...record,
            time: formatWcaTime(record.id, apiRecord.single),
            rawTime: apiRecord.single,
            holder: '新紀錄保持人 (請見 WCA 官網)',
            country: '未知',
            date: '最新紀錄',
            competition: '最新賽事',
            videoId: '' // Clear video ID as it's outdated
          };
        }
        return record;
      }));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching latest records:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Try to load cached records from sessionStorage
    const cachedRecords = sessionStorage.getItem('wca_world_records');
    const cachedTime = sessionStorage.getItem('wca_world_records_time');
    
    if (cachedRecords && cachedTime) {
      setRecords(JSON.parse(cachedRecords));
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
    if (records !== initialRecords) {
      try {
        sessionStorage.setItem('wca_world_records', JSON.stringify(records));
        if (lastUpdated) {
          sessionStorage.setItem('wca_world_records_time', lastUpdated.toISOString());
        }
      } catch (e) { console.warn('Failed to cache world records', e); }
    }
  }, [records, lastUpdated]);

  const filteredRecords = useMemo(() => {
    if (activeCategory === '全部') return records;
    return records.filter(r => r.category === activeCategory);
  }, [activeCategory, records]);

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <Helmet>
        <title>WCA 魔術方塊世界紀錄總覽 | 最新速解紀錄與影片</title>
        <meta name="description" content="查詢最新 WCA 魔術方塊世界紀錄。包含 3x3、4x4、盲解等 17 項官方賽事單次紀錄，並提供破紀錄當下的精準 YouTube 影片搜尋連結。" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "WCA 魔術方塊世界紀錄",
            "description": "最新 WCA 魔術方塊世界紀錄總覽，包含 3x3、4x4、盲解等 17 項官方賽事單次紀錄。",
            "url": "https://dnfcuber.com/records",
            "creator": {
              "@type": "Organization",
              "name": "World Cube Association"
            }
          })}
        </script>
      </Helmet>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-[100px] md:blur-[150px] -z-10"></div>
      
      <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">世界紀錄</h1>
        <p className="text-base md:text-lg text-slate-400">見證人類突破極限的歷史時刻 (WCA 17項單次紀錄)</p>
        
        <div className="absolute top-0 right-0 flex flex-col items-end">
          <button
            onClick={fetchLatestRecords}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>手動更新</span>
          </button>
          {lastUpdated && (
            <span className="text-xs text-slate-500 mt-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden flex flex-col hover:border-cyan-500/30 transition-colors"
          >
            <div className="p-5 md:p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-100">{record.event}</h3>
                <div className="flex items-center text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full text-xs font-bold font-mono whitespace-nowrap ml-2">
                  <Trophy className="w-3 h-3 mr-1" />
                  WR
                </div>
              </div>
              
              <div className="text-3xl md:text-4xl font-mono font-black text-cyan-400 mb-6 tracking-tighter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                {record.time}
              </div>
              
              <div className="space-y-2 md:space-y-3 text-sm text-slate-400">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0" />
                  <span className="font-medium text-slate-200 mr-1">{record.holder}</span> 
                  <span className="truncate">({record.country})</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
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
                  <PlayCircle className="w-4 h-4 mr-2" /> 觀看破紀錄影片 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                </a>
              ) : (
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${record.holder} ${record.event} ${record.time.replace(/[秒步]/g, '').trim()} World Record`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center transition-colors"
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> 搜尋破紀錄影片 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                </a>
              )}
              <a 
                href={`https://www.worldcubeassociation.org/results/records?event=${record.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-300 font-medium text-xs flex items-center transition-colors"
              >
                <Globe className="w-3 h-3 mr-1" /> WCA 官網 <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
