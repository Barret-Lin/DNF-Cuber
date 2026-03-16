import fs from 'fs';

async function searchYouTube(query: string) {
  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const text = await res.text();
    const match = text.match(/"videoId":"([^"]+)"/);
    if (match) {
      console.log(`${query}: ${match[1]}`);
    } else {
      console.log(`${query}: NOT FOUND`);
    }
  } catch (e) {
    console.error(`${query}: ERROR`);
  }
}

async function run() {
  await searchYouTube('Stanley Chapel 2:21.62 5x5 Blindfolded WR');
  await searchYouTube('Graham Siggins 62/65 Multi-Blind WR');
  await searchYouTube('Sebastiano Tronto 16 moves FMC WR');
  await searchYouTube('Dhruva Sai Meruva 5.66 OH WR');
  await searchYouTube('Brendyn Cortina 1.97 Clock WR');
  await searchYouTube('Leandro Martín López 23.18 Megaminx WR');
  await searchYouTube('Simon Kellum 0.73 Pyraminx WR');
  await searchYouTube('Ryan Pilat 3.41 Square-1 WR');
  await searchYouTube('Carter Kucala 0.75 Skewb WR');
}

run();
