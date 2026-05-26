import { REVIEWS } from '@/lib/reviews';

export const metadata = {
  title: 'Reviews',
  description: 'What listeners are saying about The Investor + Operator (IO) Podcast.',
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-accent uppercase tracking-widest text-xs font-semibold">From our listeners</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-50">Reviews</h1>
      <p className="mt-3 text-ink-300 max-w-2xl">
        Loving the show? Leaving a review helps more operators and investors find it.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="https://podcasts.apple.com/us/podcast/id1678642609?mt=2&ls=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-3 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-light transition-colors"
        >
          Rate on Apple Podcasts
        </a>
        <a
          href="https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-3 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors"
        >
          Rate on Spotify
        </a>
      </div>

      <div className="mt-12 space-y-6">
        {REVIEWS.map((r) => (
          <article key={r.id} className="rounded-2xl border border-ink-700 bg-ink-800/40 p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <Stars count={r.rating} />
              <span className="text-xs text-ink-400">{r.source}</span>
            </div>
            <h3 className="text-lg font-semibold text-ink-50">{r.title}</h3>
            <p className="text-ink-200 mt-3 leading-relaxed">&ldquo;{r.body}&rdquo;</p>
            <p className="mt-4 text-sm text-ink-400">{r.author} · {r.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
