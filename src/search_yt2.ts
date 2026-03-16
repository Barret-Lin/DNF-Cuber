import https from 'https';

async function searchYouTube(query: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/"videoId":"([^"]{11})"/g)];
        const ids = [...new Set(matches.map(m => m[1]))];
        resolve(ids.slice(0, 5));
      });
    }).on('error', reject);
  });
}

async function run() {
  const queries = [
    'How to solve Rubik Clock tutorial',
    '3x3 FMC tutorial Rubik',
    '2x2 EG method tutorial',
    'Pyraminx L4E tutorial',
    'Square-1 CSP tutorial',
    'Skewb Sarah Advanced tutorial',
    'Clock 7-Simul tutorial',
    '3x3 Blindfolded 3-Style tutorial',
    '3x3 FMC Domino Reduction tutorial'
  ];

  for (const q of queries) {
    const ids = await searchYouTube(q);
    console.log(`${q}: ${ids.join(', ')}`);
  }
}

run();
