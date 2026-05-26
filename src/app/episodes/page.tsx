import Link from 'next/link';
import { fetchEpisodes } from '@/lib/rss';
import EpisodeCard from '@/components/EpisodeCard';

export const revalidate = 1800;

export const metadata = {
  title: 'All Episodes',
  description: 'Every conversation from The Investor + Operator (IO) Podcast.',
};

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: { season?: string };
}) {
  const all = await fetchEpisodes();
  const season = searchParams.season;
  const filtered = season ? all.filter((e) => String(e.season) === season) : all;

  const seasons = Array.from(new Set(all.map((e) => e.season).filter(Boolean))).sort((a, b) => (b as number) - (a as number));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-accent uppercase tracking-widest text-xs font-semibold">{all.length} episodes</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-50">All episodes</h1>
        <p className="mt-3 text-ink-300 max-w-2xl">
          Every conversation. Filter by season or scroll the full archive.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/episodes"
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
              href={`/episodes?season=${s}`}
              className={`px-4 py-2 rounded-full text-sm border ${active ? 'bg-accent text-ink-900 border-accent' : 'border-ink-600 text-ink-200 hover:border-accent hover:text-accent'}`}
            >
              Season {s} ({count})
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ep) => <EpisodeCard key={ep.id} episode={ep} />)}
      </div>
    </div>
  );
}
