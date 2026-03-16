const https = require('https');

https.get('https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=TW&start=2026-03-16', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("WCA API:", json.length);
      json.slice(0, 5).forEach(c => console.log(c.name, c.start_date, c.end_date, c.city, c.event_ids));
    } catch (e) {
      console.log("Error parsing JSON:", e);
      console.log(data.substring(0, 500));
    }
  });
});
