// Save images and other media embedded in documents/. Same /<id>~ name as the readers.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const mediaDir = path.join(root, 'media');
const IMAGE = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
const EXT = /\.(png|gif|jpe?g|webp|mp4|webm)(?:\?|$)/i;

function mediaName(url) {
  const id = String(url || '').match(/\/([A-Fa-f0-9]{16,})~/);
  const ext = String(url || '').match(EXT);
  if (!id || !ext) return '';
  const e = ext[1].toLowerCase() === 'jpeg' ? 'jpg' : ext[1].toLowerCase();
  return id[1] + '.' + e;
}

function assert(cond, msg) {
  if (!cond) {
    console.error(msg);
    process.exit(1);
  }
}

function readerShowsShots(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const script = html.split('<script>')[1].split('const OVERSCAN')[0];
  const ctx = vm.createContext({});
  vm.runInContext(script, ctx);
  const md = [
    '![](https://cdn.example/tos/3527f7f8691b48409c74f7b248c01ce0~tplv-image.png?x-expires=1)',
    '',
    'inline ![](https://cdn.example/tos/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa~tplv-image.gif?y=1)',
    '',
    'Nguồn có ảnh chụp màn hình.'
  ].join('\n');
  const blocks = ctx.parseDocument(md, false);
  const shot = blocks.find((b) => b.type === 'img');
  assert(shot && shot.html.includes('../media/3527f7f8691b48409c74f7b248c01ce0.png'), path.basename(htmlPath) + ' still drops screenshot blocks');
  assert(!shot.html.includes('Nguồn có ảnh chụp màn hình'), path.basename(htmlPath) + ' still replaces a screenshot with the label');
  const inline = blocks.find((b) => b.type === 'p' && b.html.includes('<img'));
  assert(inline && inline.html.includes('../media/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.gif'), path.basename(htmlPath) + ' still drops inline media');
  const label = blocks.find((b) => b.html.includes('Nguồn có ảnh chụp màn hình') && !b.html.includes('<img'));
  assert(label, path.basename(htmlPath) + ' lost the plain-text label');
}

function walk(dir, acc) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

function collect() {
  const map = new Map();
  let refs = 0;
  const unnamed = [];
  for (const file of walk(path.join(root, 'documents'), [])) {
    const text = fs.readFileSync(file, 'utf8');
    const from = path.relative(root, file);
    IMAGE.lastIndex = 0;
    for (const match of text.matchAll(IMAGE)) {
      refs++;
      const url = match[1];
      const name = mediaName(url);
      if (!name) {
        unnamed.push(from + ' ' + url);
        continue;
      }
      if (!map.has(name)) map.set(name, { url, file: name, from });
    }
  }
  return { map, refs, unnamed };
}

function sniff(buf) {
  if (buf.length >= 8 && buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') return 'png';
  if (buf.length >= 6 && buf.toString('ascii', 0, 3) === 'GIF') return 'gif';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8) return 'jpg';
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buf.length > 12 && buf.toString('ascii', 4, 8) === 'ftyp') return 'mp4';
  return '';
}

function get(url, hops) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'image/*,*/*',
        Referer: 'https://seller-vn.tiktok.com/'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && hops < 5) {
        res.resume();
        resolve(get(new URL(res.headers.location, url).href, hops + 1));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
  });
}

async function download(map) {
  fs.mkdirSync(mediaDir, { recursive: true });
  const items = [...map.values()];
  let cursor = 0;
  let saved = 0;
  let already = 0;
  const failed = [];
  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor++];
      const dest = path.join(mediaDir, item.file);
      if (fs.existsSync(dest) && sniff(fs.readFileSync(dest).subarray(0, 16))) {
        already++;
        continue;
      }
      try {
        const res = await get(item.url, 0);
        const kind = sniff(res.body);
        if (res.status !== 200 || !kind) {
          failed.push(item.file + ' HTTP ' + res.status + ' ' + res.body.length + (kind ? '' : ' not-media'));
          continue;
        }
        fs.writeFileSync(dest, res.body);
        saved++;
      } catch (err) {
        failed.push(item.file + ' ' + err.message);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  return { saved, already, failed };
}

function checkFixture() {
  const sample = '![shot](https://cdn.example/tos/3527f7f8691b48409c74f7b248c01ce0~tplv-image.png?x=1)\nNguồn có ảnh chụp màn hình.\n';
  const names = [...sample.matchAll(IMAGE)].map((m) => mediaName(m[1]));
  assert(names.length === 1 && names[0] === '3527f7f8691b48409c74f7b248c01ce0.png', 'screenshot markdown was excluded');
  readerShowsShots(path.join(root, 'mockups/tim-kiem-noi-bat.html'));
  readerShowsShots(path.join(root, 'mockups/tim-kiem.html'));
  console.log('check: screenshot sources are included');
}

async function main() {
  checkFixture();
  const { map, refs, unnamed } = collect();
  assert(unnamed.length === 0, 'image URL without /<id>~:\n' + unnamed.join('\n'));
  assert(map.size > 0, 'no embedded media in documents');
  if (process.argv.includes('--check')) {
    console.log(JSON.stringify({ refs, unique: map.size }, null, 2));
    return;
  }
  const result = await download(map);
  const examples = [...map.keys()].slice(0, 5);
  console.log(JSON.stringify({
    refs,
    unique: map.size,
    downloaded: result.saved,
    already: result.already,
    failed: result.failed.length,
    dir: 'media',
    examples
  }, null, 2));
  if (result.failed.length) {
    console.error(result.failed.slice(0, 30).join('\n'));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
