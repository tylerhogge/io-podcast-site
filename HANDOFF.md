# IO Podcast Website — Project Handoff

> Snapshot of context for continuing work on `investoroperator.io`.
> If you're a Claude reading this: everything you need to jump in is here. If you're Tyler: this is the doc you'd hand a new engineer.

---

## What it is

**Live site:** https://www.investoroperator.io
**Purpose:** Public website for The Investor + Operator (IO) Podcast. Rebuilt from Podpage ($20/month) into a self-hosted Next.js site to cut the subscription and give full control over design, content, and integrations.
**Hosts:** Tyler Hogge (investor) and Sterling Snow (operator).
**Podcast platform:** Captivate.fm.

---

## Stack

- **Framework:** Next.js 14 (App Router, RSC, ISR)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **XML parsing:** `fast-xml-parser`
- **Hosting:** Vercel (auto-deploys from `main` branch on GitHub push)
- **Node:** 22+ (Vercel default)
- **No database, no auth** — content is pulled at request time from external feeds and cached via Next's `revalidate`

---

## Where things live

| Thing | Location |
|---|---|
| Local dev folder (canonical) | `/Users/tyler/Downloads/io-podcast-site/` |
| GitHub repo | https://github.com/tylerhogge/io-podcast-site |
| Vercel project | https://vercel.com/tyler-hogges-projects/io-podcast-site |
| Domain registrar | Squarespace (formerly Google Domains) |
| Podcast RSS | https://feeds.captivate.fm/the-investor-operator/ |
| YouTube channel | https://www.youtube.com/@IO-Podcast (channel ID `UCayuY0VO95kQTUXJvh9T0oQ`) |

---

## Environment variables (Vercel)

Set in **Vercel → io-podcast-site → Settings → Environment Variables**. Both marked as Sensitive, present in Production and Preview.

| Name | Purpose |
|---|---|
| `YOUTUBE_API_KEY` | YouTube Data API v3 key. Powers `/videos` (fetches all uploads, not just RSS-limited 15) and episode-view-count matching for "Most Popular" ranking. |
| `NEXT_PUBLIC_SHEET_WEBHOOK_URL` | Google Apps Script Web App URL. Email signups POST here; the script appends a row to Tyler's "IO Subscribers" Google Sheet. `NEXT_PUBLIC_` prefix means it's baked into the client bundle at build time — after changing it, always redeploy. |

If either is missing:
- No `YOUTUBE_API_KEY` → `/videos` falls back to the free RSS feed (last 15 videos only) and homepage "Most Popular" ranking silently degrades to recency.
- No `NEXT_PUBLIC_SHEET_WEBHOOK_URL` → email form renders but submissions error out client-side.

---

## Architecture at a glance

```
src/
├── app/
│   ├── layout.tsx           # Root layout, dynamic OG metadata from RSS
│   ├── page.tsx             # Homepage: hero, latest banner, "Most popular" grid, listen-on, email, review
│   ├── globals.css
│   ├── icon.svg             # Favicon: "IO" white on black
│   ├── robots.ts + sitemap.ts
│   ├── episodes/
│   │   ├── page.tsx         # All episodes, search + season filter + sort (recent | popular)
│   │   └── [slug]/page.tsx  # Single episode, audio player + chapters + full description
│   ├── videos/page.tsx      # YouTube grid pulled via Data API, client-side search
│   ├── about/page.tsx       # About + host bios (BIOS ARE STILL PLACEHOLDERS — see "What's pending")
│   └── reviews/page.tsx     # Reviews grid + leave-a-review CTA
├── components/
│   ├── Header.tsx           # Sticky nav
│   ├── Footer.tsx           # 3-col footer with site + socials
│   ├── EpisodeCard.tsx
│   ├── EpisodeGrid.tsx      # Client component: search over episodes
│   ├── EpisodePlayer.tsx    # Client component: audio + clickable chapter list (seeks audio)
│   ├── VideoGrid.tsx        # Client component: search over videos
│   ├── ListenOn.tsx         # Apple / Spotify / YouTube gradient cards
│   └── EmailSignup.tsx      # Client component: POSTs to Google Sheet webhook
└── lib/
    ├── rss.ts               # Fetches + parses Captivate RSS, exposes fetchEpisodes/fetchChannel, chapter parser
    ├── youtube.ts           # YouTube Data API integration (uploads playlist + view counts + durations), RSS fallback
    ├── popularity.ts        # Matches episodes ↔ YouTube videos by title-token overlap, ranks by views
    └── reviews.ts           # Hardcoded review array (Apple only exposes 2 total via their public feed)
```

---

## Content data sources — how the site stays fresh

