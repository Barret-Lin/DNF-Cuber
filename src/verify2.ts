import https from 'https';

const ids = [
  'TxQStyDEwdU', 'pHBj8hixTfE', 'I6132yshkeU', 'xITr2WFqado'
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
