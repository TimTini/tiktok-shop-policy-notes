import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const metadata = JSON.parse(readFileSync(new URL('source-metadata.json', import.meta.url), 'utf8'));
const manifest = metadata.map(source => {
  const bytes = readFileSync(new URL(`downloads/${source.id}.html`, import.meta.url));
  const html = bytes.toString('utf8');
  const start = html.indexOf('data-essay-body');
  const end = start < 0 ? -1 : html.indexOf('</article>', start);
  const body = start >= 0 && end > start ? html.slice(start, end) : '';
  return {
    id: source.id,
    url: `https://seller-vn.tiktok.com/university/essay?knowledge_id=${source.id}&role=1&course_type=1&from=search&lang=vi-VN`,
    downloadedAt: '2026-10-26',
    file: `work/downloads/${source.id}.html`,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    hasRenderedArticle: body.length > 1000,
    articleHtmlLength: body.length,
    headings: (body.match(/<h[1-6]\b/g) || []).length,
    images: (body.match(/<img\b/g) || []).length,
    limitation: 'Raw public HTML; linked assets not downloaded, scripts not executed, offline rendering not verified.'
  };
});
writeFileSync(new URL('download-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest.map(({id,bytes,hasRenderedArticle,headings,images}) => ({id,bytes,hasRenderedArticle,headings,images})), null, 2));
