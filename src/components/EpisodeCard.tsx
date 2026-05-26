import Link from 'next/link';
import type { Episode } from '@/lib/rss';

export default function EpisodeCard({ episode, featured = false }: { episode: Episode; featured?: boolean }) {
  return (
    <Link
      href={episode.link}
      className={`group block rounded-2xl bg-ink-800/60 border border-ink-700 hover:border-accent/60 transition-all overflow-hidden ${featured ? 'md:col-span-2' : ''}`}
    >
      <div className="aspect-square bg-ink-700 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={episode.image}
          alt={episode.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-ink-400 mb-2">
          {episode.season && episode.episode && (
            <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              S{episode.season} · E{episode.episode}
            </span>
          )}
          <span>{episode.pubDateFormatted}</span>
          {episode.duration && <span>· {episode.duration}</span>}
        </div>
        <h3 className="text-lg font-semibold text-ink-50 group-hover:text-accent transition-colors line-clamp-3">
          {episode.title}
        </h3>
        <p className="text-sm text-ink-300 mt-3 line-clamp-3">{episode.description}</p>
        <span className="inline-flex items-center text-sm text-accent mt-4 font-medium">
          Listen →
        </span>
      </div>
    </Link>
  );
}
