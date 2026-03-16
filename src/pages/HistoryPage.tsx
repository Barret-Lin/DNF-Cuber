import { motion } from 'motion/react';

const timelineEvents = [
  {
    year: '1974',
    title: '魔術方塊的誕生',
    description: '匈牙利建築學教授 Ernő Rubik 發明了第一個魔術方塊（當時稱為 Magic Cube），最初是為了幫助學生理解 3D 幾何結構。',
  },
  {
    year: '1980',
    title: '風靡全球',
    description: 'Ideal Toy Corp. 將其重新命名為 Rubik\'s Cube 並推向全球市場，迅速成為 1980 年代最具代表性的玩具，銷量破億。',
  },
  {
    year: '1982',
    title: '首屆世界錦標賽',
    description: '第一屆世界魔術方塊錦標賽在匈牙利布達佩斯舉行，美國選手 Minh Thai 以 22.95 秒的成績奪冠。',
  },
  {
    year: '2003',
    title: 'WCA 成立',
    description: '世界魔方協會（World Cube Association, WCA）正式成立，開始規範並舉辦全球性的魔術方塊賽事，魔方運動迎來復甦。',
  },
  {
    year: '2010s',
    title: '硬體與技術的飛躍',
    description: '磁力魔術方塊的出現以及 CFOP、Roux 等速解方法的普及，讓人類解魔方的極限不斷被突破，進入了「次世代」速解時代。',
  },
  {
    year: '2023',
    title: '3.13秒的奇蹟',
    description: '美國選手 Max Park 在比賽中以 3.13 秒的成績打破了 3x3x3 單次世界紀錄，將人類極限推向新高。',
  }
];

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">魔術方塊歷史沿革</h1>
        <p className="text-lg text-slate-400">從一個教學工具到風靡全球的智力運動</p>
      </div>

      <div className="relative border-l-2 border-slate-700 ml-4 md:ml-0">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="mb-10 ml-8 relative"
          >
            <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
              <span className="text-sm font-mono font-bold text-cyan-400 tracking-wider">{event.year}</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1 mb-2">{event.title}</h3>
              <p className="text-slate-400 leading-relaxed">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
