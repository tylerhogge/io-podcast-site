export type Review = {
  id: string;
  title: string;
  body: string;
  author: string;
  date?: string;
  rating: number;
  source: 'Apple Podcasts' | 'Spotify';
};

// Add new reviews here. (Edits via Cowork are easy — just append to the array.)
export const REVIEWS: Review[] = [
  {
    id: '13543308500901',
    title: 'Must listen for all aspiring entrepreneurs and investors',
    body: "Loving this podcast. Tyler and Sterling ask direct and thoughtful questions of some of the smartest startup minds around. Tons of golden nuggets in each episode.",
    author: 'Murph33',
    date: 'Aug. 19, 2023',
    rating: 5,
    source: 'Apple Podcasts',
  },
  {
    id: 'jc66-tech-leaders',
    title: 'Great podcast for Tech Leaders!',
    body: 'Very informative. Great guests. Strong conversations that highlight the key issues efficiently! I learned a lot!',
    author: 'JC66',
    rating: 5,
    source: 'Apple Podcasts',
  },
];
