const https = require('https');

https.get('https://www.worldcubeassociation.org/competitions?region=Taiwan&search=&state=present&year=all+years&from_date=&to_date=&delegate=&display=list', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/<a href="\/competitions\/[^"]+">.*?<\/a>/g);
    console.log("WCA links:", matches ? matches.length : 0);
    if (matches) {
      matches.slice(0, 10).forEach(m => console.log(m));
    }
  });
});
