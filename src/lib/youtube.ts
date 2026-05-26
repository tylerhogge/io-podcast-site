import { XMLParser } from 'fast-xml-parser';

// YouTube channel handle: @IO-Podcast → channel ID: UCayuY0VO95kQTUXJvh9T0oQ
const CHANNEL_ID = 'UCayuY0VO95kQTUXJvh9T0oQ';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  publishedFormatted: string;
};

export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
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
        publishedFormatted: new Date(published).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
        }),
      };
    });
  } catch {
    return [];
  }
}
