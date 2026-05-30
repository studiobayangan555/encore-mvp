import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const DOMAIN = 'https://enc.asia'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch all published shows
  const { data: shows } = await supabase
    .from('shows')
    .select('id, date')
    .eq('is_published', true)
    .order('date', { ascending: false })

  const showUrls: MetadataRoute.Sitemap = (shows || []).map(show => ({
    url: `${DOMAIN}/events/${show.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Fetch all published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)

  const blogUrls: MetadataRoute.Sitemap = (posts || []).map(post => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: DOMAIN, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMAIN}/reviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMAIN}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMAIN}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${DOMAIN}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMAIN}/promoters`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...showUrls,
    ...blogUrls,
  ]
}
