import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../content');

const enPath = path.join(contentDir, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const targetLocales = ['fr', 'ar', 'zh'];

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    keys.push(fullPath);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullPath));
    }
  }
  return keys;
}

const enKeys = new Set(getAllKeys(en));

let hasError = false;

for (const loc of targetLocales) {
  const locPath = path.join(contentDir, `${loc}.json`);
  if (!fs.existsSync(locPath)) {
    console.error(`[check:i18n] Error: Missing locale file: ${loc}.json`);
    hasError = true;
    continue;
  }

  const data = JSON.parse(fs.readFileSync(locPath, 'utf8'));
  const locKeys = new Set(getAllKeys(data));

  const missingKeys = [];
  for (const key of enKeys) {
    if (!locKeys.has(key)) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    console.error(`[check:i18n] Error: ${loc}.json is missing ${missingKeys.length} key(s):`);
    for (const k of missingKeys) {
      console.error(`  - ${k}`);
    }
    hasError = true;
  } else {
    console.log(`[check:i18n] OK: ${loc}.json has all ${enKeys.size} keys.`);
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('[check:i18n] All locale files are completely in sync with en.json!');
}
