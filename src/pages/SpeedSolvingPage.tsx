import { useState } from 'react';
import { Zap, PlayCircle, ChevronDown, ExternalLink } from 'lucide-react';

const speedMethods = [
  { id: '333', title: '3x3x3: CFOP', puzzle: '3x3x3 Cube', desc: '最主流的速解法，分為 Cross, F2L, OLL, PLL。', steps: [{name: 'Cross', desc: '在底面完成十字。'}, {name: 'F2L', desc: '同時將底層角塊與第二層邊塊配對。'}, {name: 'OLL', desc: '將頂面全部翻成同色。'}, {name: 'PLL', desc: '將頂層方塊移動到正確位置。'}], videoId: '7Ron6MN45LY' },
  { id: '222', title: '2x2x2: EG Method', puzzle: '2x2x2 Cube', desc: '高階 2x2 玩法，只需一面即可直接解決剩餘所有方塊。', steps: [{name: 'Face', desc: '完成任意一面（不需管側面顏色）'}, {name: 'EG-1/EG-2/CLL', desc: '根據底層狀態，使用一個公式完成頂層與所有排列。'}], videoId: 'R0yOKEQCRMQ' },
  { id: '444', title: '4x4x4: Yau Method', puzzle: '4x4x4 Cube', desc: '由 Robert Yau 發明，提前完成底層十字，大幅優化 3x3 階段的觀察。', steps: [{name: '雙中心', desc: '完成相對的兩個中心'}, {name: '三邊', desc: '完成三個底層邊塊'}, {name: '剩餘中心', desc: '完成剩下四個中心'}, {name: '最後一邊與組邊', desc: '完成最後一個底邊並使用 3-2-3 組邊'}], videoId: '7Ron6MN45LY' },
  { id: '555', title: '5x5x5: Yau5 / Redux', puzzle: '5x5x5 Cube', desc: '結合 Yau Method 的概念應用於 5x5，或使用傳統的 Free Slice 降階。', steps: [{name: '中心', desc: '快速完成六面中心'}, {name: '邊塊', desc: '使用 Free Slice 技巧快速配對邊塊'}, {name: 'L4E', desc: '處理最後四個邊塊的特殊情況'}], videoId: 'R0yOKEQCRMQ' },
  { id: '666', title: '6x6x6: Redux', puzzle: '6x6x6 Cube', desc: '大型魔方主流速解法，重點在於中心塊的觀察與指法。', steps: [{name: '中心', desc: '由內而外或由外而內完成中心'}, {name: '組邊', desc: '使用 6x6 特有的組邊技巧'}, {name: 'Parity', desc: '處理 OLL 與 PLL Parity'}], videoId: '7Ron6MN45LY' },
  { id: '777', title: '7x7x7: Redux', puzzle: '7x7x7 Cube', desc: '最高階官方賽事，考驗極致的觀察力與耐力。', steps: [{name: '中心', desc: '完成龐大的 5x5 中心區域'}, {name: '組邊', desc: '將五個邊塊組合在一起'}, {name: '3x3', desc: '小心轉動避免 Pop，完成 3x3 階段'}], videoId: 'R0yOKEQCRMQ' },
  { id: '333bf', title: '3x3x3 盲解: 3-Style', puzzle: '3x3x3 Blindfolded', desc: '頂尖盲解選手使用的高階方法，每次解決三個方塊（換三）。', steps: [{name: '角塊 3-Style', desc: '使用 Commutator (換三公式) 解決角塊'}, {name: '邊塊 3-Style', desc: '使用 Commutator 解決邊塊'}, {name: 'Parity', desc: '處理奇數次交換的 Parity'}], videoId: '7Ron6MN45LY' },
  { id: '333fm', title: '3x3x3 最少步數: DR', puzzle: '3x3x3 Fewest Moves', desc: 'Domino Reduction (DR)，將魔方降階到只需 U, D, R2, L2, F2, B2 轉動的狀態。', steps: [{name: 'EO', desc: 'Edge Orientation，翻正所有邊塊'}, {name: 'DR', desc: 'Domino Reduction，限制角塊與邊塊方向'}, {name: 'HTR', desc: 'Half Turn Reduction'}, {name: 'Finish', desc: '尋找最少步數的結尾'}], videoId: 'R0yOKEQCRMQ' },
  { id: '333oh', title: '3x3x3 單手: OH CFOP', puzzle: '3x3x3 One-Handed', desc: '針對單手優化的 CFOP，大量使用 z 轉體與 R U 轉動。', steps: [{name: 'Cross', desc: '在左側或底部完成十字'}, {name: 'OH F2L', desc: '使用適合單手的 F2L 公式'}, {name: 'OH OLL/PLL', desc: '替換掉包含大量 F/B/D 的公式，改用 R U L 轉動為主的公式'}], videoId: '7Ron6MN45LY' },
  { id: 'clock', title: '魔錶: 7-Simul', puzzle: 'Clock', desc: '同時按下多個按鈕，減少翻面與等待時間的高階解法。', steps: [{name: '觀察', desc: '在 15 秒內規劃好所有指針的走向'}, {name: 'Simul', desc: '同時轉動多個齒輪，一次解決多個指針'}, {name: 'No-Flip', desc: '進階選手甚至能不翻面完成魔錶'}], videoId: 'R0yOKEQCRMQ' },
  { id: 'megaminx', title: '五魔方: Westlund', puzzle: 'Megaminx', desc: '優化五魔方的 F2L 與 S2L 順序，減少尋找方塊的時間。', steps: [{name: 'Star', desc: '完成底部星形'}, {name: 'F2L', desc: '完成底部五個區塊'}, {name: 'S2L', desc: '有系統地完成側面區塊'}, {name: 'LL', desc: '使用五魔方專屬的 OLL 與 PLL'}], videoId: '7Ron6MN45LY' },
  { id: 'pyraminx', title: '金字塔: L4E / Oka', puzzle: 'Pyraminx', desc: '金字塔的進階解法，根據打亂狀態選擇最適合的方法。', steps: [{name: 'Top First', desc: '先完成頂部區塊'}, {name: 'L4E', desc: 'Last 4 Edges，一次解決剩下的四個邊塊'}, {name: 'Oka/Nutella', desc: '針對特定 Case 的速解公式'}], videoId: 'R0yOKEQCRMQ' },
  { id: 'sq1', title: 'Square-1: CSP', puzzle: 'Square-1', desc: 'Cube Shape Parity，在恢復正方體的同時預判並解決 Parity。', steps: [{name: 'CSP', desc: '觀察形狀並使用特定公式恢復正方體，同時確保不會出現 Parity'}, {name: 'OBL', desc: 'Orientation of Both Layers'}, {name: 'PBL', desc: 'Permutation of Both Layers'}], videoId: '7Ron6MN45LY' },
  { id: 'skewb', title: '斜轉: Sarah\'s Advanced', puzzle: 'Skewb', desc: '由 Sarah Strong 發明，包含大量的進階公式以應對各種情況。', steps: [{name: 'Layer', desc: '快速完成第一層'}, {name: 'Advanced Cases', desc: '辨識頂層與中心的相對位置，使用一步公式解決'}], videoId: 'R0yOKEQCRMQ' },
  { id: '444bf', title: '4x4x4 盲解: 3-Style', puzzle: '4x4x4 Blindfolded', desc: '將 3-Style 應用於 4x4 的中心與邊塊。', steps: [{name: '中心 3-Style', desc: '使用 Commutator 解決 24 個中心'}, {name: '邊塊 3-Style', desc: '解決 24 個翼邊'}], videoId: '7Ron6MN45LY' },
  { id: '555bf', title: '5x5x5 盲解: 3-Style', puzzle: '5x5x5 Blindfolded', desc: '最高難度的單顆盲解，需要極大的記憶量與 3-Style 熟練度。', steps: [{name: '多重中心', desc: '解決 +中心與 X中心'}, {name: '多重邊塊', desc: '解決中邊與翼邊'}], videoId: 'R0yOKEQCRMQ' },
  { id: '333mbf', title: '多顆盲解: 房間記憶法', puzzle: '3x3x3 Multi-Blind', desc: '挑戰人類記憶極限，世界紀錄可一次盲解 60 顆以上的魔方。', steps: [{name: '地點樁', desc: '準備數十個熟悉的房間與地點'}, {name: '圖像連結', desc: '將每顆魔方的編碼轉換為生動的圖像並放置於地點中'}, {name: '節奏控制', desc: '在記憶與執行之間找到最佳的節奏'}], videoId: '7Ron6MN45LY' },
];

