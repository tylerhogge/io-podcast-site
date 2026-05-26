'use client';

import { useMemo, useState } from 'react';
import type { YouTubeVideo } from '@/lib/youtube';

export default function VideoGrid({ videos }: { videos: YouTubeVideo[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter((v) => v.title.toLowerCase().includes(q));
  }, [query, videos]);

  return (
    <>
      <div className="mb-8 max-w-xl">
        <label htmlFor="video-search" className="sr-only">
          Search videos
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="video-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos by title..."
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
              ? 'No videos match your search.'
              : `${filtered.length} of ${videos.length} videos`}
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-ink-700 bg-ink-800/40 p-8 text-center">
          <p className="text-ink-300">
            No videos match &ldquo;{query}&rdquo;.{' '}
            <button onClick={() => setQuery('')} className="text-accent hover:underline">
              Clear search
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-ink-800/60 border border-ink-700 hover:border-accent/60 transition-all overflow-hidden"
            >
              <div className="aspect-video bg-ink-700 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-accent text-ink-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-ink-400">{v.publishedFormatted}</p>
                <h3 className="mt-2 text-base font-semibold text-ink-50 group-hover:text-accent line-clamp-3">
                  {v.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
