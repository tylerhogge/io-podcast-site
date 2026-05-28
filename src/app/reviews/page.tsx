import { REVIEWS } from '@/lib/reviews';

export const metadata = {
  title: 'Reviews',
  description: 'What listeners are saying about The Investor + Operator (IO) Podcast.',
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center">
        <p className="text-accent uppercase tracking-widest text-xs font-semibold">From our listeners</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-50">What people are saying</h1>
        <p className="mt-4 text-ink-300 max-w-xl mx-auto">
          Operators, founders, and investors tune in every month. Here&apos;s what a few of them think.
        </p>
      </div>

      {/* Review cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {REVIEWS.map((r) => (
          <article key={r.id} className="flex flex-col rounded-2xl border border-ink-700 bg-ink-800/40 p-7">
            <Stars count={r.rating} />
            <h3 className="text-lg font-semibold text-ink-50 mt-4">{r.title}</h3>
            <p className="text-ink-200 mt-3 leading-relaxed flex-1">&ldquo;{r.body}&rdquo;</p>
            <p className="mt-5 text-sm text-ink-400">
              {r.author}
              {r.date ? ` · ${r.date}` : ''} · {r.source}
            </p>
          </article>
        ))}
      </div>

      {/* Leave a review CTA */}
      <div className="mt-10 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-8 sm:p-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink-50">Enjoying the show?</h2>
        <p className="mt-3 text-ink-300 max-w-lg mx-auto">
          A quick rating is the single best way to help more operators and investors discover the podcast. It takes 20 seconds.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="https://podcasts.apple.com/us/podcast/id1678642609?mt=2&ls=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-light transition-colors"
          >
            Rate on Apple Podcasts
          </a>
          <a
            href="https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
          >
            Rate on Spotify
          </a>
        </div>
      </div>
    </div>
  );
}
