import { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, MapPin, ExternalLink, ArrowUpDown } from 'lucide-react';
import { ColoredCubeIcon } from '../components/ColoredCubeIcon';
import { TaiwanMap } from '../components/TaiwanMap';

const wcaCompetitions = [
  { id: 1, name: "Please Don't DNF Kaohsiung 2026", date: '2026-04-05 ~ 04-06', location: '高雄市, 中華台北', events: '3x3BF, 3x3FM, Clock, 4x4BF, 5x5BF, 3x3MBLD', link: 'https://www.worldcubeassociation.org/competitions/PleaseDontDNFKaohsiung2026', coordinates: [22.627, 120.301] as [number, number] },
  { id: 2, name: 'Penghu Spring Cube Open 2026', date: '2026-03-14', location: '澎湖縣, 中華台北', events: '3x3, 2x2, 4x4, Pyraminx', link: 'https://www.worldcubeassociation.org/competitions/PenghuSpringCubeOpen2026', coordinates: [23.567, 119.575] as [number, number] },
  { id: 3, name: 'Shin Kong Cube Open - Taitung 2025', date: '2025-12-28', location: '台東市, 中華台北', events: '3x3', link: 'https://www.worldcubeassociation.org/competitions/ShinKongOpenTaitung2025', coordinates: [22.758, 121.144] as [number, number] },
  { id: 4, name: 'Taiwan Championship 2025', date: '2025-12-19 ~ 12-21', location: '新北市, 中華台北', events: '全項目 (17項)', link: 'https://www.worldcubeassociation.org/competitions/TaiwanChampionship2025', coordinates: [25.016, 121.462] as [number, number] },
  { id: 5, name: 'Shin Kong Cube Open - Kaohsiung 2025', date: '2025-12-14', location: '高雄市, 中華台北', events: '3x3', link: 'https://www.worldcubeassociation.org/competitions/ShinKongCubeOpenKaohsiung2025', coordinates: [22.627, 120.301] as [number, number] },
  { id: 6, name: 'Taoyuan Airport Cube Day 2025', date: '2025-11-29 ~ 11-30', location: '桃園市, 中華台北', events: '3x3, 2x2, 4x4, 5x5, Pyraminx, Skewb, Sq-1', link: 'https://www.worldcubeassociation.org/competitions/TaoyuanAirportCubeDay2025', coordinates: [24.993, 121.301] as [number, number] },
  { id: 7, name: 'Shin Kong Cube Open - Taichung 2025', date: '2025-11-22', location: '台中市, 中華台北', events: '3x3', link: 'https://www.worldcubeassociation.org/competitions/ShinKongOpenTaichung2025', coordinates: [24.147, 120.673] as [number, number] },
  { id: 8, name: 'Shin Kong Cube Open - New Taipei 2025', date: '2025-11-09', location: '新北市, 中華台北', events: '3x3', link: 'https://www.worldcubeassociation.org/competitions/ShinKongCubeOpenNewTaipei2025', coordinates: [25.016, 121.462] as [number, number] },
  { id: 9, name: 'Please Be Quiet Taiwan 2025', date: '2025-10-18 ~ 10-19', location: '台北市, 中華台北', events: '3x3BF, 3x3FM, 4x4BF, 5x5BF, 3x3MBLD', link: 'https://www.worldcubeassociation.org/competitions/PleaseBeQuietTaiwan2025', coordinates: [25.032, 121.565] as [number, number] },
];

export default function WCASchedulePage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);

  const sortedCompetitions = wcaCompetitions
    .filter(comp => {
      const startDateStr = comp.date.split(' ~ ')[0];
      const startDate = new Date(startDateStr);
      return startDate >= now && startDate <= oneYearLater;
    })
    .sort((a, b) => {
    const dateA = new Date(a.date.split(' ~ ')[0]).getTime();
    const dateB = new Date(b.date.split(' ~ ')[0]).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">WCA 賽程</h1>
        <p className="text-base md:text-lg text-slate-400">
          追蹤舉辦地點為「中華台北」的 WCA 官方賽事
          <br />
          <span className="text-sm text-slate-500">（僅顯示從今日起一年內的賽事）</span>
        </p>
      </div>

      {sortedCompetitions.length > 0 && (
        <div className="mb-10">
          <TaiwanMap events={sortedCompetitions} />
        </div>
      )}

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
        {sortedCompetitions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            目前一年內沒有即將舉辦的賽事
          </div>
        ) : (
          sortedCompetitions.map((comp, index) => (
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
                查看 WCA 賽事詳情 <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </motion.div>
        )))}
      </div>
    </div>
  );
}
