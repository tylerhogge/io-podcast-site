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
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    const season = it['itunes:season'] ? Number(it['itunes:season']) : null;
    const episode = it['itunes:episode'] ? Number(it['itunes:episode']) : null;
    const duration = it['itunes:duration'] || '';

    return {
      id,
      slug: slugify(title),
      title,
      description: stripHtml(descHtmlStr).slice(0, 600),
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
