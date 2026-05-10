// ─── ENCORE SUPABASE QUERIES ─────────────────────────────────
// Centralised query functions used across all pages.
// All functions return typed data or empty arrays on error.

import { createDataClient } from '@/lib/supabase'

export interface Show {
  id: string
  artist: string
  venue: string
  city: string
  country: string
  date: string
  date_display: string
  price: string
  genre: string
  type: 'gig' | 'concert' | 'festival' | 'multi-night'
  promoter: string
  promoter_slug: string
  description: string
  venue_address: string
  venue_maps_url: string
  venue_transport: string
  ticket_url: string
  poster_url: string | null
  lineup: { name: string; role: string }[]
  lineup_url: string | null
  is_published: boolean
  review_count: number
  going_count: number
  comment_count: number
  avg_rating: number
  is_past?: boolean  // computed client-side
}

export interface Review {
  id: string
  show_id: string
  user_id: string
  rating: number
  headline: string
  body: string | null
  sound: number | null
  visuals: number | null
  setlist: number | null
  crowd: number | null
  event_management: number | null
  vibes: string[]
  photos: string[]
  est_attendance: number | null
  created_at: string
  profiles: { display_name: string | null } | null
}

export interface Comment {
  id: string
  target_id: string
  target_type: string
  user_id: string
  parent_id: string | null
  body: string
  likes: number
  created_at: string
  profiles: { display_name: string | null } | null
  replies?: Comment[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  category: string
  author: string
  deck: string | null
  body: string | null
  read_time: string | null
  likes: number
  published_at: string | null
  featured_image_url: string | null
}

// ─── SHOWS ───────────────────────────────────────────────────

export async function getShowsWithReviews(): Promise<Show[]> {
  const supabase = createDataClient()
  const today = new Date().toISOString().split('T')[0]
  console.log('[encore] fetching shows with reviews, today =', today)
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('is_published', true)
  if (error) {
    console.error('[encore] shows query error:', error)
    return []
  }
  console.log('[encore] raw shows from supabase:', data?.length, data?.map(s => ({ artist: s.artist, date: s.date, review_count: s.review_count, is_published: s.is_published })))
  // Filter past shows with reviews client-side to avoid date comparison issues
  const past = (data || []).filter(s => s.date < today && s.review_count > 0)
  console.log('[encore] past shows with reviews:', past.length)
  return past.map(s => ({ ...s, is_past: true })).sort((a, b) => b.avg_rating - a.avg_rating)
}

export async function getUpcomingShows(): Promise<Show[]> {
  const supabase = createDataClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('is_published', true)
    .gte('date', today)
    .order('date', { ascending: true })
  if (error) { console.error(error); return [] }
  return (data || []).map(s => ({ ...s, is_past: false }))
}

export async function getFeaturedShow(): Promise<Show | null> {
  const supabase = createDataClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('is_published', true)
    .gte('date', today)
    .order('going_count', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return { ...data, is_past: false }
}

export async function getShowById(id: string): Promise<Show | null> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()
  if (error) return null
  const today = new Date().toISOString().split('T')[0]
  return { ...data, is_past: data.date < today }
}

export async function getShowsByPromoter(promoterSlug: string, excludeId: string): Promise<Show[]> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('is_published', true)
    .eq('promoter_slug', promoterSlug)
    .neq('id', excludeId)
    .order('date', { ascending: true })
    .limit(3)
  if (error) return []
  const today = new Date().toISOString().split('T')[0]
  return (data || []).map(s => ({ ...s, is_past: s.date < today }))
}

export async function getTrendingShows(excludeId: string): Promise<Show[]> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('is_published', true)
    .neq('id', excludeId)
    .order('going_count', { ascending: false })
    .limit(3)
  if (error) return []
  const today = new Date().toISOString().split('T')[0]
  return (data || []).map(s => ({ ...s, is_past: s.date < today }))
}

// ─── REVIEWS ─────────────────────────────────────────────────

export async function getReviewsByShow(showId: string): Promise<Review[]> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(display_name)')
    .eq('show_id', showId)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

// ─── COMMENTS ────────────────────────────────────────────────

export async function getCommentsByTarget(targetId: string, targetType: string): Promise<Comment[]> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(display_name)')
    .eq('target_id', targetId)
    .eq('target_type', targetType)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }

  // Fetch replies for each comment
  const withReplies = await Promise.all((data || []).map(async comment => {
    const { data: replies } = await supabase
      .from('comments')
      .select('*, profiles(display_name)')
      .eq('parent_id', comment.id)
      .order('created_at', { ascending: true })
    return { ...comment, replies: replies || [] }
  }))
  return withReplies
}

// ─── BLOG ─────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) return null
  return data
}

// ─── SEARCH ──────────────────────────────────────────────────

export async function searchShows(query: string, country?: string): Promise<Show[]> {
  const supabase = createDataClient()
  let q = supabase
    .from('shows')
    .select('*')
    .eq('is_published', true)
    .or(`artist.ilike.%${query}%,venue.ilike.%${query}%,city.ilike.%${query}%,genre.ilike.%${query}%,promoter.ilike.%${query}%`)
  if (country && country !== 'All') q = q.eq('country', country)
  const { data, error } = await q.order('date', { ascending: false }).limit(20)
  if (error) return []
  const today = new Date().toISOString().split('T')[0]
  return (data || []).map(s => ({ ...s, is_past: s.date < today }))
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const supabase = createDataClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,category.ilike.%${query}%,author.ilike.%${query}%,deck.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(10)
  if (error) return []
  return data || []
}
