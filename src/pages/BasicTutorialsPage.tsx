import { useState } from 'react';
import { PlayCircle, ChevronDown, ExternalLink } from 'lucide-react';

const tutorials = [
  { id: '333', title: '3x3x3 層先法', puzzle: '3x3x3 Cube', steps: [{name: '底層十字 (Cross)', desc: '尋找帶有白色的邊塊，將它們與對應的側面中心塊對齊，最後轉到底部形成一個白色的十字。'}, {name: '底層角塊 (First Layer)', desc: '找到帶有白色的角塊，對齊另外兩個顏色的中心，使用基本公式將其放入底層，完成第一層。'}, {name: '第二層邊塊 (Second Layer)', desc: '在頂層尋找不含黃色的邊塊，對齊側面中心後，使用公式將其放入第二層的正確位置。'}, {name: '頂層十字 (Top Cross)', desc: '觀察頂層黃色邊塊的形狀（點、拐角、一字），使用公式翻轉邊塊，形成黃色十字。'}, {name: '頂面顏色 (OLL 基礎)', desc: '觀察頂層黃色角塊的朝向，重複使用特定公式，直到頂面全部變成黃色。'}, {name: '頂層角塊 (PLL 角塊)', desc: '尋找頂層側面有兩個相同顏色的角塊（車頭燈），使用公式將所有角塊移動到正確位置。'}, {name: '頂層邊塊 (PLL 邊塊)', desc: '觀察頂層邊塊的排列，使用最後的公式將邊塊互相交換，完成整顆魔術方塊！'}], videoId: '7Ron6MN45LY' },
  { id: '222', title: '2x2x2 基礎解法', puzzle: '2x2x2 Cube', steps: [{name: '底層完成 (First Layer)', desc: '任選一個顏色作為底面（通常為白色），將四個角塊互相對齊側面顏色並放入底層。'}, {name: '頂面翻色 (OLL)', desc: '觀察頂層角塊的朝向，使用與 3x3 相同的公式，將頂面四個角塊全部翻成黃色。'}, {name: '頂層排列 (PLL)', desc: '尋找頂層側面相鄰顏色相同的角塊，使用公式將其交換至正確位置，完成復原。'}], videoId: 'GANnG5a19kg' },
  { id: '444', title: '4x4x4 降階法', puzzle: '4x4x4 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '將同色的四個中心塊組合在一起，並確保六個面的顏色相對位置正確（如白對黃、藍對綠、紅對橘）。'}, {name: '邊塊配對 (Edge Pairing)', desc: '尋找兩個顏色完全相同的邊塊，將它們移動到同一個軌道上並配對，完成 12 組邊塊。'}, {name: '3x3 階段復原', desc: '將配對好的邊塊視為 3x3 的邊塊，中心視為 3x3 的中心，使用 3x3 的方法進行復原。'}, {name: '處理特殊情況 (Parity)', desc: '在 3x3 階段可能會遇到單邊翻轉 (OLL Parity) 或兩邊互換 (PLL Parity) 的特殊情況，需使用專屬長公式解決。'}], videoId: 'KWOZHbDdOeo' },
  { id: '555', title: '5x5x5 降階法', puzzle: '5x5x5 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '以 3x3 的中心為基礎，將周圍的 8 個中心塊組合起來，完成 3x3 大小的中心區塊。'}, {name: '邊塊配對 (Edge Pairing)', desc: '尋找三個顏色相同的邊塊，將它們組合成一個完整的長條邊塊，完成 12 組。'}, {name: '3x3 階段復原', desc: '將組合好的邊塊與中心視為 3x3 魔術方塊，使用 3x3 的方法進行復原。'}, {name: '處理特殊情況 (Parity)', desc: '5x5 只有在組邊最後階段可能會遇到單邊翻轉的特殊情況 (Edge Parity)，需使用公式解決。'}], videoId: 'd1I-jJlVwB4' },
  { id: '666', title: '6x6x6 降階法', puzzle: '6x6x6 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '將 16 個同色中心塊組合在一起，注意偶數階沒有固定中心，需自行確認顏色相對位置。'}, {name: '邊塊配對 (Edge Pairing)', desc: '將四個顏色相同的邊塊組合成一組，完成 12 組邊塊。'}, {name: '3x3 階段與 Parity', desc: '使用 3x3 方法復原，過程中可能會遇到類似 4x4 的單邊翻轉 (OLL Parity) 與兩邊互換 (PLL Parity)。'}], videoId: 'SkZ9UadAOvQ' },
  { id: '777', title: '7x7x7 降階法', puzzle: '7x7x7 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '以固定中心為基準，將周圍的 24 個中心塊組合起來，完成 5x5 大小的中心區塊。'}, {name: '邊塊配對 (Edge Pairing)', desc: '將五個顏色相同的邊塊組合成一組，完成 12 組邊塊。'}, {name: '3x3 階段與 Parity', desc: '使用 3x3 方法復原，最後可能會遇到類似 5x5 的單邊翻轉特殊情況。'}], videoId: 'TxQStyDEwdU' },
  { id: '333bf', title: '3x3x3 盲解 (OP法)', puzzle: '3x3x3 Blindfolded', steps: [{name: '編碼系統 (Coding)', desc: '為魔術方塊的每一個角塊與邊塊位置分配一個英文字母或注音符號。'}, {name: '記憶路線 (Memorization)', desc: '觀察打亂的方塊，追蹤方塊應該去的位置，將字母串連成有意義的詞彙或故事來記憶。'}, {name: '執行復原 (Execution)', desc: '戴上眼罩，使用 Old Pochmann (OP) 公式，每次只交換兩個方塊，逐一將所有方塊送回正確位置。'}], videoId: 'ZZ41gWvltT8' },
  { id: '333fm', title: '3x3x3 最少步數基礎', puzzle: '3x3x3 Fewest Moves', steps: [{name: '區塊建構 (Blockbuilding)', desc: '打破層先法的思維，優先在角落建立 2x2x2 的已復原區塊，以節省步數。'}, {name: '擴展區塊 (F2L-1)', desc: '將 2x2x2 區塊擴展為 2x2x3，接著完成前兩層但保留一個槽位 (F2L-1)。'}, {name: '邊塊翻正與頂層 (EO & LL)', desc: '在過程中提早翻正邊塊 (Edge Orientation)，並使用最少步數的公式解決最後的頂層。'}], videoId: 'b230h49TVkk' },
  { id: '333oh', title: '3x3x3 單手基礎', puzzle: '3x3x3 One-Handed', steps: [{name: '正確握法 (Grip)', desc: '通常使用左手，以小指與無名指支撐方塊底部，拇指與中指控制前方與上方。'}, {name: '單手指法 (Fingertricks)', desc: '練習使用左手食指撥動 U 層，小指撥動 D 層，並透過手腕轉動 R 層。'}, {name: '公式優化 (Algorithm Choice)', desc: '避免使用需要大量 F、B 或雙層轉動的公式，改用以 R、U、L 轉動為主的單手專用公式。'}], videoId: 'mUF3aPDTO-4' },
  { id: 'clock', title: '魔錶基礎解法', puzzle: 'Clock', steps: [{name: '正面十字 (Cross)', desc: '按下特定的按鈕，轉動齒輪，將正面的四個邊針與中心指針對齊並指向 12 點。'}, {name: '背面十字與角針', desc: '翻面完成背面的十字，接著逐一將四個角針對齊中心指針。'}, {name: '同步歸位 (Finish)', desc: '最後將所有按鈕按上，轉動任一齒輪將所有指針同步指向 12 點。'}], videoId: '5OerYjT0pGg' },
  { id: 'megaminx', title: '五魔方基礎解法', puzzle: 'Megaminx', steps: [{name: '白色星形 (Star)', desc: '在白色面尋找五個帶有白色的邊塊，與側面中心對齊，形成白色五角星。'}, {name: '底層與第二層 (F2L)', desc: '類似 3x3 的 F2L，將底層角塊與對應的邊塊配對並放入，完成底部一個半球體。'}, {name: '側面延伸 (S2L)', desc: '依序完成側面的各個顏色區塊，逐步向上推進，直到只剩下最後一個頂面。'}, {name: '頂層復原 (LL)', desc: '完成頂面星形，翻轉頂面顏色，最後調整角塊與邊塊位置，完成復原。'}], videoId: 'oVRooYDvRqg' },
  { id: 'pyraminx', title: '金字塔基礎解法', puzzle: 'Pyraminx', steps: [{name: '角塊與中心 (Tips & Centers)', desc: '轉動四個最外側的小角塊使其與相鄰顏色一致，接著將三個同色中心塊轉到同一個面上。'}, {name: '完成底層 (First Layer)', desc: '將三個底層邊塊放入正確位置，完成第一層與底面。'}, {name: '頂層復原 (Last Layer)', desc: '觀察剩下的三個邊塊，使用簡單的四步或基本公式將其歸位。'}], videoId: 'pHBj8hixTfE' },
  { id: 'sq1', title: 'Square-1 基礎解法', puzzle: 'Square-1', steps: [{name: '復原形狀 (Cube Shape)', desc: '不論打亂成什麼形狀，透過特定步驟將上下層的角塊與邊塊集中，恢復成正方體。'}, {name: '角塊分色 (CO)', desc: '將白色的角塊全部集中到頂層，黃色的角塊集中到底層。'}, {name: '邊塊分色 (EO)', desc: '將白色的邊塊全部集中到頂層，黃色的邊塊集中到底層。'}, {name: '排列歸位 (CP & EP)', desc: '先將上下層的角塊移動到正確位置，最後再將邊塊互相交換至正確位置。'}], videoId: 'xITr2WFqado' },
  { id: 'skewb', title: '斜轉基礎解法', puzzle: 'Skewb', steps: [{name: '完成底層 (First Layer)', desc: '任選一個顏色作為底面中心，將四個對應顏色的角塊轉入並確保側面顏色一致。'}, {name: '頂層角塊翻轉 (Top Corners)', desc: '觀察頂層四個角塊的黃色朝向，使用「下下上上」基本公式將其翻轉至頂面。'}, {name: '中心塊歸位 (Centers)', desc: '觀察剩餘未歸位的中心塊，再次使用「下下上上」公式配合翻轉魔方，將所有中心塊復原。'}], videoId: 'I6132yshkeU' },
  { id: '444bf', title: '4x4x4 盲解基礎', puzzle: '4x4x4 Blindfolded', steps: [{name: '中心記憶與執行 (Centers)', desc: '將 24 個中心塊編碼，使用 U2 法（每次交換三個中心塊）進行記憶與復原。'}, {name: '邊塊記憶與執行 (Edges)', desc: '將 24 個翼邊編碼，使用 r2 法進行記憶與復原，需注意邊塊的方向性。'}, {name: '角塊記憶與執行 (Corners)', desc: '角塊部分與 3x3 盲解完全相同，通常使用 OP 法進行記憶與復原。'}], videoId: 'Us0x_zcNSfU' },
  { id: '555bf', title: '5x5x5 盲解基礎', puzzle: '5x5x5 Blindfolded', steps: [{name: '多重中心 (Centers)', desc: '5x5 包含 +字中心與 X字中心，需分別進行編碼與記憶，使用 U2 法復原。'}, {name: '多重邊塊 (Edges)', desc: '包含中邊（同3x3）與翼邊（同4x4），需分別記憶並使用 M2/r2 法復原。'}, {name: '角塊與執行 (Execution)', desc: '角塊同 3x3，整體記憶量龐大，需有系統地在腦海中建立記憶宮殿。'}], videoId: 'apFafRSFXlo' },
  { id: '333mbf', title: '多顆盲解基礎', puzzle: '3x3x3 Multi-Blind', steps: [{name: '記憶宮殿 (Memory Palace)', desc: '在腦海中建立熟悉的空間路線（如自己的家），規劃好放置記憶編碼的「地點樁」。'}, {name: '大量記憶 (Memorization)', desc: '依序觀察每顆魔方，將編碼轉換為生動的圖像，並依序放置於記憶宮殿的地點中。'}, {name: '連續執行 (Execution)', desc: '戴上眼罩後，在腦海中走過記憶宮殿，提取圖像還原成編碼，一口氣復原所有魔方。'}], videoId: 'DKBg78f9DFs' },
];

export default function BasicTutorialsPage() {
  const [activeTab, setActiveTab] = useState(tutorials[0].id);
  const activeTutorial = tutorials.find(t => t.id === activeTab) || tutorials[0];

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="absolute top-20 left-0 w-48 h-48 md:w-72 md:h-72 bg-cyan-500/10 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>
      
      <div className="text-center space-y-3 md:space-y-4 mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">基礎教學</h1>
        <p className="text-base md:text-lg text-slate-400">圖文與影音並茂，帶你輕鬆學會全項目魔方復原</p>
      </div>

      {/* Dropdown for Mobile, Scrollable Tabs for Desktop */}
      <div className="mb-6 md:mb-8 flex justify-center">
        <div className="w-full md:w-auto relative">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="md:hidden w-full appearance-none bg-slate-900 border border-slate-700 text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {tutorials.map(t => (
              <option key={t.id} value={t.id}>{t.puzzle} - {t.title}</option>
            ))}
          </select>
          <ChevronDown className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          
          <div className="hidden md:flex flex-wrap justify-center gap-2 bg-slate-900/30 p-2 rounded-2xl border border-slate-800/50">
            {tutorials.map((tutorial) => (
              <button
                key={tutorial.id}
                onClick={() => setActiveTab(tutorial.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tutorial.id
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tutorial.puzzle}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Text & Steps */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col h-full">
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-800/50">{activeTutorial.title}</h2>
          <div className="space-y-5 md:space-y-6 flex-grow">
            {activeTutorial.steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-3 md:mr-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm md:text-base">
                    {index + 1}
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
              <span className="font-medium text-sm md:text-base">教學影片</span>
            </div>
            <a 
              href={`https://www.youtube.com/watch?v=${activeTutorial.videoId}`}
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
              src={`https://www.youtube.com/embed/${activeTutorial.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-3 md:p-4 bg-slate-900 text-slate-500 text-xs md:text-sm font-mono flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>SOURCE: YOUTUBE // ID: {activeTutorial.videoId}</span>
            <span className="text-slate-600 text-xs">若無法播放請點擊上方連結</span>
          </div>
        </div>
      </div>
    </div>
  );
}
