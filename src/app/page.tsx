import Link from 'next/link';
import { fetchEpisodes } from '@/lib/rss';
import EpisodeCard from '@/components/EpisodeCard';
import ListenOn from '@/components/ListenOn';

export const revalidate = 1800;

const COVER = 'https://artwork.captivate.fm/4c919b97-7dba-4b4e-9752-ba2dcb35f2b7/vjokUePq8hkchxqh20VMQVnX.jpg';

export default async function Home() {
  const episodes = await fetchEpisodes();
  const recent = episodes.slice(0, 6);
  const latest = episodes[0];

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
                The most candid, applicable conversations about building companies with the world&apos;s best
                operators and investors. Hosted by Tyler Hogge and Sterling Snow.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/episodes"
                  className="inline-flex items-center px-5 py-3 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-light transition-colors"
                >
                  Browse all episodes
                </Link>
                <a
                  href="https://podcasts.apple.com/us/podcast/id1678642609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
                >
                  Subscribe on Apple
                </a>
                <a
                  href="https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
                >
                  Subscribe on Spotify
                </a>
                <a
                  href="https://www.youtube.com/@IO-Podcast?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
                >
                  Subscribe on YouTube
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

      {/* Recent episodes */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-50">Recent episodes</h2>
              <p className="text-ink-300 mt-2">Fresh conversations with the operators and investors building the future.</p>
            </div>
            <Link href="/episodes" className="text-accent text-sm font-medium hover:underline shrink-0">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((ep) => <EpisodeCard key={ep.id} episode={ep} />)}
          </div>
        </div>
      </section>

      <ListenOn />

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
