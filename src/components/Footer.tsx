import Link from 'next/link';

const SOCIALS = [
  { href: 'https://www.youtube.com/@IO-Podcast', label: 'YouTube' },
  { href: 'https://twitter.com/IO__podcast', label: 'X / Twitter' },
  { href: 'https://www.tiktok.com/@io_podcast', label: 'TikTok' },
  { href: 'https://podcasts.apple.com/us/podcast/id1678642609', label: 'Apple Podcasts' },
  { href: 'https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG', label: 'Spotify' },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-700 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-accent font-bold text-lg">The Investor + Operator (IO) Podcast</h3>
            <p className="text-ink-300 text-sm mt-3 leading-relaxed">
              Real conversations with the world&apos;s best operators and investors with practical advice founders actually use.
            </p>
          </div>

          <div>
            <h4 className="text-ink-100 font-semibold text-sm uppercase tracking-wider">Site</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/episodes" className="text-ink-300 hover:text-accent">Episodes</Link></li>
              <li><Link href="/videos" className="text-ink-300 hover:text-accent">Videos</Link></li>
              <li><Link href="/about" className="text-ink-300 hover:text-accent">About</Link></li>
              <li><Link href="/reviews" className="text-ink-300 hover:text-accent">Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-ink-100 font-semibold text-sm uppercase tracking-wider">Listen & Follow</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-ink-300 hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-800 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} The Investor + Operator (IO) Podcast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
