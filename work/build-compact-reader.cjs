const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const documentsDir = path.join(root, "documents");
const orderPath = path.join(root, "mockups", "tim-kiem-noi-bat.html");
const shellPath = path.join(root, "tim-kiem-co-dong.html");
const outputPath = shellPath;
const expectedCount = 6;

function extractSources(html, label) {
  const match = html.match(/^const SOURCES = (\[.*\]);$/m);
  if (!match) throw new Error(`${label}: không tìm thấy mảng SOURCES.`);
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`${label}: SOURCES không phải JSON hợp lệ: ${error.message}`);
  }
}

function articleId(markdown, file) {
  const match = markdown.match(/^- knowledge_id: (\d+)\s*$/m);
  if (!match) throw new Error(`${file}: thiếu dòng knowledge_id.`);
  return match[1];
}

function headingLines(markdown) {
  return markdown.split(/\r?\n/).filter(line => /^#{1,6}\s+\S/.test(line)).map(line => line.trim());
}

function imageUrls(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)].map(match => match[1]);
}

function assertCompactKeepsMedia(file, markdown) {
  const full = fs.readFileSync(path.join(path.dirname(file), "toan-van.md"), "utf8");
  const need = imageUrls(full);
  const pool = imageUrls(markdown);
  const missing = [];
  for (const url of need) {
    const at = pool.indexOf(url);
    if (at < 0) missing.push(url);
    else pool.splice(at, 1);
  }
  if (missing.length) throw new Error(`${file}: thiếu ${missing.length}/${need.length} ảnh hoặc media của bản toàn văn.`);
}

