import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://feeds.captivate.fm/the-investor-operator/';
// Fallback cover used if the RSS feed is unreachable (e.g. at build time on a cold start).
// This is just a backup — normally the channel image comes straight from the feed.
const FALLBACK_COVER =
  'https://artwork.captivate.fm/4c919b97-7dba-4b4e-9752-ba2dcb35f2b7/vjokUePq8hkchxqh20VMQVnX.jpg';

export type Episode = {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionHtml: string;
  pubDate: string;
  pubDateFormatted: string;
  duration: string;
  audioUrl: string;
  image: string;
  season: number | null;
  episode: number | null;
  link: string;
};

export type Channel = {
  title: string;
  description: string;
  image: string;
  link: string;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-+|-+$/g, '');
}

function stripHtml(html: string): string {
  // Replace tags with spaces (not empty) so adjacent paragraphs don't merge words.
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Produce a clean short blurb for episode cards: drop chapter lists,
// "--" separators, subscribe boilerplate, and stray timestamps.
function cleanBlurb(html: string): string {
  let text = stripHtml(html);
  const markers = [/chapters\s*:/i, /\s--\s/, /subscribe for more/i, /this podcast was brought/i];
  let cut = text.length;
  for (const m of markers) {
    const match = text.match(m);
    if (match && match.index !== undefined && match.index < cut) cut = match.index;
  }
  text = text.slice(0, cut);
  // Remove any stray timestamps like (00:01:22) or 12:30
  text = text.replace(/\(?\d{1,2}:\d{2}(?::\d{2})?\)?/g, '').replace(/\s+/g, ' ').trim();
  return text.slice(0, 320);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export type Chapter = { seconds: number; display: string; label: string };

const CHAPTER_LINE = /^\(?(\d{1,2}):(\d{2})(?::(\d{2}))?\)?\s*[-–—]?\s*(.+)$/;

// Extract clickable chapters from an episode's HTML description.
export function parseChapters(html: string): Chapter[] {
  const lines = html.replace(/<[^>]+>/g, '\n').split('\n').map((l) => l.trim()).filter(Boolean);
  const chapters: Chapter[] = [];
  for (const line of lines) {
    const m = line.match(CHAPTER_LINE);
    if (!m) continue;
    let h = 0, mn = 0, s = 0;
    if (m[3] !== undefined) { h = +m[1]; mn = +m[2]; s = +m[3]; }
    else { mn = +m[1]; s = +m[2]; }
    const label = m[4].trim();
    if (!label || /^chapters/i.test(label)) continue;
    const seconds = h * 3600 + mn * 60 + s;
    const display = h > 0
      ? `${h}:${String(mn).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${mn}:${String(s).padStart(2, '0')}`;
    chapters.push({ seconds, display, label });
  }
  return chapters;
}

// Remove the chapter list + separators from the HTML so the description
// reads cleanly (chapters are shown as an interactive list instead).
export function descriptionWithoutChapters(html: string): string {
  return html
    .replace(/<p>([\s\S]*?)<\/p>/g, (full, inner: string) => {
      const t = inner.replace(/<[^>]+>/g, '').trim();
      if (/^chapters\s*:?\s*$/i.test(t)) return '';
      if (CHAPTER_LINE.test(t)) return '';
      if (t === '--' || t === '—') return '';
      return full;
    })
    .trim();
}

type FeedCache = {
  channel: Channel;
  episodes: Episode[];
  ts: number;
};
let cache: FeedCache | null = null;
const TTL_MS = 1000 * 60 * 30; // 30 min

async function fetchAndParseFeed(): Promise<FeedCache> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache;

  const res = await fetch(FEED_URL, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    textNodeName: '#text',
  });
  const data = parser.parse(xml);

  const ch = data?.rss?.channel || {};

  // Channel-level info (title, description, cover image)
  const titleRaw = ch.title?.__cdata || ch.title?.['#text'] || ch.title || '';
  const descRaw = ch.description?.__cdata || ch.description?.['#text'] || ch.description || '';
  const imageFromTag = ch.image?.url?.__cdata || ch.image?.url?.['#text'] || ch.image?.url || '';
  const imageFromItunes = ch['itunes:image']?.['@_href'] || '';
  const linkRaw = ch.link?.__cdata || ch.link?.['#text'] || (typeof ch.link === 'string' ? ch.link : '');

  const channel: Channel = {
    title: String(titleRaw || 'The Investor + Operator (IO) Podcast'),
    description: stripHtml(String(descRaw)),
    image: String(imageFromItunes || imageFromTag || FALLBACK_COVER),
    link: String(linkRaw || 'https://www.investoroperator.io/'),
  };

  // Episodes
  const items = ch.item || [];
  const list: Episode[] = (Array.isArray(items) ? items : [items]).map((it: any) => {
    const titleRaw2 = it.title?.__cdata || it.title?.['#text'] || it.title || '';
    const title = typeof titleRaw2 === 'string' ? titleRaw2 : String(titleRaw2);
    const descHtml = it.description?.__cdata || it.description?.['#text'] || it.description || '';
    const descHtmlStr = typeof descHtml === 'string' ? descHtml : String(descHtml);
    const guid = it.guid?.['#text'] || it.guid?.__cdata || it.guid || '';
    const id = typeof guid === 'string' ? guid : String(guid);
    const pubDate = it.pubDate || '';
    const audioUrl = it.enclosure?.['@_url'] || '';
    const image = it['itunes:image']?.['@_href'] || '';
    // Captivate left Season 1 episodes (1–16) without a season tag.
    // Default any untagged episode to Season 1 so it groups correctly.
    const season = it['itunes:season'] ? Number(it['itunes:season']) : 1;
    const episode = it['itunes:episode'] ? Number(it['itunes:episode']) : null;
    const duration = it['itunes:duration'] || '';

    return {
      id,
      slug: slugify(title),
      title,
      description: cleanBlurb(descHtmlStr),
      descriptionHtml: descHtmlStr,
      pubDate,
      pubDateFormatted: formatDate(pubDate),
      duration: String(duration),
      audioUrl,
      image,
      season,
      episode,
      link: `/episodes/${slugify(title)}`,
    };
  });

  list.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  cache = { channel, episodes: list, ts: Date.now() };
  return cache;
}

export async function fetchEpisodes(): Promise<Episode[]> {
  const { episodes } = await fetchAndParseFeed();
  return episodes;
}

export async function fetchChannel(): Promise<Channel> {
  try {
    const { channel } = await fetchAndParseFeed();
    return channel;
  } catch {
    // Fallback in case of network failure
    return {
      title: 'The Investor + Operator (IO) Podcast',
      description:
        'The most candid, applicable conversations about building companies with the world’s best operators and investors.',
      image: FALLBACK_COVER,
      link: 'https://www.investoroperator.io/',
    };
  }
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | undefined> {
  const all = await fetchEpisodes();
  return all.find((e) => e.slug === slug);
}
