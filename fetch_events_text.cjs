const https = require('https');

https.get('https://1hrbld.tw/cubing-events-calendar/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const text = data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(text.substring(0, 2000));
    console.log(text.substring(2000, 4000));
  });
});
