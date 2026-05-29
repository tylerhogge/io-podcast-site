import Link from 'next/link';
import { fetchChannel } from '@/lib/rss';

export const revalidate = 1800;

export const metadata = {
  title: 'About',
  description: 'About The Investor + Operator (IO) Podcast and its hosts.',
};

export default async function AboutPage() {
  const channel = await fetchChannel();
  const COVER = channel.image;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-accent uppercase tracking-widest text-xs font-semibold">About</p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-50">The Investor + Operator (IO) Podcast</h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <div className="aspect-square rounded-2xl overflow-hidden border border-ink-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COVER} alt="IO Podcast cover" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-2 prose-invert text-ink-200">
          <p>
            The Investor + Operator (IO) Podcast brings you real conversations with the world&apos;s
            best operators and investors with practical advice founders actually use. New episodes drop monthly.
          </p>
          <p>
            Hosted by Tyler Hogge and Sterling Snow — an investor and an operator pulling tactical
            lessons out of every guest.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-ink-50">The Hosts</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-ink-700 bg-ink-800/40 p-6">
            <h3 className="text-xl font-semibold text-ink-50">Tyler Hogge</h3>
            <p className="text-accent text-sm mt-1">Investor</p>
            <p className="text-ink-300 text-sm mt-4 leading-relaxed">
              Tyler brings an investor&apos;s lens to every conversation — what makes companies
              durable, what separates great founders, and what investors are actually looking for.
            </p>
          </div>
          <div className="rounded-2xl border border-ink-700 bg-ink-800/40 p-6">
            <h3 className="text-xl font-semibold text-ink-50">Sterling Snow</h3>
            <p className="text-accent text-sm mt-1">Operator</p>
            <p className="text-ink-300 text-sm mt-4 leading-relaxed">
              Sterling brings the operator&apos;s perspective — the unglamorous reality of
              building, scaling, and shipping. Together with Tyler, they pull tactical lessons
              out of every guest.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-ink-50">Get in touch</h2>
        <p className="mt-3 text-ink-300">
          Want to suggest a guest or share feedback? Reach out via{' '}
          <a href="https://twitter.com/IO__podcast" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">X / Twitter</a>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/episodes" className="inline-flex items-center px-5 py-3 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-light transition-colors">
            Listen to episodes
          </Link>
        </div>
      </section>
    </div>
  );
}
