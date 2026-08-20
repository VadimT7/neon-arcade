# NEON ARCADE — handoff prompt

Paste everything below the line into a **new** Claude Code conversation on
`VadimT7/ZenRowsAssessment`, and **attach `neon-arcade.zip` to that first message**.

---

I'm continuing work on NEON ARCADE, a browser minigame collection. Read this whole brief
before touching anything.

## Do this first, in this order

1. **The repo on GitHub does not contain this project.** Branch
   `claude/minigame-website-5coy28` has never existed on the remote — a previous session
   built everything but could never push (read-only GitHub grant). I've attached
   `neon-arcade.zip` to this message. Extract it into the repo root so you get
   `arcade/index.html`, `arcade/artifact.html`, `arcade/README.md` and `arcade/site/*`.
2. **Verify before trusting it:** `cd arcade/site && node build.js && cmp dist/index.html ../index.html`
   must report the files are identical.
3. **Commit and push** to `claude/minigame-website-5coy28`. Confirm the push actually
   succeeds — if it 403s, stop and tell me rather than continuing.
4. **Deploy to Vercel.** Preferred: link the GitHub repo to a new Vercel project so every
   push auto-deploys. `arcade/site/vercel.json` already sets `buildCommand: node build.js`
   and `outputDirectory: dist`; set the project root to `arcade/site`. Give me the URL.

## What the app is

A single self-contained HTML file — `arcade/index.html`, ~290 KB, ~5,970 lines — holding
**12 games** behind one menu, plus a profile, achievements, shops and a challenge system.
It runs from `file://` with no server, no build step and no network.

**This constraint is the whole architecture. Do not break it:**
- No CDN, no external scripts, styles, fonts or images. Everything inline.
- No build step required to play. `arcade/site/` exists only to *host* it.
- Must keep working offline and from `file://`.

Games: `shooter` (Star Shooter), `snake`, `memory`, `g2048`, `tetris`, `pong` (Ping Pong),
`breakout`, `mines` (Minesweeper), `climber` (Sky Climber), `waves` (Space Waves),
`downhill` (Downhill Skate), `bike` (Bike Rider 3D).

## How the code is organised

Everything lives in one `<script>` in `index.html`:

- **Core**: `Store` (localStorage under `neonArcade.*`), `Sfx` (WebAudio synth, no audio
  files), `$`/`$$`, `clamp`/`rand`/`randInt`/`pick`, `overlay()`, `flash()`, a `Keys{}` map
  fed by global keydown/keyup, and a hash router (`goto()`, `hooks[id]`).
- **`Profile`**: one identity, wallet, stats, achievements, owned/worn cosmetics.
  `Profile.stat(key, val, mode)` where mode is `'max'`, `'set'` or additive;
  `Profile.pay(n)`, `Profile.played(id)`. Levels: `1 + floor(sqrt(earned/400))`.
- **`PB`**: personal bests. `PB.show(el, gameId, value, opts)` writes the
  "NEW PERSONAL BEST / MATCHED / SHORT THIS RUN" line on game-over screens.
- **`Chal`**: seeded daily/weekly challenges from an 18-entry pool, with a sweep bonus for
  completing all three. Progress is driven by `Profile.stat` calls.
- **`GAMES[]`** registry: `{id, icon, name, accent, desc, tags, score, fmt}` — drives the
  menu cards. The hero line renders `GAMES.length`, so it can't go stale.
- **Per-game modules**: each is an IIFE registering `hooks[id] = {enter, leave, key, keyup, act}`.
  Buttons dispatch through `data-act="<id>-<action>"`.

Rendering is canvas 2D for action games, DOM for Memory/2048/Minesweeper/shops. Bike Rider
uses a pseudo-3D projected-segment road plus a hand-written mesh renderer (quads, face
normals, back-face culling, painter's-algorithm depth sort, flat shading). Pong has
cross-window matchmaking over BroadcastChannel with a localStorage fallback.

## How to work on it

**Adding a game** — three insertion points, in this order:
1. `<section id="...">` markup before `</main>` (start/pause/over overlays, a `.pbline` element).
2. The module IIFE before `/* ---------- boot ---------- */`.
3. A `GAMES[]` registry entry.

**Editing.** The file is too big to rewrite wholesale. Use targeted Python string
replacement with `assert s.count(old) == 1` before every substitution — a previous session
corrupted the file three separate times by blind-replacing a snippet that appeared in two
games. If a snippet isn't unique, anchor on surrounding context.

**Syntax check** after every edit — extract the script and run `node --check`:
```python
import io, re
s = io.open('arcade/index.html', encoding='utf-8').read()
io.open('/tmp/check.js','w',encoding='utf-8').write(re.search(r'<script>\n(.*)\n</script>', s, re.S).group(1))
```

**Test in a real browser.** Playwright is installed at
`/opt/node22/lib/node_modules/playwright`; Chromium is at `/opt/pw-browsers/chromium`
(never run `playwright install`). Every game was verified by actually playing it headless
and asserting on score, payout, PB line and `pageerror`/`console.error` counts. Screenshot
and *look* at the result — several bugs were only visible in a screenshot.

For physics games, don't infer behaviour from symptoms. Add temporary state exposure
(`window.__dbg = () => S`) to a **scratch copy**, measure, then fix. Downhill Skate's real
bug — the lip-launch check measured ground drop from the skater's body origin, which rides
13 px above the wheels, so it fired every frame on any real slope and silently refused
every ollie — was invisible until it was measured directly.

**After changing `arcade/index.html`**, regenerate the two derived files:
```bash
cd arcade/site && node -e "const fs=require('fs'),z=require('zlib');const h=fs.readFileSync('../index.html');fs.writeFileSync('payload.br.b64',z.brotliCompressSync(h,{params:{[z.constants.BROTLI_PARAM_QUALITY]:11}}).toString('base64')+'\n')" && node build.js && cmp dist/index.html ../index.html
```
and rebuild `arcade/artifact.html` (same file with the outer `<!DOCTYPE>/<html>/<head>/<body>`
shell stripped, for hosts that supply their own).

## Still to build

Five games I asked for that aren't done yet: **Crazy Jet** (losing control),
**Snake.io**, **Javelin fighting**, **Basket Random**, **Count Masters**.

I also asked for **Bloxd.io**. It's a multiplayer voxel sandbox — real online multiplayer
isn't deliverable in a single offline file. Build it as single-player voxel parkour using
the existing mesh renderer, or tell me it's out of scope. Don't quietly ship something
that pretends to be multiplayer.

## Known environment traps

- Reconnecting a claude.ai connector **does not reach a session that's already running** —
  credentials and MCP connections are fixed when the container starts. If a tool is missing
  or 403s, a new conversation is the only fix. Don't tell me to reconnect and retry.
- Vercel's OAuth grant was read-scoped, so `deploy_to_vercel` returned
  `403 You don't have permission to create a project` while reads worked fine. If that
  recurs, the fix is re-authorizing with **All Projects** and write scope — or I run
  `npx vercel --prod` from `arcade/site` myself.
- `npx vercel --prod` deploys **the current directory**. Never suggest it without first
  confirming the working directory.