1. **Episodes** — Pulled from Captivate RSS (`fetchEpisodes` in `src/lib/rss.ts`), cached in-memory + revalidated every 30 min via ISR. New episode drops within 30 min of publishing to Captivate. No code change needed.
2. **Podcast cover image** — Pulled from `<itunes:image>` in the Captivate RSS. Update the artwork in Captivate → site updates automatically within 30 min. (For a period the URL was hardcoded; that was fixed.)
3. **YouTube videos** — Pulled via `youtube.googleapis.com/youtube/v3/playlistItems` for the uploads playlist. Paginates through all pages. View counts + durations fetched via `videos.list`. Cached 1 hour.
4. **Reviews** — Manually maintained in `src/lib/reviews.ts`. Apple's public reviews feed only returns ~2 reviews for this podcast; Spotify has no public reviews API. Adding future reviews = append to that array.
5. **Email signups** — POST from `EmailSignup.tsx` to a Google Apps Script Web App → appends a row to Google Sheet "IO Subscribers" (owned by tyler@pelionvp.com Google account currently). Fire-and-forget with `mode: 'no-cors'`; the client optimistically shows success.
6. **Season filter fix** — Captivate left Season 1 (episodes 1–16) without an `<itunes:season>` tag. `rss.ts` defaults any missing tag to `1` so the Season 1 / Season 2 chips render correctly on `/episodes`.
7. **"Most Popular" ranking** — Episodes are matched to YouTube videos by tokenizing titles (stopwords removed, min 50% overlap). Only videos ≥ 15 min qualify (excludes clips + shorts). Ranked by view count. See `src/lib/popularity.ts`.

---

## Recent decisions worth remembering

- **Tagline:** "Real conversations with the world's best operators and investors. Practical advice founders actually use. Hosted by Tyler Hogge and Sterling Snow. LFG." (LFG in hero + footer + meta; not on About page — feels off-tone in a longer paragraph.)
- **Homepage default:** "Most Popular" grid (top 12 by YouTube views), NOT "Recent." Latest-episode banner kept above it for freshness signal.
- **`/episodes` default sort:** Popular (Recent available as toggle).
- **All Pelion references removed from site.** Tyler recently left Pelion; the podcast is currently not affiliated with a firm on the website. Cover art still has "BROUGHT TO YOU BY PELION" burned in — Tyler was going to upload a cleaned version (`io-podcast-cover-no-pelion.jpg`, delivered by earlier session) to Captivate but hasn't yet as of this handoff.
- **Custom domain flow:** DNS lives at Squarespace. A record `@ → 216.150.1.1`, CNAME `www → f835eea2d678551e.vercel-dns-016.com`. Google Workspace MX records preserved untouched.
- **Cover art favicon:** Simple SVG at `src/app/icon.svg` — black rounded square, white "IO." Auto-discovered by Next.

---

## The workflow (READ THIS)

Tyler is not a developer and does not want to touch Terminal. The workflow that works:

1. Tyler asks in Cowork/chat: "make X do Y"
2. Claude edits files under `/Users/tyler/Downloads/io-podcast-site/` (via mounted Cowork folder)
3. **Claude does NOT commit from the sandbox** — it consistently orphans lock files (`.git/HEAD.lock`, `.git/index.lock`) that the macOS↔sandbox mount refuses to let it delete
4. Tyler opens **GitHub Desktop**, sees the changed files, accepts the auto-generated commit summary, clicks **Commit** then **Push origin**
5. Vercel auto-deploys within 1–2 min

