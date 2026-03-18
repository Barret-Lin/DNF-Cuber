import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, PlayCircle, ChevronDown, ExternalLink } from 'lucide-react';

const speedMethods = [
  { id: '333', title: '3x3x3: CFOP', puzzle: '3x3x3 Cube', desc: '最主流的速解法，分為 Cross, F2L, OLL, PLL。', steps: [{name: 'Cross', desc: '在底面（通常為白色）建立一個十字。核心目標是觀察打亂狀態，在 8 步以內規劃好四個邊塊的相對位置，並流暢地一次性放入底層，為後續步驟打下穩固基礎。'}, {name: 'F2L', desc: 'First 2 Layers。核心目標是將底層角塊與對應的第二層邊塊在頂層配對，然後一併放入槽位（Slot）。這階段極度仰賴「預判（Look-ahead）」，在放入一組方塊的同時，眼睛必須尋找下一組的目標。'}, {name: 'OLL', desc: 'Orientation of the Last Layer。透過辨識頂層黃色方塊的 57 種不同形狀（如點、線、拐角或特定圖形），使用對應的公式，一次性將頂面所有方塊翻轉為黃色朝上。'}, {name: 'PLL', desc: 'Permutation of the Last Layer。觀察頂層側面顏色的排列特徵（如車頭燈、大色塊），從 21 個公式中選出對應解法，將所有頂層方塊交換至正確位置，完成整顆魔方。'}], videoId: 'Tvt85mW28vo' },
  { id: '222', title: '2x2x2: EG Method', puzzle: '2x2x2 Cube', desc: '高階 2x2 玩法，只需一面即可直接解決剩餘所有方塊。', steps: [{name: 'Face', desc: '快速在底層建立一個同色面。與層先法不同，EG 允許底層側邊顏色不一致，這大幅減少了完成底面的步數，讓選手能在觀察階段就完全預判底面走向。'}, {name: 'EG-1/EG-2/CLL', desc: '根據底層側邊的排列狀態（完全正確、相鄰交換、對角交換），配合頂層的 OLL 形狀，從多達 120 個公式中選擇對應解法，一步同時完成頂面翻轉與上下層排列。'}], videoId: '30IF6qW3cNg' },
  { id: '444', title: '4x4x4: Yau Method', puzzle: '4x4x4 Cube', desc: '由 Robert Yau 發明，提前完成底層十字，大幅優化 3x3 階段的觀察。', steps: [{name: '雙中心', desc: '首先在左右兩側完成兩個相對的中心（通常是白與黃）。這能限制後續組邊的範圍，讓尋找方塊的過程更集中。'}, {name: '三邊', desc: '在完成剩餘四個中心之前，先組裝三個底層的十字邊塊並放入正確位置。這個創新的步驟能讓後續的 3x3 階段省去尋找底層十字的時間。'}, {name: '剩餘中心', desc: '利用尚未放入底邊的「空槽（Keyhole）」作為緩衝區，在不破壞已完成的三個底邊的情況下，快速完成側面的四個中心塊。'}, {name: '最後一邊與組邊', desc: '完成最後一個底邊形成完整十字後，使用 3-2-3 或 3-3-2 的邊塊配對技巧（Edge Pairing），一次性且有系統地處理剩餘的邊塊，大幅減少視線停頓。'}], videoId: 'YYHpac-4JL4' },
  { id: '555', title: '5x5x5: Yau5 / Redux', puzzle: '5x5x5 Cube', desc: '結合 Yau Method 的概念應用於 5x5，或使用傳統的 Free Slice 降階。', steps: [{name: '中心', desc: '利用 1x2 或 1x3 的長條區塊（Blockbuilding）概念，由內而外有系統地組合出六個 3x3 大小的中心。熟練的選手會善用半完成的中心來減少轉動步數。'}, {name: '邊塊', desc: '利用中間層（M/E/S）的自由轉動（Free Slice），將散落的邊塊集中到同一條軌道上進行配對。核心目標是減少整體翻轉魔方的次數。'}, {name: 'L4E', desc: 'Last 4 Edges。當剩下最後四個邊塊時，Free Slice 的空間受限，需要使用特定的 L4E 公式或替換技巧來完成最後的配對，並處理可能出現的單邊翻轉 Parity。'}], videoId: 'd1I-jJlVwB4' },
  { id: '666', title: '6x6x6: Redux', puzzle: '6x6x6 Cube', desc: '大型魔方主流速解法，重點在於中心塊的觀察與指法。', steps: [{name: '中心', desc: '6x6 沒有固定中心塊，因此必須自行牢記正確的顏色相對位置。通常採用「由內而外（先建構 2x2 中心再擴展）」的策略，確保中心區塊的正確性。'}, {name: '組邊', desc: '將四個同色邊塊組合成一組。由於邊塊數量眾多，觀察力是關鍵。選手會利用多重軌道同時進行配對，以最大化每一次轉動的效益。'}, {name: 'Parity', desc: '在降階為 3x3 後，由於偶數階的特性，極有可能遇到單邊翻轉（OLL Parity）或兩邊互換（PLL Parity）的特殊情況，必須熟練掌握這些長公式。'}], videoId: 'SkZ9UadAOvQ' },
  { id: '777', title: '7x7x7: Redux', puzzle: '7x7x7 Cube', desc: '最高階官方賽事，考驗極致的觀察力與耐力。', steps: [{name: '中心', desc: '7x7 的中心區域廣達 5x5，是耗時最長的階段。核心目標是保持視線的連貫性，利用長條建構法（Bar building）逐一完成六個面的中心。'}, {name: '組邊', desc: '在龐大的方塊群中尋找五個同色邊塊並進行配對。這階段極度考驗眼力與耐心，通常會結合 Free Slice 技巧來提高配對效率。'}, {name: '3x3', desc: '降階完成後，將其視為一顆巨大的 3x3 進行復原。由於 7x7 結構複雜，轉動時必須保持平穩，避免方塊噴飛（Pop）導致前功盡棄。'}], videoId: 'TxQStyDEwdU' },
  { id: '333bf', title: '3x3x3 盲解: 3-Style', puzzle: '3x3x3 Blindfolded', desc: '頂尖盲解選手使用的高階方法，每次解決三個方塊（換三）。', steps: [{name: '角塊 3-Style', desc: '捨棄傳統的兩兩交換，3-Style 核心在於使用「換三公式（Commutator）」，每次轉動直接將兩個角塊送回正確位置，大幅減少復原步數與時間。'}, {name: '邊塊 3-Style', desc: "與角塊原理相同，透過理解 A B A' B' 的公式邏輯，在不破壞其他方塊的情況下，精準地將三個邊塊進行循環交換。"}, {name: 'Parity', desc: '當角塊與邊塊的交換次數皆為奇數時，會留下兩個角塊與兩個邊塊未歸位。此時需使用特定的 Parity 公式，一次性解決這四個方塊的錯位問題。'}], videoId: '9KPqwwKNldc' },
  { id: '333fm', title: '3x3x3 最少步數: DR', puzzle: '3x3x3 Fewest Moves', desc: 'Domino Reduction (DR)，將魔方降階到只需 U, D, R2, L2, F2, B2 轉動的狀態。', steps: [{name: 'EO', desc: 'Edge Orientation，第一步是限制邊塊的方向。透過 R L F B 等轉動，將所有邊塊的朝向調整為「正確」，使得後續只需使用特定面的轉動即可復原。'}, {name: 'DR', desc: 'Domino Reduction，將魔方的狀態進一步限制，使其等同於一顆 3x3x2 魔方（Domino）。在這個狀態下，只能使用 U, D, R2, L2, F2, B2 進行轉動。'}, {name: 'HTR', desc: 'Half Turn Reduction，將狀態再次降階，使得所有面的轉動都只能是 180 度（Half Turn）。這是 FMC 中極度高階且需要強大邏輯推演能力的技巧。'}, {name: 'Finish', desc: '在 HTR 狀態下，利用電腦科學中的圖論概念或大量的嘗試，尋找能在個位數步數內將魔方完全復原的最佳路徑。'}], videoId: 'b230h49TVkk' },
  { id: '333oh', title: '3x3x3 單手: OH CFOP', puzzle: '3x3x3 One-Handed', desc: '針對單手優化的 CFOP，大量使用 z 轉體與 R U 轉動。', steps: [{name: 'Cross', desc: '單手解法中，為了減少魔方翻轉（Rotation），選手通常會選擇在左側（L面）或底部（D面）建構十字，讓主力手（通常是左手）能更順暢地執行後續動作。'}, {name: 'OH F2L', desc: '捨棄雙手常用的 F 或 B 轉動，單手 F2L 核心在於將所有動作轉化為 R、U、L 的組合，並大量依賴 z 或 y 的整體翻轉來創造順手的執行角度。'}, {name: 'OH OLL/PLL', desc: '重新學習一套專為單手優化的 OLL 與 PLL 公式集。這些公式可能步數較多，但因為完全符合單手的人體工學，實際執行速度會比雙手公式更快。'}], videoId: 'mUF3aPDTO-4' },
  { id: 'clock', title: '魔錶: 7-Simul', puzzle: 'Clock', desc: '同時按下多個按鈕，減少翻面與等待時間的高階解法。', steps: [{name: '觀察', desc: '魔錶的觀察期是致勝關鍵。頂尖選手能在 15 秒內，計算出正面與背面所有指針的相對位置，並在腦海中規劃好完整的按鈕與齒輪轉動順序。'}, {name: 'Simul', desc: 'Simultaneous（同步執行）。打破傳統一次轉動一個齒輪的限制，透過雙手同時操作不同的齒輪，在極短的時間內讓多個指針同時歸位。'}, {name: 'No-Flip', desc: '最高階的魔錶技巧。透過對背面指針走向的精準記憶與推算，選手能在完全不翻轉魔錶的情況下，盲解背面的指針，省去翻面帶來的時間延遲。'}], videoId: '00jK2mDkJ6I' },
  { id: 'megaminx', title: '五魔方: Westlund', puzzle: 'Megaminx', desc: '優化五魔方的 F2L 與 S2L 順序，減少尋找方塊的時間。', steps: [{name: 'Star', desc: '與 3x3 的十字類似，在五魔方的底面（通常為白色）尋找五個邊塊，與側面中心對齊，建立一個完美的五角星，作為後續復原的穩固地基。'}, {name: 'F2L', desc: '利用 3x3 F2L 的概念，將底層的五個角塊與對應的邊塊配對並放入槽位。由於五魔方表面積大，這階段的重點在於快速掃描與尋找目標方塊。'}, {name: 'S2L', desc: 'Second 2 Layers。五魔方特有的階段，通常採用「U字型」或「螺旋型」的路徑，有系統地逐一完成側面的各個區塊，避免已完成的部分干擾後續觀察。'}, {name: 'LL', desc: 'Last Layer。五魔方的頂層變化遠多於 3x3，選手需要學習專屬的 OLL（翻轉頂面）與 PLL（排列頂層）公式，以最快速度完成最後的五角星與角塊。'}], videoId: 'oVRooYDvRqg' },
  { id: 'pyraminx', title: '金字塔: L4E / Oka', puzzle: 'Pyraminx', desc: '金字塔的進階解法，根據打亂狀態選擇最適合的方法。', steps: [{name: 'Top First', desc: '有別於傳統的層先法，進階解法通常會先完成頂部的角塊與中心，或是建立一個 V 字型的區塊，將剩餘的未解方塊集中在同一個區域。'}, {name: 'L4E', desc: 'Last 4 Edges。當剩下最後四個邊塊未歸位時，透過觀察它們的排列與翻轉狀態，從數十個 L4E 公式中選擇最佳解，一步到位完成復原。'}, {name: 'Oka/Nutella', desc: '金字塔的特殊進階技巧。當遇到特定的方塊分佈時，使用 Oka 或 Nutella 等特定的公式路徑，能以極少的步數強行跳過某些階段，達到極速復原。'}], videoId: 'CgVGH_3QsWs' },
  { id: 'sq1', title: 'Square-1: CSP', puzzle: 'Square-1', desc: 'Cube Shape Parity，在恢復正方體的同時預判並解決 Parity。', steps: [{name: 'CSP', desc: 'Cube Shape Parity。Square-1 最核心的進階技巧。在將不規則形狀恢復成正方體的同時，透過精密的觀察與公式選擇，主動消除後續可能出現的 Parity（奇偶校驗）問題。'}, {name: 'OBL', desc: 'Orientation of Both Layers。在恢復正方體後，使用一個公式同時將上下兩層的顏色翻轉一致（例如頂面全黃、底面全白），這需要極快的反應速度與公式熟練度。'}, {name: 'PBL', desc: 'Permutation of Both Layers。最後階段，觀察上下兩層方塊的排列狀態，使用一個長公式同時將上下兩層的角塊與邊塊交換至正確位置，完成整顆魔方。'}], videoId: 'JyGESj1ggMA' },
  { id: 'skewb', title: "斜轉: Sarah's Advanced", puzzle: 'Skewb', desc: '由 Sarah Strong 發明，包含大量的進階公式以應對各種情況。', steps: [{name: 'Layer', desc: '斜轉魔方的第一層包含一個中心與四個角塊。進階選手能透過觀察，在極少的步數內（通常不超過 4 步）利用方塊間的連動性，瞬間完成第一層。'}, {name: 'Advanced Cases', desc: "Sarah's Advanced 包含了上百個公式。核心目標是透過辨識頂層角塊的朝向與剩餘五個中心塊的分佈，直接使用一個公式同時解決所有剩下的方塊。"}], videoId: 'goK4vDhvSHE' },
  { id: '444bf', title: '4x4x4 盲解: 3-Style', puzzle: '4x4x4 Blindfolded', desc: '將 3-Style 應用於 4x4 的中心與邊塊。', steps: [{name: '中心 3-Style', desc: '將 3-Style 的換三邏輯應用於 4x4 的 24 個中心塊。由於中心塊沒有固定位置，記憶與執行時需要極高的空間概念，確保每個中心都被送往正確的面。'}, {name: '邊塊 3-Style', desc: '4x4 的邊塊分為左右兩片翼邊（Wing Edges）。盲解時必須精準區分這 24 個翼邊的位置與方向，使用特定的 Commutator 將它們逐一歸位。'}], videoId: 'Us0x_zcNSfU' },
  { id: '555bf', title: '5x5x5 盲解: 3-Style', puzzle: '5x5x5 Blindfolded', desc: '最高難度的單顆盲解，需要極大的記憶量與 3-Style 熟練度。', steps: [{name: '多重中心', desc: '5x5 擁有兩種類型的活動中心（+字型與X字型），共計 48 個中心塊。盲解時必須將這兩類中心分開編碼、分開記憶，並使用不同的 3-Style 公式集進行復原。'}, {name: '多重邊塊', desc: '除了 24 個翼邊外，5x5 還有 12 個如同 3x3 般的中邊（Mid-Edges）。這使得記憶量大幅增加，選手需要建構極度穩固的記憶宮殿來存放這些龐大的資訊。'}], videoId: 'apFafRSFXlo' },
  { id: '333mbf', title: '多顆盲解: 房間記憶法', puzzle: '3x3x3 Multi-Blind', desc: '挑戰人類記憶極限，世界紀錄可一次盲解 60 顆以上的魔方。', steps: [{name: '地點樁', desc: '多顆盲解的基石。選手必須在腦海中建立龐大且清晰的「記憶宮殿」，通常是自己熟悉的家、學校或街道，並在其中設定好固定順序的「地點樁」來存放記憶。'}, {name: '圖像連結', desc: '將枯燥的英文字母編碼，轉換為生動、誇張、甚至荒謬的圖像。將這些圖像與地點樁產生強烈連結，以確保在長時間的記憶過程中不會遺忘。'}, {name: '節奏控制', desc: '挑戰多顆盲解時，時間分配是關鍵。選手必須在「確保記憶穩固」與「避免超時」之間取得平衡，並在戴上眼罩後的漫長執行過程中，保持極度專注與穩定的節奏。'}], videoId: 'DKBg78f9DFs' },
];

export default function SpeedSolvingPage() {
  const [activeTab, setActiveTab] = useState(speedMethods[0].id);
  const activeMethod = speedMethods.find(m => m.id === activeTab) || speedMethods[0];

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <Helmet>
        <title>CFOP 速解公式大全 | OLL, PLL, F2L 進階技巧 - DNF Cuber</title>
        <meta name="description" content="整理最完整的 CFOP 速解公式表，包含 F2L, OLL, PLL 演算法。提供指法建議與記憶技巧，幫助你突破瓶頸，邁向 Sub-10！" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "CFOP 速解公式大全",
            "description": "整理最完整的 CFOP 速解公式表，包含 F2L, OLL, PLL 演算法。提供指法建議與記憶技巧，幫助你突破瓶頸，邁向 Sub-10！",
            "author": {
              "@type": "Organization",
              "name": "DNF Cuber"
            }
          })}
        </script>
      </Helmet>
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
