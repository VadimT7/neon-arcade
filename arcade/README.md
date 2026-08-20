# 🕹️ NEON ARCADE

A single-file, zero-dependency collection of ten minigames with a shared player profile. Open `arcade/index.html` in any
modern browser — no build step, no server, no CDN, works completely offline.

The menu is the entry point: pick a game from the card grid, play, hit **← ARCADE**
to come back and choose another.

## Your profile

One identity across the whole arcade, reachable at any time from the chip in the top bar.

* **Editable whenever you like** — name and accent colour. Renaming rewrites your existing
  leaderboard rows so you never end up as two people, and the colour follows you everywhere,
  down to the Sky Climber character.
* **One wallet** — every game pays into it: points banked in Star Shooter, fruit in Snake,
  lines in Tetris, coins in Bike Rider, bricks in Breakout, cleared minefields, metres
  climbed, and rallies won in Ping Pong. The Ping Pong ability shop spends from the same
  balance.
* **Levels** — one XP track shared by all ten games: everything you earn anywhere counts
  towards the same level curve, shown as an XP bar on the profile and on the menu strip.
* **40 achievements** across all ten games, each paying a bounty when it unlocks, announced
  by a toast the moment it happens.
* **Hall of Fame** — every leaderboard in the arcade on one screen.
* **Personal bests** — every game logs your best result and the results screen tells you where
  this run landed: a new best and by how much, a match, or how far short you fell. Timed games
  (Memory Match, Minesweeper, Tetris sprint) are scored lower-is-better.
* **Daily and weekly challenges** — three of each, drawn from an eighteen-challenge pool by a
  seeded shuffle so the same day gives everyone the same three. Progress is fed by the same
  reports the achievements use, so it accrues from ordinary play. Each pays on completion
  ($220 daily, $850 weekly) and clearing all three pays a sweep bonus ($650 daily, $2,600
  weekly). The profile shows progress bars and a countdown to the next reset; the menu carries
  a compact strip with both counts and your level.
* **Accessory shop** — twenty-five cosmetics bought once with the shared wallet and worn in
  the games themselves: five starship hulls for Star Shooter, five snake skins, five bat
  rubbers for Ping Pong, four 2048 tile themes, a six-vehicle garage for Bike Rider and five
  player titles for your profile card. Prices run $250–$3,500; equip and swap as often as you
  like. When a bought bat rubber would read
  as the same colour as your opponent's, the opponent's is shifted so the two never blur
  together.

All of it lives in `localStorage`, so it is per browser and needs no account.

## The games

### 🚀 Star Shooter
Wave-based space shooter — the deepest game in the set. **After every wave you draft one of
three perks** for the rest of the run: rapid fire, heavy rounds, a wingman drone, a power-up
magnet, hull plating, scavenger drops, enemy-fire dampeners, thrusters, bounty scoring,
piercing shots, a kill-siphon shield, or overcharged kill streaks. Most stack, so runs
diverge quickly.

* **Six enemy classes**
  * `GRUNT` — basic drifting fighter
  * `SCOUT` — fragile but very fast, zig-zags down the screen
  * `TANK` — heavily armoured, slow, tracks you and fires a 3-way spread
  * `GUNNER` — holds position and shoots aimed rounds (a 3-round spread from wave 8)
  * `BOMBER` — hovers, locks on (red ring telegraph), then kamikaze-dives
  * `SPLITTER` — splits into two fast shards when destroyed
  * `MINE` — seeker mine dropped by the Overmind; explodes into a bullet ring
* **Five power-ups** — `TRIPLE SHOT`, `LASER` (piercing beam that also burns enemy
  bullets out of the air), `MISSILES` (homing + splash damage), `SHIELD` (absorbs one
  hit), `SPEED BOOST` (faster movement and fire rate)
* **Four bosses**, one every 5th wave, each with its own attack rotation and an
  enrage phase below 40% health. They cycle and come back stronger (`MK2`, `MK3`, …):
  * `THE WARDEN` — radial bursts, twin sweeping laser beams, aimed volleys
  * `HYDRA` — summons minions, aimed 5-round volleys, sweeping bullet arcs
  * `NEMESIS` — rotating 3-arm spiral, telegraphed dive-dash with shockwave, charged column beam
  * `OVERMIND` — expanding bullet rings, seeker mines, rotating cross barrage, twin orbiting turrets
* **Combos / kill streaks** — chained kills within 2.4s build a multiplier up to
  ×7.75, with streak call-outs (`DOUBLE STRIKE`, `RAMPAGE`, `DOMINATING`,
  `UNSTOPPABLE`, `LEGENDARY`, `GODLIKE`) and bonus score. Taking a hit resets it.
