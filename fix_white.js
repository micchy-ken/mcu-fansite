import fs from 'fs';

function replaceTextWhite(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace text-white with text-slate-50
  content = content.replace(/\btext-white\b/g, 'text-slate-50');
  
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    // Revert for known colored buttons: red, amber, emerald, rose, gradient
    if (line.match(/bg-(red|amber|emerald|rose|gradient)/)) {
      return line.replace(/\btext-slate-50\b/g, 'text-white');
    }
    // Specific revert for DatabaseAdmin `text-slate-50 text-[10px]` which has bg-red-500 on the same component but maybe earlier in line
    if (line.includes('bg-red-500 text-slate-50')) {
      return line.replace(/\btext-slate-50\b/g, 'text-white');
    }
    return line;
  });
  
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
}

['src/App.tsx', 'src/components/DatabaseAdmin.tsx', 'src/components/DetailModal.tsx', 'src/components/StatsSection.tsx', 'src/components/HelpPage.tsx', 'src/components/McuCard.tsx'].forEach(replaceTextWhite);

console.log('done');
