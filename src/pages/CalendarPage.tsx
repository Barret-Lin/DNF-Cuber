import { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, MapPin, ExternalLink, ArrowUpDown } from 'lucide-react';
import { ColoredCubeIcon } from '../components/ColoredCubeIcon';

const competitions = [
  { id: 1, name: 'Taiwan Championship 2026', date: '2026-08-14 ~ 08-16', location: '台北市, 台灣', events: '全項目 (17項)', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 2, name: 'Asian Championship 2026', date: '2026-11-05 ~ 11-08', location: '首爾, 韓國', events: '全項目 (17項)', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 3, name: 'Taichung Cube Open 2026', date: '2026-04-18 ~ 04-19', location: '台中市, 台灣', events: '3x3, 2x2, 4x4, 3x3OH, Pyraminx', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 4, name: 'Kaohsiung Summer 2026', date: '2026-07-25 ~ 07-26', location: '高雄市, 台灣', events: '3x3, 5x5, 6x6, 7x7, Megaminx', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 5, name: 'Tokyo Cube Challenge 2026', date: '2026-05-02 ~ 05-03', location: '東京, 日本', events: '3x3, 4x4, 5x5, 3x3BF, Sq-1', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 6, name: 'Singapore Open 2026', date: '2026-06-13 ~ 06-14', location: '新加坡', events: '3x3, 2x2, 3x3OH, Skewb, Clock', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 7, name: 'Hsinchu Winter 2026', date: '2026-12-12 ~ 12-13', location: '新竹市, 台灣', events: '3x3, 2x2, 4x4, Pyraminx, Skewb', link: 'https://www.worldcubeassociation.org/competitions' },
  { id: 8, name: 'Tainan Cube Day 2026', date: '2026-02-21 ~ 02-22', location: '台南市, 台灣', events: '3x3, 3x3OH, 3x3BF, Clock, Sq-1', link: 'https://www.worldcubeassociation.org/competitions' },
];

export default function CalendarPage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter for Taiwan events only and sort by date
  const filteredAndSortedCompetitions = competitions
    .filter(comp => comp.location.includes('台灣') || comp.location.includes('Taiwan'))
    .sort((a, b) => {
      const dateA = new Date(a.date.split(' ~ ')[0]).getTime();
      const dateB = new Date(b.date.split(' ~ ')[0]).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">魔方行事曆</h1>
        <p className="text-base md:text-lg text-slate-400">追蹤台灣在地即將舉辦的 WCA 官方賽事</p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
        >
          <ArrowUpDown className="w-4 h-4 mr-2 text-cyan-400" />
          時間排序: {sortOrder === 'asc' ? '由近到遠' : '由遠到近'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {filteredAndSortedCompetitions.map((comp, index) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-cyan-500/30 transition-colors flex flex-col h-full"
          >
            <h3 className="text-lg md:text-xl font-bold text-slate-100 mb-4">{comp.name}</h3>
            
            <div className="space-y-3 flex-grow">
              <div className="flex items-start text-slate-300">
                <CalendarDays className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="font-mono text-sm md:text-base">{comp.date}</span>
              </div>
              <div className="flex items-start text-slate-300">
                <MapPin className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{comp.location}</span>
              </div>
              <div className="flex items-start text-slate-300">
                <ColoredCubeIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base leading-relaxed">{comp.events}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a 
                href={comp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
              >
                查看賽事詳情 <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
