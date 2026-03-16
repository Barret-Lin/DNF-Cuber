import https from 'https';

const ids = [
  '7Ron6MN45LY', 'R0yOKEQCRMQ', 'KWOZHbDdOeo', 'd1I-jJlVwB4', 'SkZ9UadAOvQ', '_Gg4_2tI18g',
  'ZZ41gWvltT8', 'nB2b9f3G_Zg', 'mUF3aPDTO-4', 'GzI1x_0h1bA', 'oVRooYDvRqg', 'xIQjnPEyEHQ',
  '0tX-fHk_kIQ', 'I6132oshEew', 'Us0x_zcNSfU', 'apFafRSFXlo', 'DKBg78f9DFs', 'GANbGhtCBTE'
];

async function checkVideo(id) {
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
    console.log(`${res.id}: ${res.status}`);
  }
}

run();