**If GitHub Desktop shows a "lock file exists" error**, one-time cleanup:
```bash
find /Users/tyler/Downloads/io-podcast-site/.git -name "*.lock" -delete
```
This happens when Claude has committed from the sandbox (which it shouldn't do going forward — that policy is baked in).

**Config already set on this repo** to reduce lock recurrence:
```
gc.auto = 0
maintenance.auto = false
core.fsmonitor = false
```

---

## Local development

```bash
cd /Users/tyler/Downloads/io-podcast-site
npm install
YOUTUBE_API_KEY='<key>' npm run dev
# http://localhost:3000
```

Prod build check:
```bash
YOUTUBE_API_KEY='<key>' npm run build
```

---

## What's shipped (state of the site as of this handoff)

- ✅ Hero with podcast cover, tagline ("LFG."), and 4 CTAs (Browse all episodes + Apple/Spotify/YouTube subscribe with brand-color icons)
- ✅ Latest-episode banner
- ✅ "Most Popular" top-12 grid (from YouTube view counts)
- ✅ "Listen anywhere" gradient cards
- ✅ Email signup → Google Sheet
- ✅ Reviews teaser
- ✅ `/episodes` — 32 episodes, season filter (S1/S2), sort toggle (Recent/Popular, default Popular), search
- ✅ `/episodes/[slug]` — audio player, clickable chapter timestamps that seek, prev/next
- ✅ `/videos` — 180 videos from YouTube Data API, live search
- ✅ `/about` — text-only bios (PLACEHOLDER — needs real bios; see below)
- ✅ `/reviews` — 2 reviews (all Apple has), redesigned with prominent rate-the-show CTA
- ✅ Dynamic OG metadata + sitemap + robots
- ✅ Favicon (IO)

---

## What's pending

**The About page bios are placeholders written by Claude.** Tyler no longer works at Pelion (was previously a Partner there); the current bios just say "Investor" / "Operator" without specifics. Rewrite blocked on Tyler providing:
- His current role/company
- Sterling's current role/company
- Any bio color they want (companies built, exits, years in industry, notable investments)
- Whether they want headshots or keep text-only

**Cover art still contains "BROUGHT TO YOU BY PELION"** on the version Captivate serves. Cleaned version file `io-podcast-cover-no-pelion.jpg` is in Tyler's Downloads; needs uploading to Captivate.

---

## Known quirks & gotchas

- **`NEXT_PUBLIC_` env vars are baked at build time.** Change `NEXT_PUBLIC_SHEET_WEBHOOK_URL` in Vercel → must redeploy for it to take effect.
- **Google Apps Script Web App URL** is fine to be visible in the client bundle (`NEXT_PUBLIC_`), but the Apps Script must have "Who has access: Anyone" or POSTs get bounced.
- **Testing the Sheet webhook via curl looks like a failure but isn't** — Apps Script responds via a 302 redirect to `script.googleusercontent.com` which returns 405 to non-browser clients. The `doPost` still ran and wrote the row. The live form uses `mode: 'no-cors'`, so this quirk doesn't affect real submissions.
- **Popularity matching is fuzzy.** Currently 31 of 32 episodes match a YouTube video. The one that doesn't ("The Best Podcast For Early Stage Founders - Season 2") is a season trailer without a standalone video — correctly falls to bottom.
- **YouTube quota:** Free tier 10,000 units/day. Full fetch of ~180 videos ≈ 8 units per build (paginated `playlistItems` + batched `videos.list`). Site caches results 1 hour. No realistic quota concern.
- **API key was previously leaked in chat.** Tyler chose not to rotate it. Still works.

---

## Common change recipes

**Add a new review:** append to `REVIEWS` array in `src/lib/reviews.ts`.

**Change tagline:** update 4 places — `src/app/layout.tsx` (DESCRIPTION), `src/app/page.tsx` (hero `<p>`), `src/components/Footer.tsx` (footer blurb), `src/app/about/page.tsx` (intro paragraph). About page usually skips "LFG" for tone.

**Change accent color:** edit `accent` in `tailwind.config.ts` (currently `#81B0E6`).

**Add a nav link:** edit `NAV` array in `src/components/Header.tsx` (and mirror in `src/components/Footer.tsx` "Site" list if desired).

**Update podcast cover:** upload new artwork in Captivate → site reads it automatically. No code change.

**Add a section to homepage:** insert JSX in `src/app/page.tsx`. All sections are stacked `<section>` blocks.

---

## Contact / accounts

- **GitHub:** `tylerhogge`
- **Vercel:** Tyler Hogge's projects (Pro plan)
- **Google (Apps Script + YouTube API + Sheet):** `tylerhogge@gmail.com`
- **Squarespace (domain):** Tyler's account
- **Captivate:** Tyler's account

---

## Session history / origin

Site was rebuilt from scratch in a single session (Aug 2026 timeframe) as a Podpage replacement. Iterative improvements followed:
1. Initial build + custom domain migration
2. Pelion removal (nav, footer, hero, About) after Tyler's departure
3. Favicon added
4. YouTube Data API integration (15 → 180 videos)
5. Compact hero CTAs with brand-color platform icons
6. Video search bar
7. Dynamic cover art pulled from RSS (previously hardcoded URL)
8. "Most Popular" homepage + Recent/Popular sort toggle on episodes
9. Season 1 filter fix (RSS gap workaround)
10. Chapter-dump cleanup in card blurbs
11. Tagline iterations (landed on "LFG" version)
12. Footer decluttered ("Built with Next.js" line removed)
13. Reviews redesigned (2 reviews + strong CTA)
14. Episode search
15. Clickable chapter timestamps on episode pages
16. Email capture → Google Sheet

---

**When continuing this work: read this file, then read `README.md` for deploy specifics, then look at `src/lib/rss.ts` and `src/lib/popularity.ts` — those are the two files where the site's "intelligence" lives.**
