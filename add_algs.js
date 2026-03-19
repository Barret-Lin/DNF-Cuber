const fs = require('fs');

function addAlgs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match the desc property that is the last property in the object
  // It looks for desc: '...', or desc: "...", or desc: `...` followed by optional whitespace and }
  const regex = /desc:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)\1\s*\}/g;
  
  const newContent = content.replace(regex, (match, quote, text) => {
    return `desc: ${quote}${text}${quote}, alg: "R U R' U'", setupAlg: "U R U' R'" }`;
  });
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Updated ${filePath}`);
}

addAlgs('src/pages/BasicTutorialsPage.tsx');
addAlgs('src/pages/SpeedSolvingPage.tsx');
