'use client';

import { useRef } from 'react';
import type { Chapter } from '@/lib/rss';

export default function EpisodePlayer({
  audioUrl,
  chapters,
  descriptionHtml,
}: {
  audioUrl: string;
  chapters: Chapter[];
  descriptionHtml: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const seek = (seconds: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = seconds;
    a.play().catch(() => {});
    a.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div>
      {audioUrl && (
        <audio ref={audioRef} controls preload="none" className="w-full" src={audioUrl}>
          Your browser does not support audio.
        </audio>
      )}

      {chapters.length > 0 && (
        <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-800/40 p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">Chapters</h2>
          <ul className="divide-y divide-ink-800">
            {chapters.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => seek(c.seconds)}
                  className="w-full text-left flex items-baseline gap-3 py-2 group"
                >
                  <span className="font-mono text-xs text-accent tabular-nums w-16 shrink-0 group-hover:underline">
                    {c.display}
                  </span>
                  <span className="text-sm text-ink-200 group-hover:text-ink-50">{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="prose-invert text-ink-200 mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </div>
  );
}
