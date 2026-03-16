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
    console.error(e);
  }
}

async function run() {
  await searchYouTube('Max Park 3.13 3x3 WR');
  await searchYouTube('Teodor Zajder 0.43 2x2 WR');
  await searchYouTube('Max Park 15.71 4x4 WR');
  await searchYouTube('Max Park 32.52 5x5 WR');
  await searchYouTube('Max Park 58.03 6x6 WR');
  await searchYouTube('Max Park 1:34.15 7x7 WR');
  await searchYouTube('Tommy Cherry 12.00 3x3 Blindfolded WR');
  await searchYouTube('Stanley Chapel 51.96 4x4 Blindfolded WR');
  await searchYouTube('Stanley Chapel 2:21.62 5x5 Blindfolded WR');
  await searchYouTube('Graham Siggins 62/65 Multi-Blind WR');
  await searchYouTube('Sebastiano Tronto 16 moves FMC WR');
  await searchYouTube('Dhruva Sai Meruva 5.66 OH WR');
  await searchYouTube('Brendyn Cortina 1.97 Clock WR');
  await searchYouTube('Leandro Martín López 23.18 Megaminx WR');
  await searchYouTube('Simon Kellum 0.73 Pyraminx WR');
  await searchYouTube('Ryan Pilat 3.41 Square-1 WR');
  await searchYouTube('Carter Kucala 0.75 Skewb WR');
  
  await searchYouTube('J Perm 4x4 tutorial');
  await searchYouTube('J Perm 5x5 tutorial');
  await searchYouTube('J Perm 6x6 tutorial');
  await searchYouTube('J Perm 7x7 tutorial');
  await searchYouTube('J Perm 3x3 blindfolded tutorial');
  await searchYouTube('J Perm 3x3 one handed tutorial');
  await searchYouTube('J Perm megaminx tutorial');
  await searchYouTube('J Perm pyraminx tutorial');
  await searchYouTube('J Perm square-1 tutorial');
  await searchYouTube('J Perm skewb tutorial');
  await searchYouTube('J Perm clock tutorial');
  await searchYouTube('J Perm 4x4 blindfolded tutorial');
  await searchYouTube('J Perm 5x5 blindfolded tutorial');
  await searchYouTube('J Perm multi blind tutorial');
  await searchYouTube('J Perm FMC tutorial');
  
  await searchYouTube('J Perm CFOP tutorial');
  await searchYouTube('J Perm EG method 2x2');
  await searchYouTube('J Perm Yau method 4x4');
  await searchYouTube('J Perm Yau5 5x5');
  await searchYouTube('J Perm 3-style blindfolded');
}

run();
