import https from 'https';

const ids = [
  '1t1gJ-zQJSE', '_J2E01uP21g', '5OerYjT0pGg', 'b230h49TVkk', '30IF6qW3cNg', 'CgVGH_3QsWs',
  'JyGESj1ggMA', 'goK4vDhvSHE', '00jK2mDkJ6I', '9KPqwwKNldc'
];

async function checkVideo(id: string) {
  return new Promise((resolve) => {
    https.get(`https://img.youtube.com/vi/${id}/0.jpg`, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => {
      resolve({ id, status: 'error' });
    });
  });
}

async function run() {
  for (const id of ids) {
    const res = await checkVideo(id);
    console.log(`${(res as any).id}: ${(res as any).status}`);
  }
}

run();
