import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

const timelineEvents = [
  {
    year: '1974',
    title: '魔術方塊的誕生',
    description: '匈牙利建築學教授 Ernő Rubik 發明了第一個魔術方塊（當時稱為 Magic Cube），最初是為了幫助學生理解 3D 幾何結構。',
    link: 'https://zh.wikipedia.org/zh-tw/%E9%AD%94%E6%96%B9'
  },
  {
    year: '1980',
    title: '風靡全球',
    description: 'Ideal Toy Corp. 將其重新命名為 Rubik\'s Cube 並推向全球市場，迅速成為 1980 年代最具代表性的玩具，銷量破億。',
    link: 'https://en.wikipedia.org/wiki/Ideal_Toy_Company'
  },
  {
    year: '1981',
    title: '暢銷書出版',
    description: 'Patrick Bossert 出版了《You Can Do the Cube》一書，成為解魔方的經典指南，銷量超過 150 萬冊。',
    link: 'https://en.wikipedia.org/wiki/You_Can_Do_the_Cube'
  },
  {
    year: '1982',
    title: '首屆世界錦標賽',
    description: '第一屆世界魔術方塊錦標賽在匈牙利布達佩斯舉行，美國選手 Minh Thai 以 22.95 秒的成績奪冠。',
    link: 'https://www.worldcubeassociation.org/competitions/WC1982'
  },
  {
    year: '2003',
    title: 'WCA 成立',
    description: '世界魔方協會（World Cube Association, WCA）正式成立，開始規範並舉辦全球性的魔術方塊賽事，魔方運動迎來復甦。',
    link: 'https://www.worldcubeassociation.org/'
  },
  {
    year: '2004',
    title: '官方比賽重啟',
    description: 'WCA 在多倫多舉辦了自 1982 年以來的首場世界錦標賽，標誌著現代魔方競賽時代的正式開始。',
    link: 'https://www.worldcubeassociation.org/competitions/WC2005'
  },
  {
    year: '2007',
    title: '盲解技術突破',
    description: '隨著記憶法與盲解公式（如 3-Style）的發展，選手們開始在極短的時間內完成盲解，推動了盲解項目的極限。',
    link: 'https://www.worldcubeassociation.org/results/rankings/333bf/single'
  },
  {
    year: '2013',
    title: '磁力魔術方塊的出現',
    description: '玩家與廠商開始在魔術方塊內部加入磁鐵，大幅提升了方塊的穩定性與容錯率，成為現代速解魔方的標準配置。',
    link: 'https://ruwix.com/the-rubiks-cube/magnetic-rubiks-cubes/'
  },
  {
    year: '2018',
    title: '單次突破 4 秒',
    description: '中國選手杜宇生（Yusheng Du）在比賽中以 3.47 秒的成績打破了 3x3x3 單次世界紀錄，人類首次突破 4 秒大關。',
    link: 'https://www.worldcubeassociation.org/persons/2015DUYU01'
  },
  {
    year: '2023',
    title: '3.13秒的奇蹟',
    description: '美國選手 Max Park 在比賽中以 3.13 秒的成績打破了 3x3x3 單次世界紀錄，將人類極限推向新高。',
    link: 'https://www.worldcubeassociation.org/persons/2012PARK03'
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
              <p className="text-slate-400 leading-relaxed mb-4">{event.description}</p>
              <a 
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                了解更多 <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
