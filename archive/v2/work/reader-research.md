# Reader mockup — references

Checked 2026-10-26. Primary sources only; these are references, not installed dependencies.

1. [Summer](https://github.com/luileito/summer): responsive text summarization; removes less relevant sentences, controls summary length using CSS or JavaScript. Similar in variable detail, but its documented feature is not the requested sidebar plus animated Summary/Full reader.
2. [Calligraph](https://github.com/raphaelsalaja/calligraph): shared characters move, entering/exiting characters fade. Similar in transition effect; not a summarization engine. Requires React 18+ and Motion 11+ per README. Not installed for this HTML-only mockup.
3. [Diffamation — CHI 2010](https://www.lri.fr/~anab/publications/diffamation-CHI2010.pdf): research system for animated transitions between document revisions. Relevant to tracking changed text, not an automatic summarizer.

No exact end-to-end match verified. Proposed interaction combines a document outline with progressively added/removed explanatory phrases. Mockup uses hand-authored demo phrases, not algorithmic summarization. Independent reworded summaries will need word/phrase diff, and may not be literal subsets of the original.

## Source download status

Six public HTTP HTML responses are saved locally under `work/downloads/` (ignored by Git); see `work/download-manifest.json` for source URLs, sizes, article-body presence and SHA-256. No browser cookies/authentication were used. Linked images/fonts/scripts were not downloaded. This is not yet a clean, verified offline archive of all article assets, nor content integrated into the reader. Full demo in the prototype must stay labeled simulated.
