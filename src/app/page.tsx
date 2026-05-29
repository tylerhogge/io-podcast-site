import Link from 'next/link';
import { fetchEpisodes, fetchChannel } from '@/lib/rss';
import { fetchRankedEpisodes, sortByPopularity } from '@/lib/popularity';
import EpisodeCard from '@/components/EpisodeCard';
import ListenOn from '@/components/ListenOn';
import EmailSignup from '@/components/EmailSignup';

export const revalidate = 1800;

export default async function Home() {
  const [episodes, channel, ranked] = await Promise.all([
    fetchEpisodes(),
    fetchChannel(),
    fetchRankedEpisodes(),
  ]);
  const popular = sortByPopularity(ranked).slice(0, 12);
  const latest = episodes[0];
  const COVER = channel.image;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
        <div className="absolute inset-0 -z-10 opacity-30"
          style={{ background: 'radial-gradient(800px 400px at 50% 0%, rgba(129,176,230,0.18), transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="text-accent uppercase tracking-widest text-xs font-semibold">New episodes drop monthly</p>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-50 leading-[1.05]">
                The Investor + Operator <span className="text-accent">(IO)</span> Podcast
              </h1>
              <p className="mt-6 text-lg text-ink-200 max-w-2xl leading-relaxed">
                Real conversations with the world&apos;s best operators and investors with practical
                advice founders actually use. Hosted by Tyler Hogge and Sterling Snow.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  href="/episodes"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-accent text-ink-900 font-semibold text-sm hover:bg-accent-light transition-colors"
                >
                  Browse all episodes
                </Link>
                <span className="hidden sm:inline-block w-px h-6 bg-ink-700 mx-1" aria-hidden="true" />
                <a
                  href="https://podcasts.apple.com/us/podcast/id1678642609"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Listen on Apple Podcasts"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ink-600 text-ink-100 text-sm hover:border-accent hover:text-accent transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#A855F7" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5.4c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zm0 7.65c.51 0 .98.11 1.4.31l-.46 5.49a.95.95 0 0 1-.94.86h-.01a.95.95 0 0 1-.94-.86l-.46-5.49c.43-.2.9-.31 1.41-.31z"/>
                  </svg>
                  Apple
                </a>
                <a
                  href="https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Listen on Spotify"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ink-600 text-ink-100 text-sm hover:border-accent hover:text-accent transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </a>
                <a
                  href="https://www.youtube.com/@IO-Podcast?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe on YouTube"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ink-600 text-ink-100 text-sm hover:border-accent hover:text-accent transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-accent/10 border border-ink-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={COVER} alt="IO Podcast cover" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest episode banner */}
      {latest && (
        <section className="border-y border-ink-700 bg-ink-800/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={latest.image} alt={latest.title} className="w-28 h-28 rounded-xl object-cover border border-ink-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-accent text-xs uppercase tracking-widest font-semibold">Latest episode · {latest.pubDateFormatted}</p>
                <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-ink-50 line-clamp-2">{latest.title}</h2>
                <p className="mt-2 text-ink-300 text-sm line-clamp-2">{latest.description}</p>
              </div>
              <Link
                href={latest.link}
                className="inline-flex items-center px-5 py-3 rounded-full bg-accent text-ink-900 font-semibold whitespace-nowrap hover:bg-accent-light transition-colors"
              >
                Listen now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Most popular episodes */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-50">Most popular</h2>
              <p className="text-ink-300 mt-2">The most-watched conversations with the operators and investors building the future.</p>
            </div>
            <Link href="/episodes" className="text-accent text-sm font-medium hover:underline shrink-0">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.map((ep) => <EpisodeCard key={ep.id} episode={ep} />)}
          </div>
        </div>
      </section>

      <ListenOn />

      <EmailSignup />

      {/* Reviews teaser */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-xs uppercase tracking-widest font-semibold">From our listeners</p>
          <blockquote className="mt-5 text-2xl sm:text-3xl font-medium text-ink-100 leading-snug">
            “Tyler and Sterling ask direct and thoughtful questions of some of the smartest startup minds around. Tons of golden nuggets in each episode.”
          </blockquote>
          <p className="mt-4 text-ink-400 text-sm">Murph33 · Apple Podcasts</p>
          <Link href="/reviews" className="inline-block mt-8 text-accent hover:underline text-sm font-medium">
            Read more reviews →
          </Link>
        </div>
      </section>
    </>
  );
}
