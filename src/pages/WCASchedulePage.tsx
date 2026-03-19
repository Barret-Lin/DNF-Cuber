import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, MapPin, ExternalLink, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import { ColoredCubeIcon } from '../components/ColoredCubeIcon';
import { TaiwanMap } from '../components/TaiwanMap';

const eventMap: Record<string, string> = {
  '333': '3x3',
  '222': '2x2',
  '444': '4x4',
  '555': '5x5',
  '666': '6x6',
  '777': '7x7',
  '333bf': '3x3BF',
  '333fm': '3x3FM',
  '333oh': '3x3OH',
  'clock': 'Clock',
  'minx': 'Megaminx',
  'pyram': 'Pyraminx',
  'skewb': 'Skewb',
  'sq1': 'Sq-1',
  '444bf': '4x4BF',
  '555bf': '5x5BF',
  '333mbf': '3x3MBLD'
};

interface WCACompetition {
  id: string;
  name: string;
  date: string;
  location: string;
  events: string;
  link: string;
  coordinates: [number, number];
}

export default function WCASchedulePage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [competitions, setCompetitions] = useState<WCACompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      const startDateStr = now.toISOString().split('T')[0];
      
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(now.getFullYear() + 1);
      const endDateStr = oneYearLater.toISOString().split('T')[0];

      const response = await fetch(`https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=TW&start=${startDateStr}&end=${endDateStr}&sort=start_date`);
      
      if (!response.ok) {
        throw new Error('無法取得 WCA 賽事資料');
      }

      const data = await response.json();
      
      const formattedComps: WCACompetition[] = data.map((comp: any) => {
        let dateStr = comp.start_date;
        if (comp.start_date !== comp.end_date) {
          const endMonthDay = comp.end_date.substring(5);
          dateStr = `${comp.start_date} ~ ${endMonthDay}`;
        }

        const eventsStr = comp.event_ids
          .map((id: string) => eventMap[id] || id)
          .join(', ');

        return {
          id: comp.id,
          name: comp.name,
          date: dateStr,
          location: `${comp.city}, 中華台北`,
          events: eventsStr || '未定',
          link: comp.url,
          coordinates: [comp.latitude_degrees, comp.longitude_degrees] as [number, number]
        };
      });

      setCompetitions(formattedComps);
    } catch (err) {
      console.error(err);
      setError('載入賽事資料時發生錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const sortedCompetitions = [...competitions].sort((a, b) => {
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-400">正在載入賽事資料...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchCompetitions}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新嘗試
          </button>
        </div>
      ) : (
        <>
          {sortedCompetitions.length > 0 && (
            <div className="mb-10">
              <TaiwanMap events={sortedCompetitions} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <button
              onClick={fetchCompetitions}
              className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 w-full sm:w-auto justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2 text-cyan-400" />
              手動更新賽程
            </button>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 w-full sm:w-auto justify-center"
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
        </>
      )}
    </div>
  );
}
