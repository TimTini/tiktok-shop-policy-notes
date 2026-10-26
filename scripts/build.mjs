import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const summaries = JSON.parse(read('data/summaries.json'));
const metadata = JSON.parse(read('work/source-metadata.json'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
assert.equal(summaries.length, 6);
assert.equal(new Set(summaries.map(a => a.id)).size, 6);
let rowCount = 0;
const articles = summaries.map((article, i) => {
  const source = metadata.find(item => item.id === article.id);
  assert(source?.title && source?.date && source?.headings.length, article.id);
  assert(article.rows.length > 0);
  // Keep each article a short summary; the full material stays at its source.
  const words = [source.title, article.note || '', ...article.rows.flatMap(row => [row.title, row.summary])].join(' ').trim().split(/\s+/).length;
  assert(words <= 200, `${article.id}: summary too long (${words})`);
  const url = `https://seller-vn.tiktok.com/university/essay?knowledge_id=${article.id}&lang=vi-VN`;
  const rows = article.rows.map(row => {
    assert(row.title && row.summary && row.sections.length);
    rowCount++;
    const links = row.sections.map((index, n) => {
      const heading = source.headings[index];
      assert(heading?.anchor, `${article.id}: missing heading ${index}`);
      return `<li><a href="${escape(url + '#' + heading.anchor)}" target="_blank" rel="noopener noreferrer">Mở mục liên quan${row.sections.length > 1 ? ` (${n + 1})` : ''} ↗</a></li>`;
    }).join('');
    return `<tr><td><strong>${escape(row.title)}</strong><ul>${links}</ul></td><td>${escape(row.summary)}</td></tr>`;
  }).join('\n');
  return `<section id="article-${article.id}" aria-labelledby="title-${article.id}">
    <p class="eyebrow">BÀI ${String(i + 1).padStart(2, '0')} · ${escape(article.label)}</p>
    <h2 id="title-${article.id}">${escape(source.title)}</h2>
    <p class="meta">Ngày trên bài nguồn: <b>${escape(source.date)}</b> · <a href="${escape(url)}" target="_blank" rel="noopener noreferrer">Mở toàn bộ bài gốc ↗</a></p>
${article.note ? `<aside class="note"><b>Điểm cần đối chiếu:</b> ${escape(article.note)}</aside>` : ''}
    <div class="table-wrap" tabindex="0" role="region" aria-label="Bảng ${escape(article.label)}"><table><caption>${escape(article.label)} — đối chiếu theo mục</caption><thead><tr><th scope="col">Nội dung đầy đủ tại nguồn</th><th scope="col">Tóm tắt tra cứu</th></tr></thead><tbody>${rows}</tbody></table></div>
    <a class="back" href="#top">↑ Về mục lục</a>
  </section>`;
});

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; base-uri 'none'; form-action 'none'">
<title>TikTok Shop — Đối chiếu chính sách và tóm tắt</title>
<style>
:root{color-scheme:light;--ink:#173029;--muted:#5c6c64;--line:#dce4de;--accent:#15674d}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:#f5f7f4;color:var(--ink);font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}main{max-width:1180px;margin:auto;padding:48px 24px 64px}a{color:var(--accent);text-underline-offset:3px}a:hover{color:#0a402f}a:focus-visible,.table-wrap:focus-visible{outline:3px solid #edaa38;outline-offset:4px}header{border-top:5px solid var(--accent);padding-top:24px;margin-bottom:32px}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;color:var(--accent);margin:0 0 8px}h1{font-size:clamp(28px,4vw,44px);line-height:1.2;letter-spacing:-.035em;margin:0 0 18px;max-width:850px}h2{font-size:25px;line-height:1.35;margin:0 0 12px}header>p{max-width:850px}.lead{font-size:18px}.meta{font-size:14px;color:var(--muted)}.notice,.note{border-left:3px solid #d2a650;background:#fff8e8;padding:14px 18px;font-size:14px}.notice p{margin:0}.notice p+p{margin-top:8px}nav{margin-top:24px}nav ol{display:grid;grid-template-columns:repeat(3,1fr);list-style:none;padding:0;gap:10px;counter-reset:articles}nav li{counter-increment:articles}nav a{display:block;background:white;border:1px solid var(--line);border-radius:6px;padding:12px 15px;text-decoration:none;font-weight:600}nav a:before{content:counter(articles,decimal-leading-zero) "  ";color:var(--muted);font-size:12px;margin-right:8px}section{background:white;border:1px solid var(--line);border-radius:8px;margin:24px 0;padding:28px}.note{margin:16px 0}.table-wrap{overflow-x:auto;margin-top:22px}table{width:100%;border-collapse:collapse;table-layout:fixed;min-width:560px}caption{text-align:left;font-size:13px;color:var(--muted);padding-bottom:10px}th{background:#eaf2ec;text-align:left;font-size:14px;vertical-align:top}th:first-child{width:45%}th,td{border:1px solid var(--line);padding:17px 19px}td{vertical-align:top;overflow-wrap:anywhere}td:first-child{font-size:14px}td strong{font-size:15px}td ul{padding-left:18px;margin:8px 0 0}td li+li{margin-top:6px}td li a{color:#526b5e}tbody tr:nth-child(even){background:#fafcf9}.back{display:inline-block;font-size:13px;margin-top:18px}footer{font-size:13px;color:var(--muted)}@media(max-width:700px){main{padding:24px 12px}section{padding:18px 12px}nav ol{grid-template-columns:1fr 1fr}h2{font-size:22px}th,td{padding:12px}}@media print{body{background:white;font-size:11px}main{padding:0;max-width:none}nav,.back{display:none}section{padding:0;border:0;break-before:page}header{border:0}.table-wrap{overflow:visible}table{min-width:0}th,td{padding:8px}a{color:inherit}h1{font-size:28px}h2{font-size:20px}.notice,.note{background:white}tr{break-inside:avoid}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body><main id="top">
<header>
<p class="eyebrow">TIKTOK SHOP ACADEMY · VIỆT NAM</p>
<h1>Đọc theo từng mục.<br>Đối chiếu nhanh với bản gốc.</h1>
<p class="lead">Sáu bài hướng dẫn và chính sách, chia thành ${rowCount} nhóm nội dung. Cột trái dẫn đến mục trong toàn văn; cột phải ghi ý chính để tra cứu.</p>
<p class="meta">Kiểm tra nguồn ngày <b>26/10/2026</b> · Bản HTML đầu tiên · Đọc tóm tắt offline</p>
<div class="notice"><p><b>Về cột nội dung đầy đủ:</b> toàn văn thuộc TikTok Shop và được mở tại trang nguồn bằng liên kết ở từng dòng. File này không sao chép toàn văn hoặc hình ảnh của sáu bài.</p><p><b>Giới hạn bản tóm tắt:</b> giữ các ý chính và một số mốc cần nhớ; không bao quát hết ví dụ, bảng điểm, danh mục con hay bộ hồ sơ. Khi thực hiện, hãy mở mục nguồn để kiểm tra đủ yêu cầu và phiên bản mới nhất. Liên kết nguồn cần mạng; trang này không tự cập nhật.</p></div>
<nav aria-label="Mục lục sáu bài"><ol>${summaries.map(a => `<li><a href="#article-${a.id}">${escape(a.label)}</a></li>`).join('')}</ol></nav>
</header>
${articles.join('\n')}
<footer>Nguồn: TikTok Shop Academy. Bản tóm tắt biên soạn để tra cứu cá nhân; không phải hướng dẫn chính thức của TikTok Shop. Không có script, font/CDN, ảnh ngoài hoặc theo dõi.</footer>
</main></body></html>
`;

if (process.argv.includes('--check')) {
  assert.equal(read('index.html'), html, 'Run node scripts/build.mjs to refresh index.html');
  assert.equal((html.match(/<th scope="col">/g) || []).length, 12);
  assert(!/<(?:script|iframe|img)\b/i.test(html));
  assert(!/\b(?:src|srcset)\s*=/i.test(html));
  console.log(`Verified: 6 articles, ${rowCount} rows, 2 columns per table; anchors mapped to observed metadata; HTML current, no external resources.`);
} else {
  writeFileSync(new URL('index.html', root), html, 'utf8');
  console.log(`Built ${fileURLToPath(new URL('index.html', root))}: ${rowCount} rows.`);
}
