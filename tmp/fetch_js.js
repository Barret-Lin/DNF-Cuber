const https = require('https');
https.get('https://dnf-cuber.vercel.app/assets/index-BV0o1tm5.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/.{0,100}youtube.{0,100}/g);
    if (matches) {
      console.log(matches.slice(0, 20).join('\n---\n'));
    } else {
      console.log('No youtube matches');
    }
  });
});
