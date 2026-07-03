const fs = require('fs');
const content = fs.readFileSync('src/components/landing/HowItWorksSection.tsx', 'utf8');
const lines = content.split('\n');
let result = [];
let state = 'NORMAL'; // NORMAL, UPSTREAM, STASHED
let nestedCount = 0;

for (const line of lines) {
  if (line.startsWith('<<<<<<< Updated upstream')) {
    if (state === 'NORMAL') state = 'UPSTREAM';
    else nestedCount++;
  } else if (line.startsWith('=======')) {
    if (nestedCount === 0) {
      if (state === 'UPSTREAM') state = 'STASHED';
    }
  } else if (line.startsWith('>>>>>>> Stashed changes')) {
    if (nestedCount === 0) {
      if (state === 'STASHED') state = 'NORMAL';
    } else {
      nestedCount--;
    }
  } else {
    if (state === 'NORMAL' || state === 'UPSTREAM') {
      result.push(line);
    }
  }
}
fs.writeFileSync('src/components/landing/HowItWorksSection.tsx', result.join('\n').replace(/Frameful/g, "Cutline").replace(/FrameFul/g, "Cutline"));
