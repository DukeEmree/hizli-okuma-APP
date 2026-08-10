const fs = require('fs');
const glob = require('glob'); // Not installed? We can use recursive readdir
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('$colorSubtitle')) {
    content = content.replace(/\$colorSubtitle/g, '$color11');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
