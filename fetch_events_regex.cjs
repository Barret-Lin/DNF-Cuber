const https = require('https');

https.get('https://1hrbld.tw/cubing-events-calendar/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/<article.*?<\/article>/gs);
    if (matches) {
      matches.forEach(m => {
        const title = m.match(/<h3[^>]*>(.*?)<\/h3>/)?.[1];
        const date = m.match(/(\d{4}\/\d{2}\/\d{2}.*?)</)?.[1] || m.match(/(\d{4}年\d{1,2}月\d{1,2}日.*?)</)?.[1];
        const location = m.match(/(?:地點|Location).*?>(.*?)<\//)?.[1] || m.match(/<span[^>]*>([^<]*?(市|縣|區|聚會|交流).*?)<\/span>/)?.[1];
        console.log({title, date, location});
      });
    }
  });
});
