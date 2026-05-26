import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://feeds.captivate.fm/the-investor-operator/';

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

let cache: { data: Episode[]; ts: number } | null = null;
const TTL_MS = 1000 * 60 * 30; // 30 min

export async function fetchEpisodes(): Promise<Episode[]> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache.data;

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

  const items = data?.rss?.channel?.item || [];
  const list: Episode[] = (Array.isArray(items) ? items : [items]).map((it: any) => {
    const titleRaw = it.title?.__cdata || it.title?.['#text'] || it.title || '';
    const title = typeof titleRaw === 'string' ? titleRaw : String(titleRaw);
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

  cache = { data: list, ts: Date.now() };
  return list;
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | undefined> {
  const all = await fetchEpisodes();
  return all.find((e) => e.slug === slug);
}
