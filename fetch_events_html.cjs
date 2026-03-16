const https = require('https');

https.get('https://1hrbld.tw/cubing-events-calendar/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const parts = data.split('<h3 class="brxe-eaoypz brxe-heading">2026 高雄春季盲解賽</h3>');
    if (parts.length > 1) {
      console.log(parts[1].substring(0, 1000));
    }
  });
});
