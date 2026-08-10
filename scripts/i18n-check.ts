import fs from 'fs';
import path from 'path';

const localesDir = path.join(__dirname, '../src/i18n/locales');
const languages = fs.readdirSync(localesDir);

let hasError = false;

languages.forEach((lang) => {
  const langPath = path.join(localesDir, lang);
  if (!fs.statSync(langPath).isDirectory()) return;

  const files = fs.readdirSync(langPath);
  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(langPath, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
      } catch (err) {
        console.error(`Invalid JSON in ${lang}/${file}:`, err);
        hasError = true;
      }
    }
  });
});

if (hasError) {
  console.error('i18n check failed.');
  process.exit(1);
} else {
  console.log('i18n check passed. All JSON files are valid.');
}
