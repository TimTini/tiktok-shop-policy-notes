// Exercise the reader's actual Markdown parser without opening a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'mockups/tim-kiem-noi-bat.html'), 'utf8');
const sources = JSON.parse(html.match(/^const SOURCES = (\[.*\]);$/m)[1]);
const script = html.split('<script>')[1].split('const OVERSCAN')[0];
const ctx = vm.createContext({});
vm.runInContext(script, ctx);
const updated = [];
for (const before of sources) {
  const id = before.match(/^- knowledge_id: (\d+)$/m)[1];
  const folder = fs.readdirSync(path.join(root, 'documents')).find(name => name.startsWith(id + '-'));
  const after = fs.readFileSync(path.join(root, 'documents', folder, 'noi-bat.md'), 'utf8').replace(/\r\n/g, '\n');
  const strip = text => text.replace(/<\/?mark>/g, '');
  assert(strip(after) === strip(before), `${id}: policy text changed beyond mark tags`);
  for (const [index, line] of after.split('\n').entries()) {
    let depth = 0;
    for (const tag of line.match(/<\/?mark>/g) || []) {
      depth += tag === '<mark>' ? 1 : -1;
      assert(depth === 0 || depth === 1, `${id}:${index + 1}: nested/unmatched mark`);
    }
    assert.equal(depth, 0, `${id}:${index + 1}: unclosed mark`);
  }
  const oldBlocks = ctx.parseDocument(before, false);
  const blocks = ctx.parseDocument(after, false);
  assert(JSON.stringify(blocks.map(b => b.type)) === JSON.stringify(oldBlocks.map(b => b.type)), `${id}: block structure changed`);
  const rendered = blocks.map(b => b.html).join('\n');
  const count = text => (text.match(/<mark>/g) || []).length;
  assert.equal(count(rendered), count(after), `${id}: every highlight rendered`);
  assert.equal((rendered.match(/<\/mark>/g) || []).length, count(after), `${id}: all highlights close`);
  assert(!/<mark>\s*(?:\||> |[-*] |\d+\. )/m.test(after), `${id}: marks inside Markdown structure`);
  updated.push(after);
  console.log(`OK ${id}: ${blocks.length} blocks, ${count(after)} rendered highlights`);
}
if (process.argv.includes('--write')) {
  const embedded = JSON.stringify(updated).replace(/</g, '\\u003c');
  fs.writeFileSync(path.join(root, 'mockups/tim-kiem-noi-bat.html'), html.replace(/^const SOURCES = (\[.*\]);$/m, () => `const SOURCES = ${embedded};`));
  console.log('Updated offline reader; policy text and block structure preserved.');
} else {
  assert(JSON.stringify(updated) === JSON.stringify(sources), 'Reader out of sync: run node work/verify-highlights.cjs --write');
  console.log('Reader matches all six Markdown sources.');
}
