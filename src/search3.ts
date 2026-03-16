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
