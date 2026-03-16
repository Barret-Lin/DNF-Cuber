const https = require('https');

https.get('https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=TW&start=2026-01-01', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("WCA API:", json.length);
      json.forEach(c => console.log(c.name, c.start_date, c.end_date, c.city, c.event_ids.join(', ')));
    } catch (e) {
      console.log("Error parsing JSON:", e);
    }
  });
});