function compactArticles(originals) {
  if (originals.length !== expectedCount) {
    throw new Error(`Trang reader gốc phải có đúng ${expectedCount} bài trong SOURCES; hiện có ${originals.length}.`);
  }
  const expectedIds = originals.map((text, index) => articleId(text, `SOURCES[${index}]`));
  if (new Set(expectedIds).size !== expectedCount) throw new Error("SOURCES của reader gốc có knowledge_id trùng lặp.");

  const folders = fs.readdirSync(documentsDir, { withFileTypes: true }).filter(entry => entry.isDirectory());
  const compactFiles = [];
  for (const folder of folders) {
    const file = path.join(documentsDir, folder.name, "viet-co-dong.md");
    if (fs.existsSync(file)) compactFiles.push({ folder: folder.name, file });
  }
  if (compactFiles.length !== expectedCount) {
    const found = new Set(compactFiles.map(({ file }) => articleId(fs.readFileSync(file, "utf8"), file)));
    const expected = expectedIds;
    const missing = expected.filter(id => !found.has(id));
    const extra = [...found].filter(id => !expected.includes(id));
    const detail = [missing.length && `thiếu ID: ${missing.join(", ")}`, extra.length && `ID ngoài nguồn: ${extra.join(", ")}`].filter(Boolean).join("; ");
    throw new Error(`Cần đúng ${expectedCount} tệp documents/*/viet-co-dong.md; tìm thấy ${compactFiles.length}${detail ? ` (${detail})` : ""}.`);
  }

  const byId = new Map();
  for (const { folder, file } of compactFiles) {
    const markdown = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const id = articleId(markdown, file);
    if (byId.has(id)) throw new Error(`Có nhiều tệp viết cô đọng cùng knowledge_id ${id}.`);
    if (!folder.startsWith(`${id}-`)) throw new Error(`${file}: thư mục không khớp knowledge_id ${id}.`);
    byId.set(id, { id, file, markdown });
  }

  return originals.map((original, index) => {
    const id = articleId(original, `SOURCES[${index}]`);
    const compact = byId.get(id);
    if (!compact) throw new Error(`Thiếu bản viết cô đọng cho knowledge_id ${id}.`);
    const expectedHeadings = headingLines(original.replace(/<\/?mark>/g, ""));
    const actualHeadings = headingLines(compact.markdown);
    if (!actualHeadings.some(line => /^#\s+/.test(line))) {
      throw new Error(`${compact.file}: thiếu tiêu đề H1.`);
    }
    for (let i = 0; i < expectedHeadings.length; i++) {
      if (actualHeadings[i] !== expectedHeadings[i]) {
        throw new Error(`${compact.file}: thiếu hoặc sai thứ tự tiêu đề ${i + 1}; cần "${expectedHeadings[i]}", nhận được "${actualHeadings[i] || "(không có)"}".`);
      }
    }
    if (actualHeadings.length !== expectedHeadings.length) {
      throw new Error(`${compact.file}: có ${actualHeadings.length} tiêu đề, nguồn gốc có ${expectedHeadings.length}; chỉ chấp nhận bộ tiêu đề gốc theo đúng thứ tự.`);
    }
    assertCompactKeepsMedia(compact.file, compact.markdown);
    return compact.markdown;
  });
}

function editionSet(ids) {
  const folders = fs.readdirSync(documentsDir, { withFileTypes: true }).filter(entry => entry.isDirectory());
  const dirById = new Map();
  for (const entry of folders) {
    const id = entry.name.split("-")[0];
    if (ids.includes(id)) dirById.set(id, entry.name);
  }
  const spec = [
    ["toan-van", "toan-van.md"],
    ["tung-muc", "tom-tat-tung-muc.md"],
    ["ca-trang", "tom-tat-ca-trang.md"]
  ];
  const out = {};
  for (const [key, name] of spec) {
    out[key] = ids.map(id => {
      const folder = dirById.get(id);
      if (!folder) throw new Error(`Thiếu thư mục cho knowledge_id ${id}.`);
      return fs.readFileSync(path.join(documentsDir, folder, name), "utf8").replace(/\r\n/g, "\n");
    });
  }
  return out;
}

function replaceOnce(text, pattern, replacement, label) {
  const matches = text.match(pattern);
  if (!matches) throw new Error(`Reader gốc: không tìm thấy ${label}.`);
  const remainder = text.replace(pattern, "");
  if (remainder.includes(matches[0])) throw new Error(`Reader gốc: tìm thấy ${label} nhiều hơn một lần.`);
  return text.replace(pattern, () => replacement);
}

function buildHtml(originalHtml, sources, editions) {
  const embedded = JSON.stringify(sources).replace(/</g, "\\u003c");
  const embeddedEditions = JSON.stringify(editions).replace(/</g, "\\u003c");
  let html = replaceOnce(originalHtml, /^const SOURCES = \[.*\];$/m, `const SOURCES = ${embedded};`, "SOURCES");
  html = replaceOnce(html, /^const EDITIONS = .*;$/m, `const EDITIONS = ${embeddedEditions};`, "EDITIONS");
  html = replaceOnce(html, /<title>[^<]*<\/title>/, "<title>Chính sách TikTok Shop</title>", "tiêu đề trang");
  html = replaceOnce(html, /<label for="q">[^<]*<\/label>/, "<label for=\"q\">Tìm</label>", "nhãn tìm kiếm");
  html = replaceOnce(html, /<p class="full-note" id="full-note">[^<]*<\/p>/, "<p class=\"full-note\" id=\"full-note\"></p>", "ghi chú toàn văn");
  return html;
}

function verifyHtml(html, compact) {
  const embedded = extractSources(html, "HTML được tạo");
  if (JSON.stringify(embedded) !== JSON.stringify(compact)) throw new Error("SOURCES trong HTML không khớp sáu tệp viết cô đọng theo thứ tự gốc.");
  const sourcesLine = html.match(/^const SOURCES = \[.*\];$/m)?.[0] || "";
  if (/<\/script/i.test(sourcesLine)) throw new Error("SOURCES chứa thẻ đóng script chưa được escape.");

  const script = html.split("<script>")[1]?.split("const OVERSCAN")[0];
  if (!script) throw new Error("HTML được tạo: không tìm thấy hàm parser/search của reader.");
  if (!html.includes("function readerFacing") || !html.includes("<title>Chính sách TikTok Shop</title>") || !html.includes("color-scheme: dark")) {
    throw new Error("HTML được tạo mất tiêu đề, giao diện tối hoặc bộ lọc dòng nội bộ.");
  }
  if (html.includes("Tìm trong sáu bài") || />Đây là bản viết cô đọng/.test(html)) {
    throw new Error("HTML được tạo còn dòng chú thích nội bộ trên giao diện.");
  }
  const context = vm.createContext({});
  vm.runInContext(script, context);
  for (const markdown of compact) {
    const blocks = context.parseDocument(markdown, false);
    const h1 = markdown.match(/^#\s+(.+)$/m)?.[1];
    if (!h1 || !blocks.some(block => block.type === "h" && block.lv === 1)) throw new Error("Parser không nhận được tiêu đề H1 của một bài.");
    const plainHeading = context.searchPlain(h1);
    const query = context.fold(plainHeading.split(/\s+/)[0] || "");
    if (!query || !context.fold(context.searchPlain(markdown)).includes(query)) throw new Error(`Tìm kiếm không tìm thấy từ đầu tiêu đề "${plainHeading}".`);
    if (!context.highlight(plainHeading, query).includes("<mark>")) throw new Error(`Highlighter không tô được truy vấn "${query}".`);
  }
}

function verifySearchCore(html, compact) {
  const script = html.split("<script>")[1]?.split(/^const SOURCES =/m)[0];
  if (!script) throw new Error("HTML tao: khong tim thay search core truoc SOURCES.");
  const context = vm.createContext({});
  vm.runInContext(script, context);
  context.loadSources(compact);
  const result = vm.runInContext(`(() => {
    const roots = tree.filter(node => node.lv === 1);
    const queries = ["POD", "voucher", "GMV", "kháng nghị"];
    const details = queries.map(raw => {
      const q = fold(raw);
      const hit = tree.some(node => branchHit(node, q));
      const matches = [];
      const bodyMatches = [];
      const visit = nodes => nodes.forEach(node => {
        if (node.fold.includes(q)) matches.push(node);
        if (fold(node.direct || "").includes(q)) bodyMatches.push(node);
        visit(node.children || []);
      });
      visit(tree);
      forced = new Set();
      const indexedHit = markMatchAncestors(tree, q);
      const nestedMatches = matches.filter(node => node.ancestors.length > 0);
      const forcedAncestor = nestedMatches.some(node => node.ancestors.some(parent => forced.has(parent.id)));
      return { raw, hit, indexedHit, matches: matches.length, bodyMatches: bodyMatches.length, forcedAncestor };
    });
    const sentence = "Giữ số dư 180 ngày theo lịch. Câu sau không liên quan.";
    const snip = matchSnippet(sentence, fold("180 ngày"));
    const clipped = matchSnippet("a".repeat(400) + " 180 ngày " + "b".repeat(400), fold("180 ngày"));
    const snippetOk = snip.includes("180 ngày") && !snip.includes("Câu sau") && clipped.includes("180 ngày") && clipped.length <= 180 && matchSnippet("không có", fold("180 ngày")) === "";
    const marked = highlightOutsideTags("<p>Giữ 180 ngày. Sau.</p>", fold("180 ngày"));
    const entity = highlightOutsideTags("<p>a &amp; b</p>", fold("a &"));
    const highlightOk = marked === "<p>Giữ <mark>180 ngày</mark>. Sau.</p>" && entity === "<p><mark>a &amp;</mark> b</p>" && highlightOutsideTags("<p>Giữ</p>", "") === "<p>Giữ</p>";
    const noHitQuery = "codex-no-match-token-928341";
    forced = new Set();
    const noHit = !tree.some(node => branchHit(node, fold(noHitQuery))) && !markMatchAncestors(tree, fold(noHitQuery)) && forced.size === 0;
    const sample = readerFacing("- knowledge_id: 1\\n- Ngày trên bài nguồn: 22/09/2026\\n- Nguồn: https://seller-vn.tiktok.com/a\\n> Bản viết gọn trung thành với nguồn, không phải bản tóm tắt.\\nBản viết cô đọng theo từng ý.\\n# Tiêu đề\\n- **Ghi chú biên tập:** nội bộ\\n- Giữ hồ sơ. **Ghi chú nguồn:** chỉ biên tập.\\n- Bài nguồn có sơ đồ hành trình; xem tại bài gốc.");
    const readerOk = !sample.includes("knowledge_id:") && sample.includes("- Cập nhật 22/09/2026") && sample.includes("[Bài gốc](https://seller-vn.tiktok.com/a)") && sample.includes("# Tiêu đề") && sample.includes("Giữ hồ sơ.") && !sample.includes("Bản viết gọn") && !sample.includes("Ghi chú biên tập") && !sample.includes("Ghi chú nguồn") && !sample.includes("Bản viết cô đọng") && !sample.includes("Bài nguồn có");
    return { roots: roots.length, details, noHit, snippetOk, highlightOk, readerOk };
  })()`, context);
  if (result.roots !== expectedCount) throw new Error(`Search core loaded ${result.roots}/${expectedCount} article H1s.`);
  for (const detail of result.details) {
    if (!detail.hit || !detail.indexedHit || detail.matches === 0 || detail.bodyMatches === 0 || !detail.forcedAncestor) {
      throw new Error(`Search core did not find/index/force ancestors for "${detail.raw}": ${JSON.stringify(detail)}.`);
    }
  }
  if (!result.noHit) throw new Error("Search core mishandled a no-match query.");
  if (!result.snippetOk) throw new Error("Dòng trích sidebar không giữ câu khớp hoặc cắt sai.");
  if (!result.highlightOk) throw new Error("Tô từ khóa trong nội dung làm hỏng thẻ hoặc ký tự.");
  if (!result.readerOk) throw new Error("Trang còn hiện knowledge_id hoặc ghi chú biên tập.");
}

function verifyReplacementSafety() {
  const literal = "$& $` $' </script>";
  if (replaceOnce("placeholder", /placeholder/, literal, "kiểm tra thay chuỗi") !== literal) {
    throw new Error("Thay chuỗi đã diễn giải metasequence thay vì giữ nguyên dữ liệu.");
  }
  const embedded = JSON.stringify([literal]).replace(/</g, "\\u003c");
  if (embedded.includes("</script") || JSON.parse(embedded)[0] !== literal) {
    throw new Error("Escape dữ liệu SOURCES làm hỏng chữ nguyên văn hoặc chưa chặn thẻ đóng script.");
  }
}

function main() {
  verifyReplacementSafety();
  const checkOnly = process.argv.includes("--check");
  const orderHtml = fs.readFileSync(orderPath, "utf8");
  const shellHtml = fs.readFileSync(shellPath, "utf8");
  const originals = extractSources(orderHtml, orderPath);
  const compact = compactArticles(originals);
  const ids = compact.map(markdown => articleId(markdown, "viet-co-dong"));
  const editions = editionSet(ids);
  const output = buildHtml(shellHtml, compact, editions);
  verifyHtml(output, compact);
  verifySearchCore(output, compact);
  for (const key of ["toan-van", "tung-muc", "ca-trang"]) {
    if (!editions[key] || editions[key].length !== expectedCount) throw new Error(`Thiếu bản ${key}.`);
  }
  if (checkOnly) {
    console.log("OK: sáu bài hợp lệ; parser, tìm kiếm và tô kết quả hoạt động trong HTML tạo tạm trong bộ nhớ.");
    return;
  }
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`Đã tạo ${path.relative(root, outputPath)}.`);
}

try {
  main();
} catch (error) {
  console.error(`Không tạo reader cô đọng: ${error.message}`);
  process.exitCode = 1;
}
