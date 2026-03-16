const https = require('https');

https.get('https://1hrbld.tw/cubing-events-calendar/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/<article.*?<\/article>/gs);
    if (matches) {
      matches.forEach(m => {
        const title = m.match(/<h3 class="brxe-[^"]+ brxe-heading">(.*?)<\/h3>/)?.[1];
        const date = m.match(/<span class="brxe-text-basic">(2026.*?)<\/span>/)?.[1];
        const location = m.match(/<span class="brxe-text-basic">([^<]*?(市|縣|區|聚會|交流).*?)<\/span>/)?.[1];
        const events = m.match(/<div class="brxe-text-basic">(.*?)<\/div>/)?.[1];
        console.log({title, date, location, events});
      });
    }
  });
});
