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
- **Voice capture for meetings** *(off by default)* — on Google Meet and
  Zoom's web client, optionally transcribe your own microphone with the
  browser's speech recognition and catch swearing you *say*, not just text
  on the page. See [Voice capture](#voice-capture-meetings) below — this is
  the one feature that isn't fully local.
- **Local by default** — everything is stored in `chrome.storage.local`. No
  network requests, no analytics, no external servers — *unless* you turn on
  voice capture, which relies on the browser sending audio to Google's
  speech-recognition service (see below).

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
├── options/                # settings page: word list, muted sites, jar cap, voice capture, reset
└── scripts/generate-icons.js  # regenerates icons/*.png (no image libs needed)
```

Two additional files support voice capture:

- `src/wordmatch.js` — the word-matching regex logic, shared (as a classic
  script) between `content.js` and `meet-voice.js` so both content-script
  entries use identical matching.
- `src/meet-voice.js` — a second content script, injected only on
  `meet.google.com` and `*.zoom.us`, that runs the browser's speech
  recognition on your microphone and feeds any caught words through the
  same pipeline as the page-text scanner.

## Voice capture (meetings)

Turned **off by default**. When enabled in Settings, on Google Meet or
Zoom's web client the extension starts the browser's built-in
`SpeechRecognition` on your microphone and checks the transcript for swear
words, exactly like it checks page text. A small "🎙️ Swear Jar listening"
badge appears in the corner of the tab whenever it's actively listening, and
the popup shows the same status when you're on a supported meeting site.

**Read before enabling:** Chrome's speech recognition is not on-device — it
sends your microphone audio to Google's servers to produce a transcript.
That's a real difference from the rest of the extension, which never makes
a network call. Only *your own* microphone is captured (not other call
participants, and not tab/system audio), only on `meet.google.com` /
`*.zoom.us` tabs, and only while the toggle is on. It stops automatically
when the tab is hidden or backgrounded, and you can flip it off any time
from Settings.

Supported today: Google Meet and Zoom's web client (in-browser meetings —
the Zoom/Meet desktop apps aren't reachable by a Chrome extension). If your
browser doesn't support `SpeechRecognition`, the feature silently no-ops.

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

The page-text scanner (the default behavior) never sends page content or
statistics anywhere — all scanning happens locally in the content script,
and all stats live in `chrome.storage.local` on your machine.

The one exception is the opt-in [voice capture](#voice-capture-meetings)
feature: while it's turned on, your microphone audio on Meet/Zoom tabs is
sent to Google's speech-recognition service to be transcribed. It's off by
default and documented in detail above — turn it on only if you're
comfortable with that tradeoff.
