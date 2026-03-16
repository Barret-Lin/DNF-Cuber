const https = require('https');

https.get('https://1hrbld.tw/cubing-events-calendar/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.substring(0, 2000));
    const events = data.match(/<h[234].*?>.*?<\/h[234]>/g);
    console.log("Events:", events);
  });
});

https.get('https://www.worldcubeassociation.org/competitions?region=Taiwan&search=&state=present&year=all+years&from_date=&to_date=&delegate=&display=list', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/<div class="competition-info">.*?<\/div>/gs);
    console.log("WCA:", matches ? matches.length : 0);
    if (matches) {
      matches.slice(0, 10).forEach(m => console.log(m.substring(0, 200)));
    }
  });
});
