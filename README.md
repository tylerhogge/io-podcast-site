# The Investor + Operator (IO) Podcast — Website

A fast, modern, self-hosted replacement for the Podpage subscription. Built with Next.js, Tailwind, and the existing Captivate RSS feed.

**Live URL:** investoroperator.io (after Vercel deploy)

## What it does

- **Auto-pulls episodes** from your Captivate RSS feed (`https://feeds.captivate.fm/the-investor-operator/`). New episodes show up automatically — no code changes needed.
- **Auto-pulls videos** from your YouTube channel RSS (`@IO-Podcast`).
- **5 pages** matching your Podpage structure: Home, Episodes, Videos, About, Reviews — plus individual episode pages.
- **ISR (Incremental Static Regeneration)**: every page rebuilds itself every 30 minutes in the background, so your site stays fresh without manual deploys.
- **Modern dark UI** with the existing IO blue accent (`#81B0E6`), but cleaner typography, better mobile, and zero subscription fees.

## One-time setup (GitHub + Vercel)

### 1. Push to GitHub

```bash
cd io-podcast-site
git init
git add .
git commit -m "Initial commit: rebuild from Podpage"
gh repo create io-podcast-site --public --source=. --push
```

(If you don't have the `gh` CLI: create an empty repo at github.com, then `git remote add origin <url>` and `git push -u origin main`.)

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import the GitHub repo you just created
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy**
5. Add your custom domain `investoroperator.io` under **Settings → Domains**

Vercel will redeploy automatically every time you push to `main`. The free tier covers this easily.

### 3. Point your domain at Vercel

When you add `investoroperator.io` in Vercel, it'll tell you what DNS records to set. Update your registrar (wherever you bought the domain) accordingly. Once DNS propagates, you can cancel Podpage.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## How to update content (via Cowork)

Most things update themselves from RSS. For everything else, ask Claude to edit these files:

| What | File |
|---|---|
| Add/edit a review | `src/lib/reviews.ts` |
| Edit the About page copy | `src/app/about/page.tsx` |
| Edit hero text / tagline | `src/app/page.tsx` |
| Add a nav link | `src/components/Header.tsx` |
| Change colors / fonts | `tailwind.config.ts` + `src/app/globals.css` |

After any edit, just commit and push — Vercel handles the rest:

```bash
git add . && git commit -m "Update reviews" && git push
```

## Why this is better than Podpage

- **$0/month** instead of $20/month → saves $240/year
- **You own the code** — no lock-in, no surprise pricing changes
- **Faster** — static pages from Vercel's edge CDN
- **Better SEO** — proper OpenGraph tags, sitemaps, server-rendered HTML
- **Customizable** — change anything you want

## Stack

- Next.js 14 (App Router, RSC, ISR)
- Tailwind CSS
- `fast-xml-parser` for RSS
- Deployed on Vercel
