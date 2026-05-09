export type EventType = 'concert' | 'festival' | 'multi-night' | 'gig'

export interface Show {
  id: string
  artist: string
  venue: string
  city: string
  market: string
  date: string
  dateDisplay: string
  price: string
  genre: string
  type: EventType
  promoter: string
  promoterSlug: string
  rating: number
  goingCount: number
  reviewCount: number
  commentCount: number
  isPast: boolean
  description: string
  venueAddress: string
  venueMapsUrl: string
  venueTransport: string
}

export interface Review {
  id: string
  showId: string
  author: string
  initials: string
  rating: number
  headline: string
  body: string
  showCount: number
  date: string
  sound: number
  visuals: number
  setlist: number
  crowd: number
  eventManagement: number
  vibes: string[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  author: string
  readTime: string
  likes: number
  deck?: string
  showId?: string
}

export interface Promoter {
  id: string
  slug: string
  name: string
  bio: string
  city: string
  type: string
  showCount: number
  avgRating: number
  reviewCount: number
}
