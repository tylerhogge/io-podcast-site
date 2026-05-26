/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'artwork.captivate.fm' },
      { protocol: 'https', hostname: 'images.podpage.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};
module.exports = nextConfig;
