import { fetchYouTubeVideos } from '@/lib/youtube';

export const revalidate = 3600;

export const metadata = {
  title: 'Videos',
  description: 'Watch every episode of The Investor + Operator Podcast on YouTube.',
};

export default async function VideosPage() {
  const videos = await fetchYouTubeVideos();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-accent uppercase tracking-widest text-xs font-semibold">
          {videos.length > 0 ? `${videos.length} videos · Watch on YouTube` : 'Watch on YouTube'}
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-50">Videos</h1>
        <p className="mt-3 text-ink-300 max-w-2xl">
          Full conversations, clips, and shorts from the show.{' '}
          <a href="https://www.youtube.com/@IO-Podcast" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Subscribe on YouTube →
          </a>
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-2xl border border-ink-700 bg-ink-800/40 p-8 text-center">
          <p className="text-ink-300">
            Could not load videos right now. Visit{' '}
            <a href="https://www.youtube.com/@IO-Podcast" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              the IO Podcast YouTube channel
            </a>{' '}directly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-ink-800/60 border border-ink-700 hover:border-accent/60 transition-all overflow-hidden"
            >
              <div className="aspect-video bg-ink-700 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-accent text-ink-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-ink-400">{v.publishedFormatted}</p>
                <h3 className="mt-2 text-base font-semibold text-ink-50 group-hover:text-accent line-clamp-3">{v.title}</h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