export default function SpeedSolvingPage() {
  const [activeTab, setActiveTab] = useState(speedMethods[0].id);
  const activeMethod = speedMethods.find(m => m.id === activeTab) || speedMethods[0];

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="absolute top-40 right-0 w-64 h-64 md:w-80 md:h-80 bg-blue-600/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-3 md:space-y-4 mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">速解進階</h1>
        <p className="text-base md:text-lg text-slate-400">掌握世界頂尖選手都在使用的高階技巧</p>
      </div>

      {/* Dropdown for Mobile, Scrollable Tabs for Desktop */}
      <div className="mb-6 md:mb-8 flex justify-center">
        <div className="w-full md:w-auto relative">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="md:hidden w-full appearance-none bg-slate-900 border border-slate-700 text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {speedMethods.map(m => (
              <option key={m.id} value={m.id}>{m.puzzle} - {m.title.split(': ')[1]}</option>
            ))}
          </select>
          <ChevronDown className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          
          <div className="hidden md:flex flex-wrap justify-center gap-2 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50">
            {speedMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveTab(method.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === method.id
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {method.puzzle}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Text & Steps */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">{activeMethod.title}</h2>
            <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold rounded-full w-fit">
              {activeMethod.puzzle}
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-400 mb-6 leading-relaxed pb-4 border-b border-slate-800/50">{activeMethod.desc}</p>
          
          <div className="space-y-5 md:space-y-6 flex-grow">
            {activeMethod.steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-3 md:mr-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/20">
                    <Zap className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-slate-200">{step.name}</h4>
                  <p className="text-sm md:text-base text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-fit">
          <div className="p-3 md:p-4 bg-slate-900 flex justify-between items-center text-slate-200 border-b border-slate-800">
            <div className="flex items-center">
              <PlayCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 text-cyan-400" />
              <span className="font-medium text-sm md:text-base">進階教學影片</span>
            </div>
            <a 
              href={`https://www.youtube.com/watch?v=${activeMethod.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm text-cyan-400 hover:text-cyan-300 flex items-center"
            >
              在 YouTube 觀看 <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeMethod.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-3 md:p-4 bg-slate-900 text-slate-500 text-xs md:text-sm font-mono flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>SOURCE: YOUTUBE // ID: {activeMethod.videoId}</span>
            <span className="text-slate-600 text-xs">若無法播放請點擊上方連結</span>
          </div>
        </div>
      </div>
    </div>
  );
}
