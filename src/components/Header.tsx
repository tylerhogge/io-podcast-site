'use client';
import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  { href: '/episodes', label: 'Episodes' },
  { href: '/videos', label: 'Videos' },
  { href: '/about', label: 'About' },
  { href: 'https://pelionvp.com/', label: 'Pelion', external: true },
  { href: '/reviews', label: 'Reviews' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-ink-900/80 border-b border-ink-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-accent font-bold text-xl tracking-tight">IO</span>
          <span className="hidden sm:inline text-ink-200 text-sm">The Investor + Operator Podcast</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              {...(n.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-sm text-ink-200 hover:text-accent transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-ink-200"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-700 bg-ink-900">
          <nav className="px-4 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                {...(n.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-base text-ink-100 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
