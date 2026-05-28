import { fetchEpisodes, type Episode } from './rss';
import { fetchYouTubeVideos, type YouTubeVideo } from './youtube';

export type RankedEpisode = Episode & {
  views: number;
  matchedVideoTitle: string | null;
};

// Common words to ignore when comparing titles (don't help identify an episode).
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'w',
  'is', 'are', 'how', 'why', 'what', 'this', 'that', 'i', 'you', 'your', 'my',
  'convo', 'episode', 'ep', 'feat', 'featuring', 'vs',
]);

function tokenize(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

// Jaccard-style overlap weighted toward how much of the EPISODE title is found
// in the video title (full episodes on YouTube usually contain the episode title).
function matchScore(epTokens: Set<string>, vidTokens: Set<string>): number {
  if (epTokens.size === 0) return 0;
  let shared = 0;
  for (const t of epTokens) if (vidTokens.has(t)) shared++;
  return shared / epTokens.size;
}

const MATCH_THRESHOLD = 0.5; // at least half of the episode's keywords present
const MIN_FULL_EPISODE_SECONDS = 900; // 15 min — excludes clips and shorts

export async function fetchRankedEpisodes(): Promise<RankedEpisode[]> {
  const [episodes, videos] = await Promise.all([fetchEpisodes(), fetchYouTubeVideos()]);

  // Only match against full-length episode videos (skip clips and shorts).
  const fullEpisodes = videos.filter((v) => v.durationSeconds >= MIN_FULL_EPISODE_SECONDS);

  // Pre-tokenize videos once.
  const vids = fullEpisodes.map((v: YouTubeVideo) => ({ video: v, tokens: tokenize(v.title) }));

  const ranked: RankedEpisode[] = episodes.map((ep) => {
    const epTokens = tokenize(ep.title);
    let best: { views: number; title: string; score: number } | null = null;

    for (const { video, tokens } of vids) {
      const score = matchScore(epTokens, tokens);
      if (score >= MATCH_THRESHOLD && (!best || video.views > best.views)) {
        // Among videos that match well, prefer the one with the most views
        // (the full episode usually has more views than a clip with a partial title match).
        best = { views: video.views, title: video.title, score };
      }
    }

    return {
      ...ep,
      views: best?.views ?? 0,
      matchedVideoTitle: best?.title ?? null,
    };
  });

  return ranked;
}

export function sortByPopularity(episodes: RankedEpisode[]): RankedEpisode[] {
  return [...episodes].sort((a, b) => {
    if (b.views !== a.views) return b.views - a.views;
    // Tie-breaker: newer first
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
}

export function sortByRecency(episodes: RankedEpisode[]): RankedEpisode[] {
  return [...episodes].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
}
