import https from 'https';

async function searchYouTube(query: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/"videoId":"([^"]{11})"/);
        if (match) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const queries = [
    'How to solve 7x7 Rubik cube tutorial',
    'How to solve Pyraminx tutorial',
    'How to solve Skewb tutorial',
    'How to solve Square-1 tutorial',
    'How to solve Rubik Clock tutorial',
    '3x3 FMC tutorial Rubik',
    '2x2 EG method tutorial',
    'Pyraminx L4E tutorial',
    'Square-1 CSP tutorial',
    'Skewb Sarah Advanced tutorial',
    'Clock 7-Simul tutorial',
    '3x3 Blindfolded 3-Style tutorial',
    '3x3 FMC Domino Reduction tutorial',
    'How to solve 2x2 Rubik cube tutorial'
  ];

  for (const q of queries) {
    const id = await searchYouTube(q);
    console.log(`${q}: ${id}`);
  }
}

run();