* **Difficulty progression** — every wave adds enemies (+13% HP, +4.5% speed each,
  tighter spawn intervals) and unlocks tougher classes. Clearing a wave without
  taking damage pays a no-damage bonus. Extra life every 25,000 points.

Controls: `←→↑↓` / `WASD` move, `SPACE` fire, `P` pause. On a touchscreen, drag
anywhere on the playfield — the ship follows your finger and fires automatically.

### 🐍 Snake
Four modes: **classic**, **wrap** (edges loop instead of killing you), **maze** (obstacle
layouts, with a guaranteed-safe spawn corridor) and **duel**, a two-snake match on one
keyboard — arrows against WASD, last one alive wins. A 16×16 board. Starts at a gentle 170 ms per step and only ramps up as you eat (floor of 96 ms), so
it stays controllable. Food is a random fruit — apple, orange, banana, grapes, cherries,
strawberry, watermelon, kiwi, lemon or blueberry — drawn with canvas paths rather than emoji
glyphs so it renders identically on every OS. Each is worth 10–18 points, and food never
spawns on top of the snake.

### 🧠 Memory Match
12 pairs with a live stopwatch that starts on your first flip. Finish, and if your
time lands in the top 10 you enter a name and it's saved to the leaderboard
(ranked by time, move count shown as a tiebreak).

### 🎲 2048
Standard rules. Directions are handled by an explicit per-direction traversal, so
each arrow key moves the tiles the way it points. Swipe support on touch.

A **top-10 leaderboard** records the best runs by score, with the best tile reached.
Each name appears exactly once: save again under the same name and only a higher score
replaces your row, otherwise your existing best stands (names are matched
case-insensitively). The board is live — it re-reads storage every **2 minutes**, so a run
saved in another window shows up on the next cycle, and it says so: a pulsing indicator, a
`NEXT REFRESH IN m:ss` countdown, a draining progress bar, and a `BOARD REFRESHED ✓`
confirmation each time the cycle lands. The cycle is anchored to the clock rather than to
when you opened the board, so opening it never restarts the countdown and every window
counts down in step.

### 🧱 Tetris
Three modes: **marathon** (endless), **sprint** (40 lines as fast as possible, with its own
time board) and **ultra** (most points in two minutes). Modern guideline rules: 7-bag randomiser, SRS rotation with the full wall-kick tables,
hold piece, five-deep next queue, ghost piece, lock delay (500 ms with 15 move resets)
and DAS/ARR tuned handling. Scoring covers singles through tetrises, T-spins (3-corner
rule with a front-corner check for minis), back-to-back ×1.5, combo chains and a
perfect-clear bonus. Level rises every 10 lines and gravity follows the guideline curve.

Controls: `←→` move, `↑`/`X` rotate CW, `Z` rotate CCW, `↓` soft drop, `SPACE` hard drop,
`C`/`SHIFT` hold, `P` pause.

### 🏓 Ping Pong
First to 11. Hit the ball off the edge of your bat to angle it, and move on contact to
add spin. The bats are drawn as real table-tennis rackets — a pimpled rubber face over a
pale wood rim, with a grip-wrapped wooden handle pointing out to the wall — and the blade
covers the full collision height, so what you see is exactly what the ball hits.

* **Four bots** — `ROOKIE`, `PRO`, `ACE`, `INSANE`. None of them is clairvoyant: a bot only
  works out where the ball is going once it has crossed its own read distance, and it can
  only account for a limited number of wall bounces (Rookie reads none at all, so it camps
  where the ball *would* have gone; even Insane is fooled by a third bounce). Aim error
  grows with ball speed, each read carries a chance of an outright misread, and paddles
  accelerate rather than snapping to full speed. They are quick and accurate within those
  limits — measured against a paddle that never misses, they concede roughly 6 / 3 / 3 / 2
  points a minute from Rookie to Insane.

* **Cash and the ability shop** — you earn cash for every point you score, every 10-hit rally
  and every match won, scaled by the difficulty you chose (Insane pays 2.2×). Spend it in the
  shop on six abilities and equip up to three; in a match they fire on `1` `2` `3`
  (player 2 uses `8` `9` `0` on the same screen), each on a 30-second cooldown. Bots never
  use them.

  | Ability | Price | Effect |
  |---|---|---|
  | Titan Paddle | $600 | Your paddle grows 65% taller for 7s |
  | Blink | $750 | Snaps your paddle onto the ball's intercept |
  | Slow Mo | $900 | Ball drops to 55% speed for 4s |
  | Power Smash | $1,100 | Your next return leaves 60% faster |
  | Freeze Ray | $1,400 | Opponent moves at 35% speed for 3.5s |
  | Shield Wall | $1,800 | A barrier saves one ball that gets past you |

  Owning the full set is a $6,550 investment, so they are something to work towards rather
  than a first-session purchase.

  Cash, purchases and loadout persist in `localStorage`.
