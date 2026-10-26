# TikTok Shop policy notes — progress

- Scope: 6 provided Academy links, section-by-section comparison in simple local HTML.
- Design: buildless HTML/CSS; official full text stays available at source, summaries preserve conditions and figures; no hosting requested.
- Source access: web reader failed/empty on first two links; existing Brave tab renders first article publicly (no login).
- Next: inspect all six rendered articles, retain source metadata, author summaries, build and verify local HTML.
- Git: new local repository; no remote configured.

## Checkpoint — HTML built
- Read all 6 Vietnamese articles via rendered Brave DOM; source web reader alone could read 3/6 reliably.
- Stored only public article titles/dates/heading anchors. No account, session, cookies, or full text saved.
- Implemented 43 summary groups across 6 two-column tables; full text linked at official source rather than reproduced.
- Validation: node scripts/build.mjs --check succeeded; browser DOM counted 6 tables/43 rows and exactly 2 cells per row; no script/iframe/src resources; desktop document width 1282 equals viewport client width.
- HTTP preview probe returned 200 on 127.0.0.1:8768. Menu click reached #article-8623594494494465.
- Direct file:// browser navigation blocked by browser URL policy; did not verify that protocol in automation. Browser rendering verified over isolated loopback preview serving only index.html. Small-screen viewport not tested.
- Screenshots: work/preview-desktop.png, work/preview-table.png (ignored).
- Remaining: independent review, address findings, fresh checks, local commit, copy user-facing output, stop owned preview server.

## Final review and verification
- Independent review found two wording issues: conditional certification for some branded products; voucher evidence from other marketplaces. Both corrected in source and regenerated HTML.
- Draft-only 190-word target was not a product requirement; final build enforces <=200 words/article for concise summaries.
- Fresh node scripts/build.mjs --check passed after edits: 6 articles, 43 rows, 2 columns.
- Browser reloaded final HTML: corrected voucher wording present, 6 tables/43 rows, each row 2 cells. Desktop screenshot refreshed.
- Environment caveat: review observed AdGuard injecting scripts/CSP into HTTP responses. Final browser DOM had 1 external-resource element; static file has no scripts or resource loads. No claim of a clean network-capture/offline runtime test.
- Direct file protocol and mobile viewport remain not_run. This does not affect the self-contained static-file structure; opening via double-click is documented but not independently browser-automated here.
- No Git remote or configured author identity. Local commit will use an explicit agent identity (Codex / codex@local.invalid), scoped to the command; no global Git config changes.
- Final whitespace check passed after removing generated blank-line padding. Targeted credential-pattern scan returned no matches (not a comprehensive secret certification).
- Deliverables copied to the chat outputs folder; HTML matches the repository source by hash.
- Final scope limitation: the requested full-text left column is represented by official per-section links, not an offline full-text reproduction. This limitation is explicit in the page and README.
- All authorized implementation/checks complete. No remote/push/hosting configured. Resume by reading this log and README; rebuild with node scripts/build.mjs.

## Reader mockup revision — 2026-10-26
- User rejected the two-column source-link version. Archived v1 in archive/v1-table-20261026; root index moved there, source/build snapshots copied for recoverability.
- Requested new direction: sidebar with six articles/subsections; main reader shows content with a confirmation URL; Summary/Full toggle defaults to summary; words disappear/are inserted with animation.
- Current scope: interactive mockup for approval before applying all six articles. Full demo content is original explanatory sample text, not a copy of the six articles.
- Worker owns only mockup/index.html. Root handles archive, research, public HTML downloads, verification, delivery and commit.
- Research candidates: github.com/luileito/summer (responsive summarization), github.com/raphaelsalaja/calligraph (text morph), Diffamation CHI 2010 (animated revision navigation).
- Next: collect raw public HTTP snapshots without credentials; verify whether server HTML contains article text. Do not call a raw shell a complete offline article.

## Markdown-only request — 2026-10-26
- User explicitly stopped the page/animation work and requested full Markdown plus corresponding informative summaries for all six articles.
- Stopped owned preview-server process (exec session 32264). No further page implementation authorized in this turn.
- Existing reader mockup retained as an unfinished experiment, not approved or delivered as the new document solution.
- Six public raw HTML downloads are present; manifest verifies each has article body (headings: 11,25,11,21,10,15). Linked assets were not downloaded.
- Copyright boundary explained: cannot reproduce all six non-user-provided articles verbatim from URLs; full Markdown conversion needs user-supplied HTML/text attachments. Do not create a fake full document or label a summary as full.
- Worker assignment: create documents/tom-tat.md from existing factual summaries, all six sources, explicit limits; no UI changes.
- Remaining: validate the Markdown, copy to chat outputs, checkpoint commit. Full Markdown remains unfulfilled pending user-provided source material.
- Markdown verification complete: 6 source sections, all 43 existing factual summary rows preserved, both source caveats preserved, UTF-8 checked. This checks conversion fidelity to the existing summary, not completeness against all source article text.
- Summary delivered to outputs/tiktok-shop-tom-tat.md; no full-text Markdown created. The requested comprehensive full/summary pair remains incomplete pending source attachments.
- Existing archive build and mockup syntax/anchors were checked only to preserve recoverable checkpoints; no UI changes after the user stopped that work. Preview process stopped.
