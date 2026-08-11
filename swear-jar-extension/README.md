# 🫙 Swear Jar

A Chrome extension (Manifest V3) that scans the pages you visit for swear
words and fills up an animated jar as it catches them — like a real swear
jar, but for your browser.

## Features

- **Live counting** — a content script scans page text (and watches for
  dynamically-added content) for a built-in list of swear words, whole-word
  matched so `class`/`grass`/`shell` etc. are never miscounted.
- **Animated jar popup** — click the toolbar icon to see an SVG jar that
  fills up (severity-weighted: mild/medium/strong words are worth different
  "points"), with coins dropping in and the jar giving a little shake as new
  words are caught.
- **Toolbar badge** — the total catch count shows right on the extension
  icon.
- **Per-word and per-site stats** — see your most-caught words in the
  popup; mute individual sites you don't want scanned (e.g. code editors,
  chat apps).
- **Fully customizable** — add your own words (with severity), disable any
  built-in word, adjust how many points fill the jar, and optionally show a
  small on-page toast every time a word is caught.
- **100% local** — everything is stored in `chrome.storage.local`. No
  network requests, no analytics, no external servers.

## Install (unpacked, for development/testing)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this `swear-jar-extension/` folder.
4. Browse to any page — the toolbar badge will start counting, and clicking
   the icon opens the animated jar.

## Project structure

```
swear-jar-extension/
├── manifest.json          # MV3 manifest
├── icons/                 # toolbar/store icons (generated, see scripts/)
├── src/
│   ├── wordlist.js        # default word list + merge/regex helpers (ES module)
│   ├── storage.js         # chrome.storage.local schema + read/write helpers (ES module)
│   ├── background.js      # service worker: aggregates catches, updates badge
│   └── content.js         # page-scanning content script (classic script —
│                           # MV3 content scripts can't statically `import`,
│                           # so this inlines its own small copy of the word list)
├── popup/                 # toolbar popup: animated jar, stats, site mute toggle
├── options/                # settings page: word list, muted sites, jar cap, reset
└── scripts/generate-icons.js  # regenerates icons/*.png (no image libs needed)
```

## How matching works

Words are matched case-insensitively with `\b(word1|word2|...)\b` regexes,
so only whole-word occurrences count. Severity determines the "points" a
catch adds toward the jar's fill level:

| Severity | Points | Example jar coin |
| -------- | ------ | ----------------- |
| 1 (mild)   | 1 | 🟤 |
| 2 (medium) | 2 | 🪙 |
| 3 (strong) | 4 | 💰 |

The jar reads "full" at a configurable point total (default 150, in
Settings), independent of the raw word count shown next to the jar.

## Regenerating icons

Icons are drawn procedurally (no image editor / library needed):

```bash
node scripts/generate-icons.js
```

## Privacy

The extension never sends page content or statistics anywhere. All
scanning happens locally in the content script, and all stats live in
`chrome.storage.local` on your machine.
