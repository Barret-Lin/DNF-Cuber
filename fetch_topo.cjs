const https = require('https');

https.get('https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.topo.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("TopoJSON loaded, objects:", Object.keys(json.objects));
    } catch (e) {
      console.log("Error parsing JSON:", e);
    }
  });
});
