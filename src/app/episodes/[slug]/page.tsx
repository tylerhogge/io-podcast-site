import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchEpisodes, getEpisodeBySlug } from '@/lib/rss';

export const revalidate = 1800;

export async function generateStaticParams() {
  const episodes = await fetchEpisodes();
  return episodes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ep = await getEpisodeBySlug(params.slug);
  if (!ep) return {};
  return {
    title: ep.title,
    description: ep.description,
    openGraph: { title: ep.title, description: ep.description, images: [ep.image] },
  };
}

export default async function EpisodePage({ params }: { params: { slug: string } }) {
  const ep = await getEpisodeBySlug(params.slug);
  if (!ep) notFound();

  const all = await fetchEpisodes();
  const idx = all.findIndex((e) => e.slug === ep.slug);
  const prev = idx < all.length - 1 ? all[idx + 1] : null;
  const next = idx > 0 ? all[idx - 1] : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/episodes" className="text-ink-400 text-sm hover:text-accent">← All episodes</Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-1">
          <div className="aspect-square rounded-2xl overflow-hidden border border-ink-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-3">
            {ep.season && ep.episode && (
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                Season {ep.season} · Episode {ep.episode}
              </span>
            )}
            <span>{ep.pubDateFormatted}</span>
            {ep.duration && <span>· {ep.duration}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-50 leading-tight">{ep.title}</h1>

          {ep.audioUrl && (
            <div className="mt-6">
              <audio controls preload="none" className="w-full" src={ep.audioUrl}>
                Your browser does not support audio.
              </audio>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://podcasts.apple.com/us/podcast/id1678642609"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
            >
              Apple Podcasts
            </a>
            <a
              href="https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
            >
              Spotify
            </a>
            <a
              href="https://www.youtube.com/@IO-Podcast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div
        className="prose-invert text-ink-200 mt-12 max-w-none"
        dangerouslySetInnerHTML={{ __html: ep.descriptionHtml }}
      />

      <div className="mt-16 pt-8 border-t border-ink-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prev ? (
          <Link href={prev.link} className="block p-5 rounded-xl border border-ink-700 hover:border-accent transition-colors">
            <p className="text-xs text-ink-400">← Previous episode</p>
            <p className="text-ink-100 font-medium mt-1 line-clamp-2">{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={next.link} className="block p-5 rounded-xl border border-ink-700 hover:border-accent transition-colors sm:text-right">
            <p className="text-xs text-ink-400">Next episode →</p>
            <p className="text-ink-100 font-medium mt-1 line-clamp-2">{next.title}</p>
          </Link>
        ) : <div />}
      </div>
    </article>
  );
}
