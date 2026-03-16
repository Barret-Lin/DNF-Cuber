const https = require('https');

https.get('https://1hrbld.tw/cubing-events-calendar/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const events = [];
    const titles = data.match(/<h3 class="brxe-[^"]+ brxe-heading">(.*?)<\/h3>/g);
    titles.forEach(t => {
      const title = t.match(/>(.*?)</)[1];
      const parts = data.split(t);
      if (parts.length > 1) {
        const after = parts[1].substring(0, 1000);
        const date = after.match(/<p class="brxe-[^"]+ brxe-text-basic no-style-text">(.*?)<\/p>/)?.[1];
        const location = after.match(/<a class="brxe-[^"]+ brxe-text-basic no-style-text"[^>]*>(.*?)<\/a>/)?.[1];
        const link = after.match(/<a class="brxe-[^"]+ brxe-button[^"]*" href="(.*?)"/)?.[1];
        events.push({title, date, location, link});
      }
    });
    console.log(events);
  });
});
