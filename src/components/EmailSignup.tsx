'use client';

import { useState } from 'react';

// Set this in Vercel → Environment Variables as NEXT_PUBLIC_SHEET_WEBHOOK_URL
// (the published Google Apps Script web-app URL). Until it's set, the form
// still renders but submissions will show a friendly error.
const WEBHOOK = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL || '';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      if (!WEBHOOK) throw new Error('Webhook not configured');
      await fetch(WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          email,
          source: 'investoroperator.io',
          timestamp: new Date().toISOString(),
        }),
      });
      // no-cors responses are opaque, so we optimistically confirm success
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-ink-700 bg-ink-800/40 p-8 sm:p-10 text-center">
          <p className="text-accent text-xs uppercase tracking-widest font-semibold">Stay in the loop</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-ink-50">Never miss an episode</h2>
          <p className="mt-3 text-ink-300 max-w-md mx-auto">
            New conversations with the best operators and investors, straight to your inbox. No spam, ever.
          </p>

          {status === 'done' ? (
            <p className="mt-6 text-accent font-medium">Thanks — you&apos;re on the list. 🎉</p>
          ) : (
            <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                placeholder="you@company.com"
                className="flex-1 bg-ink-900 border border-ink-600 rounded-full px-5 py-3 text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-light transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm text-red-400">
              Something went wrong. Please try again in a moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
