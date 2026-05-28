'use client';

import { useMemo, useState } from 'react';
import EpisodeCard from './EpisodeCard';
import type { RankedEpisode } from '@/lib/popularity';

export default function EpisodeGrid({ episodes }: { episodes: RankedEpisode[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return episodes;
    return episodes.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    );
  }, [query, episodes]);

  return (
    <>
      <div className="mb-8 max-w-xl">
        <label htmlFor="episode-search" className="sr-only">
          Search episodes
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="episode-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes by guest or topic..."
            className="w-full bg-ink-800/60 border border-ink-700 rounded-full pl-11 pr-12 py-3 text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-100 rounded-full w-7 h-7 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M6 18 18 6" />
              </svg>
            </button>
          )}
        </div>
        {query && (
          <p className="text-xs text-ink-400 mt-2 pl-2">
            {filtered.length === 0
              ? 'No episodes match your search.'
              : `${filtered.length} of ${episodes.length} episodes`}
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-ink-700 bg-ink-800/40 p-8 text-center">
          <p className="text-ink-300">
            No episodes match &ldquo;{query}&rdquo;.{' '}
            <button onClick={() => setQuery('')} className="text-accent hover:underline">
              Clear search
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ep) => <EpisodeCard key={ep.id} episode={ep} />)}
        </div>
      )}
    </>
  );
}
