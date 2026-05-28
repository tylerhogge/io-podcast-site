import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchChannel } from '@/lib/rss';

const SITE_URL = 'https://www.investoroperator.io';
const TITLE = 'The Investor + Operator (IO) Podcast';
const DESCRIPTION =
  'Real conversations with the world’s best operators and investors — the kind founders actually use. Hosted by Tyler Hogge and Sterling Snow.';

export async function generateMetadata(): Promise<Metadata> {
  const channel = await fetchChannel();
  const cover = channel.image;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: TITLE, template: '%s · IO Podcast' },
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: SITE_URL,
      siteName: TITLE,
      images: [{ url: cover, width: 1400, height: 1400 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: [cover],
      site: '@IO__podcast',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-ink-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
