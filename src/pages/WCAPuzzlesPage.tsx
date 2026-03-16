import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowLeft, PlayCircle, Globe, Clock as ClockIcon, ChevronDown, ExternalLink } from 'lucide-react';

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
  { id: 'megaminx', name: 'Megaminx (五魔方)', category: '異形', desc: '十二個面的魔方，解法類似 3x3 的延伸。' },
  { id: 'pyraminx', name: 'Pyraminx (金字塔)', category: '異形', desc: '四面體結構，解法相對簡單直觀。' },
  { id: 'sq1', name: 'Square-1 (SQ1)', category: '異形', desc: '形狀會改變的魔方，需要先將其復原成正方體。' },
  { id: 'skewb', name: 'Skewb (斜轉)', category: '異形', desc: '沿著對角線旋轉的魔方，手感獨特。' },
];

const puzzleRecords: Record<string, any[]> = {
  '333': [{ type: '單次 (Single)', time: '3.13 秒', holder: 'Max Park', country: '美國', date: '2023-06-11', competition: 'Pride in Long Beach 2023', videoId: '7Ron6MN45LY' }],
  '222': [{ type: '單次 (Single)', time: '0.43 秒', holder: 'Teodor Zajder', country: '波蘭', date: '2023-11-05', competition: 'Warsaw Cube Masters 2023', videoId: '7Ron6MN45LY' }],
  '444': [{ type: '單次 (Single)', time: '15.71 秒', holder: 'Max Park', country: '美國', date: '2024-06-08', competition: 'Colorado Spring 2024', videoId: '7Ron6MN45LY' }],
  '555': [{ type: '單次 (Single)', time: '32.52 秒', holder: 'Max Park', country: '美國', date: '2024-03-16', competition: 'DFW Cubing Spring 2024', videoId: '7Ron6MN45LY' }],
  '666': [{ type: '單次 (Single)', time: '58.03 秒', holder: 'Max Park', country: '美國', date: '2024-08-03', competition: 'CubingUSA Nationals 2024', videoId: '7Ron6MN45LY' }],
  '777': [{ type: '單次 (Single)', time: '1:34.15', holder: 'Max Park', country: '美國', date: '2024-07-13', competition: 'Rubik\'s WCA North American Championship 2024', videoId: '7Ron6MN45LY' }],
  '333bf': [{ type: '單次 (Single)', time: '12.00 秒', holder: 'Tommy Cherry', country: '美國', date: '2024-02-11', competition: 'Triton Tricubealon 2024', videoId: '7Ron6MN45LY' }],
  '333fm': [{ type: '單次 (Single)', time: '16 步', holder: 'Sebastiano Tronto', country: '義大利', date: '2024-06-15', competition: 'FMC 2024', videoId: '7Ron6MN45LY' }],
  '333oh': [{ type: '單次 (Single)', time: '5.66 秒', holder: 'Dhruva Sai Meruva', country: '美國', date: '2024-08-03', competition: 'CubingUSA Nationals 2024', videoId: '7Ron6MN45LY' }],
  'clock': [{ type: '單次 (Single)', time: '1.97 秒', holder: 'Brendyn Cortina', country: '美國', date: '2024-08-01', competition: 'CubingUSA Nationals 2024', videoId: '7Ron6MN45LY' }],
  'megaminx': [{ type: '單次 (Single)', time: '23.18 秒', holder: 'Leandro Martín López', country: '阿根廷', date: '2024-04-13', competition: 'Di Tella Open 2024', videoId: '7Ron6MN45LY' }],
  'pyraminx': [{ type: '單次 (Single)', time: '0.73 秒', holder: 'Simon Kellum', country: '美國', date: '2023-12-21', competition: 'Middleton Meetup Winter 2023', videoId: '7Ron6MN45LY' }],
  'sq1': [{ type: '單次 (Single)', time: '3.41 秒', holder: 'Ryan Pilat', country: '美國', date: '2024-03-02', competition: 'Wichita Family ArtVenture 2024', videoId: '7Ron6MN45LY' }],
  'skewb': [{ type: '單次 (Single)', time: '0.75 秒', holder: 'Carter Kucala', country: '美國', date: '2024-03-23', competition: 'Going Fast in Grandview 2024', videoId: '7Ron6MN45LY' }],
  '444bf': [{ type: '單次 (Single)', time: '51.96 秒', holder: 'Stanley Chapel', country: '美國', date: '2023-01-28', competition: '4x4x4 Blindfolded 2023', videoId: '7Ron6MN45LY' }],
  '555bf': [{ type: '單次 (Single)', time: '2:21.62', holder: 'Stanley Chapel', country: '美國', date: '2019-12-15', competition: 'Michigan Cubing Club Epsilon 2019', videoId: '7Ron6MN45LY' }],
  '333mbf': [{ type: '單次 (Single)', time: '62/65 57:47', holder: 'Graham Siggins', country: '美國', date: '2022-06-26', competition: 'Blind Drive Spring 2022', videoId: '7Ron6MN45LY' }],
};

const categories = ['全部', 'NxNxN', '盲解', '特殊', '異形', '其他'];

export default function WCAPuzzlesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('全部');

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
            <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">WCA 認證比賽項目 (17項)</h1>
              <p className="text-base md:text-lg text-slate-400">世界魔方協會 (WCA) 認可的 17 項官方賽事</p>
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
                  <div className="bg-slate-950/50 px-5 md:px-6 py-3 md:py-4 border-t border-slate-800">
                    <a 
                      href={`https://www.youtube.com/watch?v=${record.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center transition-colors"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" /> 觀看賽事影片 <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
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
