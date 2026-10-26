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
