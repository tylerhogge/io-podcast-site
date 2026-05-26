const PLATFORMS = [
  {
    name: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/us/podcast/id1678642609',
    color: 'from-pink-500 to-purple-600',
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/show/0J92LTLgpHe8C0CzEaCBDG',
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@IO-Podcast',
    color: 'from-red-500 to-red-700',
  },
];

export default function ListenOn() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-50">Listen anywhere</h2>
        <p className="text-ink-300 mt-3">Subscribe on your favorite platform.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.color} p-6 hover:scale-[1.02] transition-transform`}
            >
              <p className="text-xs text-white/70 uppercase tracking-widest">Listen on</p>
              <p className="text-2xl text-white font-bold mt-1">{p.name}</p>
              <span className="absolute top-4 right-4 text-white/80 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
