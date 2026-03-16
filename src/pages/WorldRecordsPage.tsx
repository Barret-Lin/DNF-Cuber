import { motion } from 'motion/react';
import { Trophy, Globe, Clock, PlayCircle } from 'lucide-react';

const records = [
  { id: '333', event: '3x3x3 Cube', time: '3.13 秒', holder: 'Max Park', country: '美國', date: '2023-06-11', competition: 'Pride in Long Beach 2023', videoId: 'MS5JJuO1Doo' },
  { id: '222', event: '2x2x2 Cube', time: '0.43 秒', holder: 'Teodor Zajder', country: '波蘭', date: '2023-11-05', competition: 'Warsaw Cube Masters 2023', videoId: 'MS5JJuO1Doo' },
  { id: '444', event: '4x4x4 Cube', time: '15.71 秒', holder: 'Max Park', country: '美國', date: '2024-06-08', competition: 'Colorado Spring 2024', videoId: 'MS5JJuO1Doo' },
  { id: '555', event: '5x5x5 Cube', time: '32.52 秒', holder: 'Max Park', country: '美國', date: '2024-03-16', competition: 'DFW Cubing Spring 2024', videoId: 'MS5JJuO1Doo' },
  { id: '666', event: '6x6x6 Cube', time: '58.03 秒', holder: 'Max Park', country: '美國', date: '2024-08-03', competition: 'CubingUSA Nationals 2024', videoId: 'MS5JJuO1Doo' },
  { id: '777', event: '7x7x7 Cube', time: '1:34.15', holder: 'Max Park', country: '美國', date: '2024-07-13', competition: 'Rubik\'s WCA North American Championship 2024', videoId: 'MS5JJuO1Doo' },
  { id: '333bf', event: '3x3x3 Blindfolded', time: '12.00 秒', holder: 'Tommy Cherry', country: '美國', date: '2024-02-11', competition: 'Triton Tricubealon 2024', videoId: 'MS5JJuO1Doo' },
  { id: '333fm', event: '3x3x3 Fewest Moves', time: '16 步', holder: 'Sebastiano Tronto', country: '義大利', date: '2024-06-15', competition: 'FMC 2024', videoId: 'MS5JJuO1Doo' },
  { id: '333oh', event: '3x3x3 One-Handed', time: '5.66 秒', holder: 'Dhruva Sai Meruva', country: '美國', date: '2024-08-03', competition: 'CubingUSA Nationals 2024', videoId: 'MS5JJuO1Doo' },
  { id: 'clock', event: 'Clock', time: '1.97 秒', holder: 'Brendyn Cortina', country: '美國', date: '2024-08-01', competition: 'CubingUSA Nationals 2024', videoId: 'MS5JJuO1Doo' },
  { id: 'megaminx', event: 'Megaminx', time: '23.18 秒', holder: 'Leandro Martín López', country: '阿根廷', date: '2024-04-13', competition: 'Di Tella Open 2024', videoId: 'MS5JJuO1Doo' },
  { id: 'pyraminx', event: 'Pyraminx', time: '0.73 秒', holder: 'Simon Kellum', country: '美國', date: '2023-12-21', competition: 'Middleton Meetup Winter 2023', videoId: 'MS5JJuO1Doo' },
  { id: 'sq1', event: 'Square-1', time: '3.41 秒', holder: 'Ryan Pilat', country: '美國', date: '2024-03-02', competition: 'Wichita Family ArtVenture 2024', videoId: 'MS5JJuO1Doo' },
  { id: 'skewb', event: 'Skewb', time: '0.75 秒', holder: 'Carter Kucala', country: '美國', date: '2024-03-23', competition: 'Going Fast in Grandview 2024', videoId: 'MS5JJuO1Doo' },
  { id: '444bf', event: '4x4x4 Blindfolded', time: '51.96 秒', holder: 'Stanley Chapel', country: '美國', date: '2023-01-28', competition: '4x4x4 Blindfolded 2023', videoId: 'MS5JJuO1Doo' },
  { id: '555bf', event: '5x5x5 Blindfolded', time: '2:21.62', holder: 'Stanley Chapel', country: '美國', date: '2019-12-15', competition: 'Michigan Cubing Club Epsilon 2019', videoId: 'MS5JJuO1Doo' },
  { id: '333mbf', event: '3x3x3 Multi-Blind', time: '62/65 57:47', holder: 'Graham Siggins', country: '美國', date: '2022-06-26', competition: 'Blind Drive Spring 2022', videoId: 'MS5JJuO1Doo' },
];

export default function WorldRecordsPage() {
  return (
    <div className="space-y-8 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">世界紀錄</h1>
        <p className="text-lg text-slate-400">見證人類突破極限的歷史時刻 (WCA 17項單次紀錄)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden flex flex-col hover:border-cyan-500/30 transition-colors"
          >
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-100">{record.event}</h3>
                <div className="flex items-center text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full text-xs font-bold font-mono whitespace-nowrap ml-2">
                  <Trophy className="w-3 h-3 mr-1" />
                  WR
                </div>
              </div>
              
              <div className="text-3xl font-mono font-black text-cyan-400 mb-6 tracking-tighter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                {record.time}
              </div>
              
              <div className="space-y-3 text-sm text-slate-400">
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
            
            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-800">
              <a 
                href={`https://www.youtube.com/watch?v=${record.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center transition-colors"
              >
                <PlayCircle className="w-4 h-4 mr-2" /> 觀看破紀錄影片
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