* **Same screen** — two players on one keyboard, `W`/`S` against `↑`/`↓`.
* **Queue for a match** — real matchmaking against another player. Open the arcade in a
  second browser window or tab, queue on both, and you are paired automatically: roles are
  assigned deterministically, the host simulates the match and the guest relays its input,
  with the ball, paddles and score synced live. Leaving ends the other player's match
  cleanly.

  Because the page has no server, matchmaking runs over `BroadcastChannel` with a
  `localStorage` fallback (needed for `file://` pages, where BroadcastChannel is inert) —
  so it finds players in other windows of the same browser, not across the internet.
  Playing over the internet would need a signalling server or relay, which a static file
  cannot provide.

### 🏍️ Bike Rider 3D
Endless racer using the classic pseudo-3D projected-segment technique, drawn entirely
with the 2D canvas API — curves, hills, fog, traffic, cones and barriers. Three
hearts; hit something and you lose one and most of your speed.

Steering is quick and keeps a response floor of its own, so the bars still bite at low speed
rather than only at full throttle.

The rider and every vehicle are **real 3D models** — not sprites. Each is authored in code as
vertices and quads, then drawn by a small renderer built for this game: face normals, back-face
culling, painter's-algorithm depth sorting, flat shading against a fixed light, and perspective
projection onto the same 2D canvas the road uses. The model rolls when you lean, yaws when you
steer and pitches on jumps, and the camera sits slightly above so you can see the tops of the
bodywork.

There is deliberately no downloaded mesh and no WebGL library. A glTF asset would need a loader
served from somewhere — the exact CDN dependency whose failure broke this game originally, and
something the artifact's content-security policy blocks outright. Geometry in code keeps the
single file self-contained and offline, and costs nothing at runtime: the whole vehicle is
about a hundred faces and the game still runs at 56 fps in a headless browser.

The **garage** sells six of them — three bikes and three cars — each modelled and handling
differently: the Street Moto turns hardest, the Muscle Car is stable but heavy, and the
Hypercar trades some grip for top speed. Cars get a cabin, glass, taillights, four wheels and
(on the Rally Hatch and Hypercar) a strutted rear wing; bikes get a frame, tank, tail cowl,
twin exhausts, handlebars and a rider with a helmet.

Coins line the lanes: each one pays into your wallet and charges the **nitro** meter, worth
a burst of extra top speed and acceleration on `SHIFT`. The sky cycles through day, dusk and
night, with rain streaking the road after dark.

Controls: `←→` steer, `↑` throttle, `↓` brake, `SPACE` jump (clears cones and
barriers, not traffic), `SHIFT` nitro.

### ■ Breakout
Armoured bricks that take several hits, steel bricks that never break, and six power-ups
dropped by the rest: multiball, wide paddle, paddle lasers, slow ball, sticky catch and an
extra life. Levels keep coming with new patterns and tougher tiers; clearing one without
losing a ball earns an achievement.

### ⚐ Minesweeper
Beginner (9×9, 10 mines), intermediate (16×16, 40) and expert (22×14, 70). First click is
always safe, numbers can be chorded, right-click flags, and every clear is timed onto a
per-level leaderboard.

### ▲ Sky Climber
An endless vertical bouncer built for one thumb. Platforms move, crumble under you or launch
you skyward; the screen edges wrap; falling is the only way to lose. Height is the score and
consecutive platform landings build a streak.

## Hosting it

`arcade/index.html` is the whole game and opens straight from disk. `arcade/site/` adds what a
public site needs and deploys as a static project:

| File | Purpose |
|---|---|
| `payload.br.b64` | `index.html`, brotli-compressed and base64-encoded |
| `build.js` | Expands the payload into `dist/index.html` at build time and copies the static files |
| `manifest.webmanifest` | Installable web app — name, icons, standalone display |
| `sw.js` | Service worker: network-first for the page, cache-first for assets, so a redeploy reaches visitors while the arcade still plays offline |
| `icon.svg`, `og.jpg` | Favicon / app icon and the social card |
| `vercel.json` | Build command, output directory and cache headers |

The compression step exists because the deployment tooling takes file contents inline and the
arcade is 250 KB; brotli brings that to 63 KB. What actually gets served is the ordinary,
complete HTML file — the packing is a transport detail, not a runtime one.

## Notes

* High scores, the 2048 best score and the Memory Match leaderboard are stored in
  `localStorage`, so they persist per browser/device.
* Sound is generated with the WebAudio API (no audio files); toggle it top-right.
* Deep links work: `index.html#shooter`, `#snake`, `#memory`, `#g2048`, `#tetris`,
  `#pong`, `#breakout`, `#mines`, `#climber`, `#bike`, plus `#profile`, `#shop` and `#hall`.
