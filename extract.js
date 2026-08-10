const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Asus/Desktop/PROJECTS/Cv_olusturucu';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const texts = new Set();
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  // Remove script and style tags
  const clean = content.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  const matches = clean.match(/>([^<]+)</g);
  if(matches) matches.forEach(m => {
    const t = m.slice(1, -1).trim();
    if(t && t.length > 1 && !/^[0-9\W]+$/.test(t)) texts.add(t);
  });
  const placeholders = clean.match(/placeholder=\"([^\"]+)\"/g);
  if(placeholders) placeholders.forEach(p => {
    texts.add(p.replace('placeholder=\"', '').slice(0, -1).trim());
  });
});
console.log(JSON.stringify(Array.from(texts), null, 2));
