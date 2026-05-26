import { fetchYouTubeVideos } from '@/lib/youtube';
import VideoGrid from '@/components/VideoGrid';

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
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}
