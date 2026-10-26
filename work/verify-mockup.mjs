import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html = readFileSync(new URL('../mockup/index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script, 'Missing inline reader script');
new vm.Script(script);
const literal = script.match(/const articles = (\[[\s\S]*?\n    \]);/)?.[1];
assert(literal, 'Missing mockup article data');
const articles = vm.runInNewContext(`(${literal})`);
const sourceMetadata = JSON.parse(readFileSync(new URL('source-metadata.json', import.meta.url), 'utf8'));
assert.equal(articles.length, 6);
assert.equal(articles.flatMap(a => a.sections).length, 18);
assert.equal(articles.flatMap(a => a.sections).filter(s => s.paragraphs.length).length, 2);
for (const article of articles) {
  const source = sourceMetadata.find(a => a.id === article.id);
  assert(source, `Unknown source ${article.id}`);
  for (const section of article.sections) {
    assert(source.headings.some(h => h.anchor === section.anchor), `Invalid anchor: ${section.anchor}`);
  }
}
assert(html.includes('data-mode="summary" aria-pressed="true"'), 'Summary must be the default');
assert(!/<(?:script|link|img|iframe)\b[^>]*(?:src|href)\s*=/i.test(html), 'Unexpected external resource');
assert(!/\b(?:fetch\s*\(|XMLHttpRequest|WebSocket\s*\()/i.test(script), 'Unexpected network API');
console.log('Verified mockup: JS syntax, 6 articles, 18 source anchors, 2 demo sections, summary default, no external assets/network APIs.');
