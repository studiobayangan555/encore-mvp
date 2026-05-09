import { Show, Review, BlogPost, Promoter } from '@/types'

export const SEA_COUNTRIES = [
  { code: 'MY', label: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { code: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { code: 'ID', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', label: 'Philippines', flag: '🇵🇭' },
]

export const SHOWS: Show[] = [
  { id: '1', artist: 'The Weeknd', venue: 'Axiata Arena', city: 'Kuala Lumpur', market: 'MY', date: '2026-06-14', dateDisplay: 'Sat 14 Jun 2026', price: 'From RM388', genre: 'R&B', type: 'concert', promoter: 'Live Nation Malaysia', promoterSlug: 'live-nation-malaysia', rating: 4.8, goingCount: 234, reviewCount: 47, commentCount: 47, isPast: false, description: 'The Weeknd returns to Kuala Lumpur for the After Hours Til Dawn Tour — a stadium-scale production featuring the full live band, pyrotechnics, and a two-hour setlist spanning his entire catalogue.', venueAddress: 'Bukit Jalil, Kuala Lumpur', venueMapsUrl: 'https://maps.google.com/?q=Axiata+Arena+Bukit+Jalil+Kuala+Lumpur', venueTransport: 'Nearest LRT: Bukit Jalil · Paid parking on-site' },
  { id: '2', artist: 'NIKI', venue: 'Zepp KL', city: 'Kuala Lumpur', market: 'MY', date: '2026-03-21', dateDisplay: 'Fri 21 Mar 2026', price: 'From RM188', genre: 'Pop', type: 'concert', promoter: 'Livescape Asia', promoterSlug: 'livescape-asia', rating: 4.9, goingCount: 189, reviewCount: 63, commentCount: 12, isPast: true, description: "NIKI brings the Nicole World Tour to her home region for an intimate run of shows. Expect deep cuts alongside fan favourites.", venueAddress: 'KL Sentral, Kuala Lumpur', venueMapsUrl: 'https://maps.google.com/?q=Zepp+KL', venueTransport: 'Nearest LRT: KL Sentral' },
  { id: '3', artist: 'Good Vibes Festival', venue: 'Genting Highlands', city: 'Kuala Lumpur', market: 'MY', date: '2026-08-08', dateDisplay: 'Sat–Sun 8–9 Aug 2026', price: 'From RM298', genre: 'Multi-genre', type: 'festival', promoter: 'Live Nation Malaysia', promoterSlug: 'live-nation-malaysia', rating: 4.5, goingCount: 1240, reviewCount: 312, commentCount: 38, isPast: false, description: 'Good Vibes Festival returns to the highlands for its 10th edition. Two stages, 30+ acts across two days.', venueAddress: 'Genting Highlands, Pahang', venueMapsUrl: 'https://maps.google.com/?q=Resorts+World+Genting', venueTransport: 'Bus from TBS or Pudu Sentral available' },
  { id: '4', artist: 'YOASOBI', venue: 'Singapore Indoor Stadium', city: 'Singapore', market: 'SG', date: '2026-04-02', dateDisplay: 'Thu 2 Apr 2026', price: 'From SGD 98', genre: 'J-Pop', type: 'concert', promoter: 'One Production', promoterSlug: 'one-production', rating: 4.7, goingCount: 456, reviewCount: 89, commentCount: 21, isPast: true, description: 'YOASOBI make their Singapore debut with a full production show.', venueAddress: 'Stadium Walk, Kallang, Singapore', venueMapsUrl: 'https://maps.google.com/?q=Singapore+Indoor+Stadium', venueTransport: 'Nearest MRT: Stadium' },
  { id: '5', artist: 'Billie Eilish', venue: 'Axiata Arena', city: 'Kuala Lumpur', market: 'MY', date: '2026-07-10', dateDisplay: '3 Nights — 10, 11, 12 Jul 2026', price: 'From RM488', genre: 'Pop', type: 'multi-night', promoter: 'Live Nation Malaysia', promoterSlug: 'live-nation-malaysia', rating: 4.9, goingCount: 678, reviewCount: 124, commentCount: 24, isPast: false, description: 'Three consecutive nights at Axiata Arena for the HIT ME HARD AND SOFT tour.', venueAddress: 'Bukit Jalil, Kuala Lumpur', venueMapsUrl: 'https://maps.google.com/?q=Axiata+Arena+Bukit+Jalil', venueTransport: 'Nearest LRT: Bukit Jalil' },
  { id: '6', artist: 'Pamungkas', venue: 'Jakarta International Stadium', city: 'Jakarta', market: 'ID', date: '2026-04-18', dateDisplay: 'Sat 18 Apr 2026', price: 'From IDR 450,000', genre: 'Indie Pop', type: 'concert', promoter: 'Ismaya Live', promoterSlug: 'ismaya-live', rating: 4.6, goingCount: 892, reviewCount: 201, commentCount: 55, isPast: true, description: "Pamungkas headlines JIS for the first time — a homecoming show of enormous scale.", venueAddress: 'Jakarta International Stadium, Jakarta Utara', venueMapsUrl: 'https://maps.google.com/?q=Jakarta+International+Stadium', venueTransport: 'KRL Commuter Line: Kemayoran' },
  { id: '7', artist: 'BamBam', venue: 'Impact Arena', city: 'Bangkok', market: 'TH', date: '2026-05-22', dateDisplay: 'Fri 22 May 2026', price: 'From THB 1,500', genre: 'K-pop', type: 'concert', promoter: 'Live Nation Thailand', promoterSlug: 'live-nation-thailand', rating: 4.8, goingCount: 320, reviewCount: 58, commentCount: 9, isPast: false, description: 'BamBam brings his solo world tour to Bangkok for a spectacular homecoming show.', venueAddress: 'Impact Arena, Muang Thong Thani, Nonthaburi', venueMapsUrl: 'https://maps.google.com/?q=Impact+Arena+Bangkok', venueTransport: 'MRT: Chaeng Watthana · Shuttle bus available' },
  { id: '8', artist: 'Yuna', venue: 'Merdekarya', city: 'Kuala Lumpur', market: 'MY', date: '2026-05-29', dateDisplay: 'Fri 29 May 2026', price: 'From RM60', genre: 'Folk', type: 'gig', promoter: 'Livescape Asia', promoterSlug: 'livescape-asia', rating: 4.7, goingCount: 120, reviewCount: 22, commentCount: 5, isPast: false, description: 'An intimate acoustic evening with Yuna at Merdekarya — one of KL\'s most beloved independent music spaces.', venueAddress: 'Merdekarya, Bangsar, Kuala Lumpur', venueMapsUrl: 'https://maps.google.com/?q=Merdekarya+Bangsar+KL', venueTransport: 'Nearest LRT: Bangsar' },
  { id: '9', artist: 'Ben&Ben', venue: 'SM Mall of Asia Arena', city: 'Manila', market: 'PH', date: '2026-09-05', dateDisplay: 'Sat 5 Sep 2026', price: 'From PHP 1,500', genre: 'Indie Folk', type: 'concert', promoter: 'Wilbros Live', promoterSlug: 'wilbros-live', rating: 4.9, goingCount: 540, reviewCount: 91, commentCount: 16, isPast: false, description: "Ben&Ben celebrate their 10th anniversary with a landmark show at the MOA Arena.", venueAddress: 'SM Mall of Asia Arena, Pasay, Metro Manila', venueMapsUrl: 'https://maps.google.com/?q=SM+Mall+of+Asia+Arena+Manila', venueTransport: 'LRT-1: EDSA · Bus routes available' },
]

export const REVIEWS: Review[] = [
  { id: '1', showId: '1', author: 'Amirah Rania', initials: 'AR', rating: 5, headline: 'Best show I have been to in five years. Full stop.', body: 'The production was on another level entirely. Pyrotechnics, lasers, a stage that extended halfway into the floor. He played for two hours fifteen minutes without a break and the crowd was with him every single second.', showCount: 34, date: '15 Jun 2026', sound: 5, visuals: 5, setlist: 5, crowd: 5, eventManagement: 4, vibes: ['Euphoric', 'High Energy'] },
  { id: '2', showId: '1', author: 'Danial Hakim', initials: 'DH', rating: 4, headline: 'Incredible production, slightly short setlist', body: 'Everything about the show felt premium. Sound at Axiata was the best I have heard there. Only gripe is he skipped a few deep cuts. Still a 4-star night easily.', showCount: 18, date: '15 Jun 2026', sound: 5, visuals: 5, setlist: 3, crowd: 4, eventManagement: 5, vibes: ['High Energy', 'Polished'] },
  { id: '3', showId: '2', author: 'Siti Nurhaliza F.', initials: 'SN', rating: 5, headline: 'She played for 90 minutes and I cried twice', body: "She played for 90 minutes to a crowd that knew every single word. There wasn't a phone in sight by the end. Genuinely one of the best nights of my life.", showCount: 52, date: '22 Mar 2026', sound: 5, visuals: 4, setlist: 5, crowd: 5, eventManagement: 5, vibes: ['Euphoric', 'Emotional', 'Intimate'] },
  { id: '4', showId: '3', author: 'Amirah Rania', initials: 'AR', rating: 5, headline: 'Worth the drive up every single time', body: 'The highland air makes everything better. Production was excellent this year. The lineup was stacked and the crowd energy was incredible.', showCount: 34, date: '10 Aug 2026', sound: 4, visuals: 5, setlist: 5, crowd: 5, eventManagement: 4, vibes: ['High Energy', 'Worth every cent'] },
]

export interface Comment {
  id: string
  targetId: string
  targetType: 'show' | 'post'
  author: string
  initials: string
  body: string
  date: string
  likes: number
  replies?: Comment[]
}

export const COMMENTS: Comment[] = [
  { id: '1', targetId: '1', targetType: 'show', author: 'Amirah Rania', initials: 'AR', body: 'Got floor pit tickets — cannot wait. This is going to be massive.', date: '2 days ago', likes: 14, replies: [
    { id: '1a', targetId: '1', targetType: 'show', author: 'Danial Hakim', initials: 'DH', body: 'Same! See you in the pit haha', date: '1 day ago', likes: 3 },
  ]},
  { id: '2', targetId: '1', targetType: 'show', author: 'Siti Nurhaliza F.', initials: 'SN', body: 'Anyone know if there\'s a support act confirmed?', date: '3 days ago', likes: 7, replies: [] },
  { id: 'b1', targetId: 'kl-festival-circuit-guide', targetType: 'post', author: 'Amirah Rania', initials: 'AR', body: 'This is exactly the guide I wish I had before my first Good Vibes. Getting there early is so true.', date: '12 Mar 2026', likes: 14, replies: [
    { id: 'b1a', targetId: 'kl-festival-circuit-guide', targetType: 'post', author: 'Danial Hakim', initials: 'DH', body: 'Arrived at 4pm last year and waited an hour just to get in. Going at 2pm this year.', date: '14 Mar 2026', likes: 5 },
    { id: 'b1b', targetId: 'kl-festival-circuit-guide', targetType: 'post', author: 'Priya N.', initials: 'PN', body: 'Also — download the e-ticket before you go. Signal at Genting can be patchy.', date: '15 Mar 2026', likes: 9 },
  ]},
  { id: 'b2', targetId: 'kl-festival-circuit-guide', targetType: 'post', author: 'Danial Hakim', initials: 'DH', body: 'Weather can shift fast at Genting. Always bring a light jacket.', date: '14 Mar 2026', likes: 9, replies: [] },
]

export const BLOG_POSTS: BlogPost[] = [
  { id: '1', slug: 'kl-festival-circuit-guide', title: 'Inside the KL festival circuit — a guide for first-timers', category: 'GUIDES', author: 'Tom Kha', readTime: '8 min read', likes: 189, deck: 'Everything you need to know before your first Malaysian festival, from Good Vibes to Urbanscapes.' },
  { id: '2', slug: 'weeknd-second-date', title: 'The Weeknd adds second KL date after record ticket demand', category: 'NEWS', author: 'Amirah Lee', readTime: '3 min read', likes: 234 },
  { id: '3', slug: 'axiata-floor-guide', title: 'How to get the best spot at Axiata Arena — a floor guide', category: 'GUIDES', author: 'Tom Kha', readTime: '5 min read', likes: 156 },
  { id: '4', slug: 'bangkok-underground', title: "Bangkok's underground electronic scene is quietly thriving", category: 'SCENE', author: 'Priya Nair', readTime: '4 min read', likes: 98 },
  { id: '5', slug: 'encore-sg-id-launch', title: 'encore is now live in Singapore and Indonesia', category: 'ANNOUNCEMENT', author: 'encore', readTime: '2 min read', likes: 312 },
]

export const PROMOTERS: Promoter[] = [
  { id: '1', slug: 'live-nation-malaysia', name: 'Live Nation Malaysia', bio: "Bringing the world's biggest artists to Malaysia since 2008. Over 40 shows a year across KL and beyond.", city: 'Kuala Lumpur', type: 'International Touring', showCount: 247, avgRating: 4.6, reviewCount: 1840 },
  { id: '2', slug: 'livescape-asia', name: 'Livescape Asia', bio: "Southeast Asia's leading independent promoter. Home of Good Vibes Festival and Urbanscapes.", city: 'Kuala Lumpur', type: 'Festival & Touring', showCount: 189, avgRating: 4.7, reviewCount: 2310 },
  { id: '3', slug: 'ismaya-live', name: 'Ismaya Live', bio: "Indonesia's premier live entertainment company.", city: 'Jakarta', type: 'International Touring', showCount: 312, avgRating: 4.5, reviewCount: 2890 },
]
