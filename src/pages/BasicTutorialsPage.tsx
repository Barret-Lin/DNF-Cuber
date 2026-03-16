import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

const tutorials = [
  { id: '333', title: '3x3x3 層先法', puzzle: '3x3x3 Cube', steps: [{name: '底層十字', desc: '在底面完成十字。'}, {name: '底層角塊', desc: '將底層四個角塊歸位。'}, {name: '第二層邊塊', desc: '將第二層四個邊塊歸位。'}, {name: '頂層十字', desc: '在頂面完成黃色十字。'}, {name: '頂面顏色', desc: '將頂面全部變成黃色。'}, {name: '頂層角塊', desc: '將頂層角塊移動到正確位置。'}, {name: '頂層邊塊', desc: '將頂層邊塊移動到正確位置。'}], videoId: '7Ron6MN45LY' },
  { id: '222', title: '2x2x2 基礎解法', puzzle: '2x2x2 Cube', steps: [{name: '底層', desc: '完成底面與第一層。'}, {name: '頂層', desc: '完成頂面與第二層。'}], videoId: 'MS5JJuO1Doo' },
  { id: '444', title: '4x4x4 降階法', puzzle: '4x4x4 Cube', steps: [{name: '中心', desc: '完成六面中心。'}, {name: '組邊', desc: '將邊塊兩兩配對。'}, {name: '3x3階段', desc: '視為3x3解原，並處理特殊情況(Parity)。'}], videoId: 'MS5JJuO1Doo' },
  { id: '555', title: '5x5x5 降階法', puzzle: '5x5x5 Cube', steps: [{name: '中心', desc: '完成3x3中心區塊。'}, {name: '組邊', desc: '將邊塊三三配對。'}, {name: '3x3階段', desc: '視為3x3解原。'}], videoId: 'MS5JJuO1Doo' },
  { id: '666', title: '6x6x6 降階法', puzzle: '6x6x6 Cube', steps: [{name: '中心', desc: '完成4x4中心區塊。'}, {name: '組邊', desc: '將邊塊四四配對。'}, {name: '3x3階段', desc: '處理Parity並解原。'}], videoId: 'MS5JJuO1Doo' },
  { id: '777', title: '7x7x7 降階法', puzzle: '7x7x7 Cube', steps: [{name: '中心', desc: '完成5x5中心區塊。'}, {name: '組邊', desc: '將邊塊五五配對。'}, {name: '3x3階段', desc: '視為3x3解原。'}], videoId: 'MS5JJuO1Doo' },
  { id: '333bf', title: '3x3x3 盲解 (OP法)', puzzle: '3x3x3 Blindfolded', steps: [{name: '編碼', desc: '將角塊與邊塊位置轉換為英文字母。'}, {name: '記憶', desc: '利用聯想法記憶字母順序。'}, {name: '執行', desc: '戴上眼罩，使用Old Pochmann公式逐一復原。'}], videoId: 'MS5JJuO1Doo' },
  { id: '333fm', title: '3x3x3 最少步數基礎', puzzle: '3x3x3 Fewest Moves', steps: [{name: 'Blockbuilding', desc: '不拘泥於層先，優先建立2x2x2區塊。'}, {name: 'F2L-1', desc: '擴展至前兩層減一槽。'}, {name: 'LL', desc: '使用最少步數公式解決頂層。'}], videoId: 'MS5JJuO1Doo' },
  { id: '333oh', title: '3x3x3 單手基礎', puzzle: '3x3x3 One-Handed', steps: [{name: '握法', desc: '使用左手小指與無名指支撐。'}, {name: '指法', desc: '練習單手撥動 U、R 層。'}, {name: '公式轉換', desc: '避免需要大量 F 或 B 轉動的公式。'}], videoId: 'MS5JJuO1Doo' },
  { id: 'clock', title: '魔錶基礎解法', puzzle: 'Clock', steps: [{name: '十字', desc: '將一面四個邊的指針與中心對齊。'}, {name: '角針', desc: '將四個角的指針對齊。'}, {name: '翻面', desc: '翻面重複上述步驟。'}], videoId: 'MS5JJuO1Doo' },
  { id: 'megaminx', title: '五魔方基礎解法', puzzle: 'Megaminx', steps: [{name: '白色星形', desc: '完成底面五個邊塊。'}, {name: 'F2L', desc: '完成底層角塊與第二層邊塊。'}, {name: 'S2L', desc: '依序完成側面各層。'}, {name: '頂層', desc: '完成頂面星形與角塊。'}], videoId: 'MS5JJuO1Doo' },
  { id: 'pyraminx', title: '金字塔基礎解法', puzzle: 'Pyraminx', steps: [{name: '角塊', desc: '對齊四個角塊與中心。'}, {name: '底層', desc: '完成底面三個邊塊。'}, {name: '頂層', desc: '使用公式完成最後三個邊塊。'}], videoId: 'MS5JJuO1Doo' },
  { id: 'sq1', title: 'Square-1 基礎解法', puzzle: 'Square-1', steps: [{name: '復原形狀', desc: '將魔方轉回正方體。'}, {name: '角塊分色', desc: '將上下層角塊顏色分開。'}, {name: '邊塊分色', desc: '將上下層邊塊顏色分開。'}, {name: '排列', desc: '完成上下層的角塊與邊塊排列。'}], videoId: 'MS5JJuO1Doo' },
  { id: 'skewb', title: '斜轉基礎解法', puzzle: 'Skewb', steps: [{name: '底層', desc: '完成底面四個角塊。'}, {name: '頂層角塊', desc: '將頂層四個角塊翻轉至正確方向。'}, {name: '中心塊', desc: '將剩餘中心塊歸位。'}], videoId: 'MS5JJuO1Doo' },
  { id: '444bf', title: '4x4x4 盲解基礎', puzzle: '4x4x4 Blindfolded', steps: [{name: '中心記憶', desc: '使用 U2 法記憶 24 個中心塊。'}, {name: '邊塊記憶', desc: '使用 r2 法記憶 24 個邊塊。'}, {name: '角塊記憶', desc: '使用 OP 法記憶 8 個角塊。'}], videoId: 'MS5JJuO1Doo' },
  { id: '555bf', title: '5x5x5 盲解基礎', puzzle: '5x5x5 Blindfolded', steps: [{name: '中心與邊塊', desc: '分別記憶 +中心、X中心、中邊與翼邊。'}, {name: '執行', desc: '依序使用 U2/r2 等盲解公式執行。'}], videoId: 'MS5JJuO1Doo' },
  { id: '333mbf', title: '多顆盲解基礎', puzzle: '3x3x3 Multi-Blind', steps: [{name: '記憶宮殿', desc: '在腦海中建立路線，將每顆魔方的編碼放進房間。'}, {name: '大量記憶', desc: '反覆複習確保不遺忘。'}, {name: '連續執行', desc: '戴上眼罩後一口氣復原所有魔方。'}], videoId: 'MS5JJuO1Doo' },
];

export default function BasicTutorialsPage() {
  const [activeTab, setActiveTab] = useState(tutorials[0].id);
  const activeTutorial = tutorials.find(t => t.id === activeTab) || tutorials[0];

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-20 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">基礎教學</h1>
        <p className="text-lg text-slate-400">圖文與影音並茂，帶你輕鬆學會全項目魔方復原</p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {tutorials.map((tutorial) => (
          <button
            key={tutorial.id}
            onClick={() => setActiveTab(tutorial.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
              activeTab === tutorial.id
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tutorial.puzzle}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Text & Steps */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{activeTutorial.title}</h2>
          <div className="space-y-6">
            {activeTutorial.steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-200">{step.name}</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
          <div className="p-4 bg-slate-900 flex items-center text-slate-200 border-b border-slate-800">
            <PlayCircle className="h-5 w-5 mr-2 text-cyan-400" />
            <span className="font-medium">教學影片</span>
          </div>
          <div className="relative w-full aspect-video bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeTutorial.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4 bg-slate-900 text-slate-500 text-sm font-mono">
            SOURCE: YOUTUBE // ID: {activeTutorial.videoId}
          </div>
        </div>
      </div>
    </div>
  );
}
