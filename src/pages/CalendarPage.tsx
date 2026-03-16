import { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, MapPin, ExternalLink, ArrowUpDown } from 'lucide-react';
import { ColoredCubeIcon } from '../components/ColoredCubeIcon';
import { TaiwanMap } from '../components/TaiwanMap';

const competitions = [
  { id: 1, name: '2026 高雄春季盲解賽', date: '2026-04-05 ~ 04-06', location: '正言里活動中心', events: '3x3BF, 4x4BF, 5x5BF, MBLD', link: 'https://cubing-tw.net/event/2026PleaseDontDNFKaohsiung/', coordinates: [22.628, 120.325] as [number, number] },
  { id: 2, name: '2026 澎湖春季魔術方塊公開賽', date: '2026-03-14', location: 'Pier3 澎坊購物休閒廣場', events: '3x3, 2x2, 4x4, Pyraminx', link: 'https://cubing-tw.net/event/2026PenghuSpringCubeOpen/', coordinates: [23.567, 119.575] as [number, number] },
  { id: 3, name: '2026 澎湖魔術方塊春季交流賽', date: '2026-02-27', location: '東衛社區活動中心', events: '交流活動', link: 'https://www.facebook.com/groups/1913111409519362/?multi_permalinks=2124551951708639', coordinates: [23.570, 119.590] as [number, number] },
  { id: 4, name: '2026 馬年趣味賽 暨 台南專櫃告別賽', date: '2026-02-21', location: '台南新光三越小西門 1F木棧板', events: '趣味競賽', link: 'https://maru.tw/event-20260221-goodbye-tainan/', coordinates: [22.987, 120.198] as [number, number] },
  { id: 5, name: '嘉義魔術方塊聚會', date: '2026-02-20', location: '麥當勞 嘉義中山餐廳', events: '玩家聚會', link: 'https://www.facebook.com/groups/taiwan.rubikscube.club/posts/25938552155772256/', coordinates: [23.480, 120.448] as [number, number] },
];

export default function CalendarPage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter events from today up to 1 year in the future
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);

  const filteredAndSortedCompetitions = competitions
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
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">魔方行事曆</h1>
        <p className="text-base md:text-lg text-slate-400">
          收錄台灣各種的魔術方塊比賽、活動，資訊來源：
          <a href="https://1hrbld.tw/cubing-events-calendar/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">一小時學盲解</a>
          <br />
          <span className="text-sm text-slate-500">（僅顯示從今日起一年內的賽事）</span>
        </p>
      </div>

      {filteredAndSortedCompetitions.length > 0 && (
        <div className="mb-10">
          <TaiwanMap events={filteredAndSortedCompetitions} />
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
        {filteredAndSortedCompetitions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            目前一年內沒有即將舉辦的賽事
          </div>
        ) : (
          filteredAndSortedCompetitions.map((comp, index) => (
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
        )))}
      </div>
    </div>
  );
}
