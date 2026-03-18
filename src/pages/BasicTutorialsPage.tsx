import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PlayCircle, ChevronDown, ExternalLink } from 'lucide-react';

const tutorials = [
  { id: '333', title: '3x3x3 層先法', puzzle: '3x3x3 Cube', steps: [{name: '底層十字 (Cross)', desc: '這是復原的基石。首先，在頂面（通常是黃色中心）周圍尋找帶有白色的邊塊，將它們像花瓣一樣圍繞黃色中心。接著，將這些「白色花瓣」側邊的顏色，與對應的側面中心塊對齊，然後轉動 180 度送到底部。完成後，底部會形成一個完美的白色十字，且側邊顏色皆與中心一致。'}, {name: '底層角塊 (First Layer)', desc: "尋找帶有白色的角塊。觀察角塊上另外兩個顏色，將角塊轉動到這兩個顏色對應的中心塊之間。使用基本公式（如 R U R' U'）將角塊放入底層。重複此動作，直到四個角塊都歸位，此時第一層（包含底面）將完全復原，側面會呈現倒 T 字型。"}, {name: '第二層邊塊 (Second Layer)', desc: '將視線移至頂層，尋找「不包含黃色」的邊塊。將該邊塊側面的顏色與對應的中心塊對齊，形成一個倒 T 字。觀察邊塊頂部的顏色，判斷它應該放入左邊還是右邊的槽位，並使用對應的左/右公式將其放入。完成四個邊塊後，前兩層 (F2L) 即告完成。'}, {name: '頂層十字 (Top Cross)', desc: "觀察頂層黃色邊塊的形狀。你可能會看到：一個點、一個小拐角（L型）、一條直線（一字型），或是已經完成的十字。根據不同的形狀，使用特定的公式（如 F R U R' U' F'）來翻轉邊塊，直到頂面出現一個黃色十字。不用理會角塊的顏色。"}, {name: '頂面顏色 (OLL 基礎)', desc: "現在要讓頂面全部變成黃色。觀察頂層四個角塊的黃色朝向。將魔方轉到特定的角度（例如讓一個黃色朝前的角塊放在左前角），然後重複使用基本公式（如 R U R' U R U2 R'），直到頂面完全被黃色填滿。"}, {name: '頂層角塊 (PLL 角塊)', desc: '觀察頂層側面的角塊顏色。尋找是否有兩個相鄰角塊顏色相同的「車頭燈」。如果有，將車頭燈放在左側或後方，使用公式將所有角塊移動到正確位置。如果沒有車頭燈，隨意執行一次公式就會出現。完成後，四個面的角塊顏色都會對齊。'}, {name: '頂層邊塊 (PLL 邊塊)', desc: '最後一步！觀察頂層側面的邊塊。通常會有一個面的顏色已經完全連線，將那個面放在後方。觀察剩下三個邊塊需要順時針還是逆時針交換，使用最後的公式（如 U-Perm）將邊塊互相交換。恭喜你，完成整顆魔術方塊！'}], videoId: '7Ron6MN45LY' },
  { id: '222', title: '2x2x2 基礎解法', puzzle: '2x2x2 Cube', steps: [{name: '底層完成 (First Layer)', desc: '2x2 沒有中心塊作為參考，因此任選一個帶有白色的角塊作為起點。尋找另一個帶有白色，且與起點角塊有共通顏色的角塊。使用 3x3 的底層角塊公式將其放入。確保放入後，底層側面的顏色是相連且一致的。'}, {name: '頂面翻色 (OLL)', desc: '將魔方翻轉，讓未完成的面朝上。觀察頂層角塊的黃色朝向。這部分的邏輯與 3x3 的「頂面顏色」步驟完全相同，使用相同的公式將頂面四個角塊全部翻成黃色。'}, {name: '頂層排列 (PLL)', desc: '觀察頂層側面的顏色。尋找是否有兩個相鄰顏色相同的角塊（車頭燈）。如果有，將其對齊底層顏色並放在左側或後方，使用 3x3 的角塊排列公式（如 T-Perm 或 Y-Perm）將其交換至正確位置，完成復原。'}], videoId: 'GANnG5a19kg' },
  { id: '444', title: '4x4x4 降階法', puzzle: '4x4x4 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '4x4 沒有固定的中心塊。首先，在任意面組合出四個白色的中心塊。接著，在對面組合出四個黃色的中心塊。然後，依序完成側面的藍、紅、綠、橘中心。務必牢記正確的顏色相對位置（例如：白上黃下時，藍的右邊是紅），否則最後無法復原。'}, {name: '邊塊配對 (Edge Pairing)', desc: '尋找兩個顏色完全相同的邊塊。透過轉動外層，將它們移動到同一個軌道上（通常是一左一右）。轉動中間層將它們結合，然後替換入一個未完成的廢邊，再將中間層轉回以修復中心。重複此動作，完成所有 12 組邊塊。'}, {name: '3x3 階段復原', desc: '現在，將配對好的邊塊視為 3x3 的單一邊塊，四個一組的中心視為 3x3 的單一中心。使用你熟悉的 3x3 層先法或 CFOP 進行復原。'}, {name: '處理特殊情況 (Parity)', desc: '在 3x3 階段，你可能會遇到 3x3 不可能出現的情況。如果頂層十字無法完成（單邊翻轉），這是 OLL Parity；如果最後只剩兩個邊塊互換，這是 PLL Parity。必須背誦並使用 4x4 專屬的長公式來解決這些奇偶校驗問題。'}], videoId: 'KWOZHbDdOeo' },
  { id: '555', title: '5x5x5 降階法', puzzle: '5x5x5 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '5x5 有固定的中心點。以固定中心為基準，先將周圍的 8 個中心塊組合成一個 1x3 的長條，再將三個長條合併，完成一個 3x3 大小的中心區塊。依序完成白、黃，以及側面的四個中心。'}, {name: '邊塊配對 (Edge Pairing)', desc: '尋找三個顏色相同的邊塊（一個中邊，兩個翼邊）。利用中間層的轉動，將它們組合成一個完整的長條邊塊。這階段通常使用 Free Slice 技巧，在不破壞已配對邊塊的前提下，高效率地完成 12 組邊塊。'}, {name: '3x3 階段復原', desc: '將組合好的巨大邊塊與 3x3 大小的中心區塊，視為一顆標準的 3x3 魔術方塊。使用 3x3 的方法進行復原。'}, {name: '處理特殊情況 (Parity)', desc: '5x5 作為奇數階魔方，不會出現 PLL Parity。但如果在組邊的最後階段（L4E），發現剩下兩個邊塊無法正常配對（單邊翻轉），則需要使用 5x5 的 Edge Parity 公式來解決。'}], videoId: 'd1I-jJlVwB4' },
  { id: '666', title: '6x6x6 降階法', puzzle: '6x6x6 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '6x6 同樣沒有固定中心。需要將 16 個同色中心塊組合在一起。通常採用「由內而外」的策略，先建構內側的 2x2 中心，再逐步擴展到 4x4。務必隨時確認顏色相對位置的正確性。'}, {name: '邊塊配對 (Edge Pairing)', desc: '將四個顏色相同的邊塊組合成一組。由於邊塊數量眾多，尋找方塊會花費大量時間。建議有系統地按照顏色分類尋找，並善用多重軌道同時進行配對。'}, {name: '3x3 階段與 Parity', desc: '降階完成後，使用 3x3 方法復原。與 4x4 相同，6x6 屬於偶數階，因此在最後階段極有可能遇到 OLL Parity 與 PLL Parity，需使用對應的公式解決。'}], videoId: 'SkZ9UadAOvQ' },
  { id: '777', title: '7x7x7 降階法', puzzle: '7x7x7 Cube', steps: [{name: '完成六面中心 (Centers)', desc: '以固定中心為基準，將周圍的 24 個中心塊組合起來，完成 5x5 大小的中心區塊。這是一個考驗耐心的過程，建議使用長條建構法（Bar building）逐一完成。'}, {name: '邊塊配對 (Edge Pairing)', desc: '將五個顏色相同的邊塊組合成一組。在龐大的方塊群中尋找目標是一大挑戰。熟練後可結合 Free Slice 技巧，一次處理多組邊塊以提高效率。'}, {name: '3x3 階段與 Parity', desc: '將其視為一顆巨大的 3x3 進行復原。7x7 結構複雜，轉動時務必保持平穩。最後可能會遇到類似 5x5 的單邊翻轉特殊情況（Edge Parity）。'}], videoId: 'TxQStyDEwdU' },
  { id: '333bf', title: '3x3x3 盲解 (OP法)', puzzle: '3x3x3 Blindfolded', steps: [{name: '編碼系統 (Coding)', desc: '盲解的第一步是建立語言。為魔術方塊的每一個角塊與邊塊的「每一個面」分配一個英文字母或注音符號。例如，白橘綠角塊的白色面是 A，橘色面是 B，綠色面是 C。'}, {name: '記憶路線 (Memorization)', desc: '觀察打亂的方塊。從一個固定的「緩衝區」開始，看該位置的方塊應該去哪裡（例如去字母 K 的位置），接著看 K 位置的方塊應該去哪裡。將這些字母串連起來，編成有意義的詞彙或故事（例如 K-T 變成「客廳」）來加深記憶。'}, {name: '執行復原 (Execution)', desc: '戴上眼罩。使用 Old Pochmann (OP) 方法，這是一種「每次只交換兩個方塊」的技術。透過特定的 Setup 動作將目標方塊移至交換區，執行交換公式（如 T-Perm 或 Y-Perm），再將 Setup 動作逆轉復原。逐一解碼並執行，直到魔方復原。'}], videoId: 'ZZ41gWvltT8' },
  { id: '333fm', title: '3x3x3 最少步數基礎', puzzle: '3x3x3 Fewest Moves', steps: [{name: '區塊建構 (Blockbuilding)', desc: 'FMC 的核心是打破常規。不要受限於十字或層先法。優先在魔方的角落尋找機會，利用極少的步數建立一個 2x2x2 的已復原區塊（通常在 4-6 步內完成）。'}, {name: '擴展區塊 (F2L-1)', desc: '將建構好的 2x2x2 區塊，進一步擴展為 2x2x3 的長方體。接著，嘗試完成前兩層，但刻意保留一個 F2L 槽位不解（稱為 F2L-1）。這個空槽將作為後續調整邊塊方向的緩衝區。'}, {name: '邊塊翻正與頂層 (EO & LL)', desc: '利用保留的空槽，提早將所有未歸位邊塊的方向翻正（Edge Orientation）。這能大幅簡化最後頂層（LL）的狀態，讓你有機會使用極短的公式，甚至跳過某些步驟來完成復原。'}], videoId: 'b230h49TVkk' },
  { id: '333oh', title: '3x3x3 單手基礎', puzzle: '3x3x3 One-Handed', steps: [{name: '正確握法 (Grip)', desc: "單手解法通常使用左手。以小指與無名指穩固地支撐方塊底部（D面），拇指放在前方（F面），中指與食指負責控制上方（U面）與右方（R面）的轉動。正確的握法是流暢轉動的前提。"}, {name: '單手指法 (Fingertricks)', desc: "練習單手專屬的撥動技巧。例如：使用左手食指「推」或「拉」來完成 U 和 U'；使用小指撥動 D 層；透過手腕的轉動來帶動 R 層。避免整隻手離開魔方去抓取。"}, {name: '公式優化 (Algorithm Choice)', desc: '雙手好轉的公式，單手不一定好轉。避免使用需要大量 F、B 或雙層轉動（如 r, l）的公式。尋找並替換為以 R、U、L 轉動為主的單手專用公式，並善用 z 或 y 的整體翻轉來創造順手的角度。'}], videoId: 'mUF3aPDTO-4' },
  { id: 'clock', title: '魔錶基礎解法', puzzle: 'Clock', steps: [{name: '正面十字 (Cross)', desc: '魔錶的目標是讓所有指針指向 12 點。首先，按下特定的按鈕組合，轉動角落的齒輪，將正面的四個邊針（上、下、左、右）與中心的指針對齊。然後，將這五個指針一起轉向 12 點。'}, {name: '背面十字與角針', desc: '將魔錶翻面。重複正面的步驟，完成背面的十字並指向 12 點。接著，透過控制按鈕的升降，逐一將四個角落的指針與中心的十字指針對齊。'}, {name: '同步歸位 (Finish)', desc: '當所有角針都與中心對齊後，將四個按鈕全部按上（或全部按下，取決於你的解法習慣）。轉動任一齒輪，將所有指針同步轉向 12 點，魔錶即告復原。'}], videoId: '5OerYjT0pGg' },
  { id: 'megaminx', title: '五魔方基礎解法', puzzle: 'Megaminx', steps: [{name: '白色星形 (Star)', desc: '五魔方的結構類似 3x3，只是面數變多。首先在白色面尋找五個帶有白色的邊塊，將它們的側面顏色與對應的中心對齊，形成一個完美的白色五角星。'}, {name: '底層與第二層 (F2L)', desc: '使用與 3x3 相同的 F2L 概念。尋找帶有白色的角塊與對應的邊塊，將它們配對後放入白色星形周圍的五個槽位，完成底部的一個半球體。'}, {name: '側面延伸 (S2L)', desc: '這是五魔方最耗時的階段。依序選擇側面的顏色（例如：藍、紅、綠、紫、黃），像蓋房子一樣，逐一完成各個顏色的星形與 F2L，逐步向上推進，直到只剩下最後一個頂面（通常是灰色）。'}, {name: '頂層復原 (LL)', desc: '最後的灰色頂面。使用類似 3x3 的方法：先完成灰色星形（邊塊方向），再調整邊塊位置，接著翻轉角塊的灰色朝上，最後排列角塊位置，完成整顆五魔方。'}], videoId: 'oVRooYDvRqg' },
  { id: 'pyraminx', title: '金字塔基礎解法', puzzle: 'Pyraminx', steps: [{name: '角塊與中心 (Tips & Centers)', desc: '金字塔最外側的四個小角塊（Tips）只會自己旋轉，不會改變位置。先將它們轉到與相鄰顏色一致。接著，尋找三個同色的中心塊（例如黃色），轉動大角，將這三個中心塊集中到同一個面上。'}, {name: '完成底層 (First Layer)', desc: '將剛才集中的黃色面朝下作為底面。在上方尋找帶有黃色的邊塊，將其側面顏色與中心對齊，使用簡單的「下下上上」公式將其放入底層。完成三個邊塊後，第一層即告完成。'}, {name: '頂層復原 (Last Layer)', desc: '觀察剩下的三個邊塊。轉動頂層讓中心塊對齊。根據邊塊的排列狀態（例如：三個邊塊順時針輪換、兩個邊塊原地翻轉等），使用對應的基本公式（通常只有 4-5 種情況）將其歸位。'}], videoId: 'pHBj8hixTfE' },
  { id: 'sq1', title: 'Square-1 基礎解法', puzzle: 'Square-1', steps: [{name: '復原形狀 (Cube Shape)', desc: 'Square-1 打亂後形狀會改變。第一步是透過特定的轉動步驟，將上下層的 8 個角塊與 8 個邊塊集中並配對，最終將其恢復成標準的正方體形狀。這是初學者最容易卡關的步驟。'}, {name: '角塊分色 (CO)', desc: '形狀復原後，目標是將顏色分開。首先處理角塊：將白色的角塊全部集中到頂層，黃色的角塊全部集中到底層（不需理會側面顏色）。'}, {name: '邊塊分色 (EO)', desc: '接著處理邊塊：使用公式將白色的邊塊全部交換到頂層，黃色的邊塊交換到底層。完成後，頂面會是全白（或全黃），底面則是另一種顏色。'}, {name: '排列歸位 (CP & EP)', desc: '最後階段。先觀察上下層角塊的側面顏色，使用公式將角塊移動到正確位置（CP）。接著觀察邊塊，使用公式將邊塊互相交換至正確位置（EP）。若遇到上下層各剩兩個邊塊互換的情況，即為 Parity，需使用特殊公式解決。'}], videoId: 'xITr2WFqado' },
  { id: 'skewb', title: '斜轉基礎解法', puzzle: 'Skewb', steps: [{name: '完成底層 (First Layer)', desc: '斜轉的轉動軸在角落。任選一個顏色作為底面中心（例如白色）。尋找四個帶有白色的角塊，透過角塊的旋轉，將它們轉入底層，並確保角塊側面的顏色與相鄰角塊一致。'}, {name: '頂層角塊翻轉 (Top Corners)', desc: '觀察頂層四個角塊的黃色朝向。斜轉有一個非常核心的基本公式：「下下上上」（Sledgehammer）。根據黃色角塊朝向的不同模式（如兩個朝上、零個朝上），重複使用此公式將四個角塊翻轉至黃色朝上。'}, {name: '中心塊歸位 (Centers)', desc: '角塊完成後，觀察剩餘未歸位的中心塊。將需要移動到頂面的中心塊放在後方（B面），再次使用「下下上上」公式，配合魔方的整體翻轉（y2），將所有中心塊復原。'}], videoId: 'I6132yshkeU' },
  { id: '444bf', title: '4x4x4 盲解基礎', puzzle: '4x4x4 Blindfolded', steps: [{name: '中心記憶與執行 (Centers)', desc: '4x4 有 24 個中心塊。為每個中心塊的位置編碼。記憶時，使用 U2 法（一種每次交換三個中心塊的技術）追蹤方塊的去向。執行時，透過 Setup 動作與 U2 公式將中心塊逐一歸位。'}, {name: '邊塊記憶與執行 (Edges)', desc: '4x4 有 24 個翼邊。同樣進行編碼。記憶時，使用 r2 法追蹤邊塊。由於 r2 轉動會改變某些邊塊的位置，記憶與執行時需特別注意奇偶數步的差異與邊塊的方向性。'}, {name: '角塊記憶與執行 (Corners)', desc: '角塊部分與 3x3 盲解完全相同。通常使用 OP 法進行編碼、記憶與執行。最後，若中心、邊塊或角塊的交換次數為奇數，需使用特定的 Parity 公式進行修正。'}], videoId: 'Us0x_zcNSfU' },
  { id: '555bf', title: '5x5x5 盲解基礎', puzzle: '5x5x5 Blindfolded', steps: [{name: '多重中心 (Centers)', desc: '5x5 包含 24 個 +字中心與 24 個 X字中心。這兩類中心互不干擾，需分別建立編碼系統進行記憶。復原時，通常皆採用 U2 法，分兩次將 +字與 X字中心歸位。'}, {name: '多重邊塊 (Edges)', desc: '包含 12 個中邊（同 3x3）與 24 個翼邊（同 4x4）。中邊通常使用 M2 法復原，翼邊則使用 r2 法復原。需分別記憶這兩組邊塊的路線。'}, {name: '角塊與執行 (Execution)', desc: '角塊同 3x3。5x5 盲解的整體記憶量非常龐大（約需記憶 50-60 個字母），強烈建議使用「記憶宮殿」法，將編碼轉換為圖像並放置於熟悉的空間中，以確保記憶的穩定性。'}], videoId: 'apFafRSFXlo' },
  { id: '333mbf', title: '多顆盲解基礎', puzzle: '3x3x3 Multi-Blind', steps: [{name: '記憶宮殿 (Memory Palace)', desc: '這是多顆盲解的核心。在腦海中建立一個或多個熟悉的空間路線（如自己的家、學校、上班路線），並在路線上規劃好固定順序的「地點樁」（如沙發、電視、冰箱），用來存放每顆魔方的記憶。'}, {name: '大量記憶 (Memorization)', desc: '依序觀察每一顆魔方。將解碼得到的英文字母轉換為生動、誇張的圖像（例如 AB 變成蘋果）。將這些圖像依序放置於記憶宮殿的地點樁上。透過空間的連結，大腦能儲存遠超乎想像的資訊量。'}, {name: '連續執行 (Execution)', desc: '完成所有魔方的記憶後，戴上眼罩。在腦海中重新走過記憶宮殿，走到第一個地點，提取圖像，還原成字母編碼，然後執行復原。接著走向下一個地點，重複此過程，直到所有魔方復原。'}], videoId: 'DKBg78f9DFs' },
];

export default function BasicTutorialsPage() {
  const [activeTab, setActiveTab] = useState(tutorials[0].id);
  const activeTutorial = tutorials.find(t => t.id === activeTab) || tutorials[0];

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <Helmet>
        <title>魔術方塊基礎教學 | 3x3 新手入門圖文與影片指南 - DNF Cuber</title>
        <meta name="description" content="專為新手設計的 3x3 魔術方塊基礎教學。從認識結構、底層十字、到完成六面，提供詳細圖文與精選影片，帶你輕鬆學會解魔術方塊！" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "魔術方塊基礎教學",
            "description": "專為新手設計的 3x3 魔術方塊基礎教學。從認識結構、底層十字、到完成六面，提供詳細圖文與精選影片，帶你輕鬆學會解魔術方塊！",
            "provider": {
              "@type": "Organization",
              "name": "DNF Cuber",
              "sameAs": "https://dnfcuber.com"
            }
          })}
        </script>
      </Helmet>
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
