import Link from 'next/link';
import { fetchRankedEpisodes, sortByPopularity, sortByRecency } from '@/lib/popularity';
import EpisodeGrid from '@/components/EpisodeGrid';

export const revalidate = 1800;

export const metadata = {
  title: 'All Episodes',
  description: 'Every conversation from The Investor + Operator (IO) Podcast.',
};

type SortKey = 'recent' | 'popular';

function buildHref(season: string | undefined, sort: SortKey): string {
  const params = new URLSearchParams();
  if (season) params.set('season', season);
  // Default sort is 'popular', so only add the param when it differs.
  if (sort !== 'popular') params.set('sort', sort);
  const qs = params.toString();
  return qs ? `/episodes?${qs}` : '/episodes';
}

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: { season?: string; sort?: string };
}) {
  const all = await fetchRankedEpisodes();
  const season = searchParams.season;
  const sort: SortKey = searchParams.sort === 'recent' ? 'recent' : 'popular';

  const seasonFiltered = season ? all.filter((e) => String(e.season) === season) : all;
  const sorted = sort === 'popular' ? sortByPopularity(seasonFiltered) : sortByRecency(seasonFiltered);

  const seasons = Array.from(new Set(all.map((e) => e.season).filter(Boolean))).sort(
    (a, b) => (b as number) - (a as number),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-accent uppercase tracking-widest text-xs font-semibold">{all.length} episodes</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-50">All episodes</h1>
        <p className="mt-3 text-ink-300 max-w-2xl">
          Every conversation. Filter by season and sort by most recent or most popular.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        {/* Season filters */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(undefined, sort)}
            className={`px-4 py-2 rounded-full text-sm border ${!season ? 'bg-accent text-ink-900 border-accent' : 'border-ink-600 text-ink-200 hover:border-accent hover:text-accent'}`}
          >
            All ({all.length})
          </Link>
          {seasons.map((s) => {
            const count = all.filter((e) => e.season === s).length;
            const active = season === String(s);
            return (
              <Link
                key={s}
                href={buildHref(String(s), sort)}
                className={`px-4 py-2 rounded-full text-sm border ${active ? 'bg-accent text-ink-900 border-accent' : 'border-ink-600 text-ink-200 hover:border-accent hover:text-accent'}`}
              >
                Season {s} ({count})
              </Link>
            );
          })}
        </div>

        {/* Sort toggle */}
        <div className="inline-flex items-center rounded-full border border-ink-700 p-1 bg-ink-800/40 self-start sm:self-auto">
          <Link
            href={buildHref(season, 'recent')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${sort === 'recent' ? 'bg-accent text-ink-900 font-medium' : 'text-ink-300 hover:text-accent'}`}
          >
            Most recent
          </Link>
          <Link
            href={buildHref(season, 'popular')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${sort === 'popular' ? 'bg-accent text-ink-900 font-medium' : 'text-ink-300 hover:text-accent'}`}
          >
            Most popular
          </Link>
        </div>
      </div>

      <EpisodeGrid episodes={sorted} />
    </div>
  );
}
