import Link from 'next/link';

export const metadata = {
  title: 'About',
  description: 'About The Investor + Operator (IO) Podcast, the hosts, and Pelion Venture Partners.',
};

const COVER = 'https://artwork.captivate.fm/4c919b97-7dba-4b4e-9752-ba2dcb35f2b7/vjokUePq8hkchxqh20VMQVnX.jpg';

export default function AboutPage() {
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
            The Investor + Operator (IO) Podcast hosts the most candid, applicable conversations
            about building companies with the world&apos;s best operators and investors. New
            episodes drop monthly.
          </p>
          <p>
            The show is brought to you by{' '}
            <a href="https://pelionvp.com/" target="_blank" rel="noopener noreferrer">Pelion Venture Partners</a>,
            an early-stage venture firm investing in software companies with conviction and
            patience since 1986.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-ink-50">The Hosts</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-ink-700 bg-ink-800/40 p-6">
            <h3 className="text-xl font-semibold text-ink-50">Tyler Hogge</h3>
            <p className="text-accent text-sm mt-1">Partner, Pelion Venture Partners</p>
            <p className="text-ink-300 text-sm mt-4 leading-relaxed">
              Tyler is a partner at Pelion Venture Partners. He brings an investor&apos;s lens to
              every conversation — what makes companies durable, what separates great founders,
              and what investors are actually looking for.
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
          Want to suggest a guest, share feedback, or work with Pelion? Reach out via{' '}
          <a href="https://twitter.com/IO__podcast" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">X / Twitter</a>{' '}
          or visit{' '}
          <a href="https://pelionvp.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">pelionvp.com</a>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/episodes" className="inline-flex items-center px-5 py-3 rounded-full bg-accent text-ink-900 font-semibold hover:bg-accent-light transition-colors">
            Listen to episodes
          </Link>
          <a href="https://pelionvp.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-3 rounded-full border border-ink-600 text-ink-100 hover:border-accent hover:text-accent transition-colors">
            Visit Pelion
          </a>
        </div>
      </section>
    </div>
  );
}
