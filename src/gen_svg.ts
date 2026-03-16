import * as fs from 'fs';

const colors = ['#FFFFFF', '#FFD500', '#009E60', '#0051BA', '#C41E3A', '#FF5800'];
let colorIdx = 0;
function nextColor() {
  const c = colors[colorIdx % colors.length];
  colorIdx++;
  return c;
}

let svg = '';

// Top face
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const x0 = 50 - 13.33 * row + 13.33 * col;
    const y0 = 10 + 6.67 * row + 6.67 * col;
    const x1 = x0 + 13.33;
    const y1 = y0 + 6.67;
    const x2 = x0;
    const y2 = y0 + 13.33;
    const x3 = x0 - 13.33;
    const y3 = y0 + 6.67;
    svg += `    <path d="M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} L${x3.toFixed(2)} ${y3.toFixed(2)} Z" fill="${nextColor()}" stroke="#1A202C" strokeWidth="1.5" strokeLinejoin="round"/>\n`;
  }
}

// Left face
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const x0 = 10 + 13.33 * col;
    const y0 = 30 + 6.67 * col + 13.33 * row;
    const x1 = x0 + 13.33;
    const y1 = y0 + 6.67;
    const x2 = x1;
    const y2 = y1 + 13.33;
    const x3 = x0;
    const y3 = y0 + 13.33;
    svg += `    <path d="M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} L${x3.toFixed(2)} ${y3.toFixed(2)} Z" fill="${nextColor()}" stroke="#1A202C" strokeWidth="1.5" strokeLinejoin="round"/>\n`;
  }
}

// Right face
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const x0 = 50 + 13.33 * col;
    const y0 = 50 - 6.67 * col + 13.33 * row;
    const x1 = x0 + 13.33;
    const y1 = y0 - 6.67;
    const x2 = x1;
    const y2 = y1 + 13.33;
    const x3 = x0;
    const y3 = y0 + 13.33;
    svg += `    <path d="M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} L${x3.toFixed(2)} ${y3.toFixed(2)} Z" fill="${nextColor()}" stroke="#1A202C" strokeWidth="1.5" strokeLinejoin="round"/>\n`;
  }
}

fs.writeFileSync('svg_paths.txt', svg);
