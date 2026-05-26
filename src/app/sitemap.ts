import { fetchEpisodes } from '@/lib/rss';

const BASE = 'https://www.investoroperator.io';

export default async function sitemap() {
  const episodes = await fetchEpisodes();
  const staticRoutes = ['', '/episodes', '/videos', '/about', '/reviews'].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
  }));
  const episodeRoutes = episodes.map((e) => ({
    url: `${BASE}${e.link}`,
    lastModified: new Date(e.pubDate),
  }));
  return [...staticRoutes, ...episodeRoutes];
}
