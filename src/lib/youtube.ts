import { XMLParser } from 'fast-xml-parser';

// YouTube channel handle: @IO-Podcast → channel ID: UCayuY0VO95kQTUXJvh9T0oQ
const CHANNEL_ID = 'UCayuY0VO95kQTUXJvh9T0oQ';
// The "uploads" playlist for a channel uses the same ID with the second char replaced by 'U'.
// e.g. UCayuY0VO95kQTUXJvh9T0oQ -> UUayuY0VO95kQTUXJvh9T0oQ
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`;
const RSS_FALLBACK_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  publishedFormatted: string;
};

function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function fetchViaDataApi(apiKey: string): Promise<YouTubeVideo[]> {
  const all: YouTubeVideo[] = [];
  let pageToken: string | undefined = undefined;

  // Paginate through every page of uploads (up to 50 per call).
  // Each call costs 1 unit; free tier is 10,000/day.
  for (let i = 0; i < 20; i++) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('playlistId', UPLOADS_PLAYLIST_ID);
    url.searchParams.set('key', apiKey);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      // If the API fails (bad key, quota, etc.) bail out and return what we have.
      console.error('YouTube Data API error:', res.status, await res.text().catch(() => ''));
      break;
    }
    const data: any = await res.json();
    const items = data.items || [];

    for (const item of items) {
      const id = item?.contentDetails?.videoId || item?.snippet?.resourceId?.videoId || '';
      if (!id) continue;
      const snippet = item.snippet || {};
      const published = snippet.publishedAt || '';
      const title = snippet.title || '';
      const thumbs = snippet.thumbnails || {};
      const thumbnail =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

      // Filter out private/deleted entries that come back with placeholder titles.
      if (title === 'Private video' || title === 'Deleted video') continue;

      all.push({
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail,
        publishedAt: published,
        publishedFormatted: formatDate(published),
      });
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return all;
}

async function fetchViaRss(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_FALLBACK_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const data = parser.parse(xml);
    const entries = data?.feed?.entry || [];
    const list = Array.isArray(entries) ? entries : [entries];

    return list.map((e: any) => {
      const id = e['yt:videoId'] || '';
      const title = e.title || '';
      const published = e.published || '';
      return {
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: published,
        publishedFormatted: formatDate(published),
      };
    });
  } catch {
    return [];
  }
}

export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  let videos: YouTubeVideo[] = [];

  if (apiKey) {
    videos = await fetchViaDataApi(apiKey);
  }

  // Fall back to RSS if no key or API failed/returned nothing.
  if (videos.length === 0) {
    videos = await fetchViaRss();
  }

  // Sort newest first.
  videos.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return videos;
}
