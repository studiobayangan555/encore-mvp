'use client'
import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, BlogImage, Breadcrumb, CategoryBadge, Avatar, Stars, ShareBar, CommentsSection, S, ArrowLeft } from '@/components'
import { BLOG_POSTS, SHOWS, COMMENTS } from '@/lib/data'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const post = BLOG_POSTS.find(p => p.slug === params.slug) || BLOG_POSTS[0]
  const relatedShow = post.showId ? SHOWS.find(s => s.id === post.showId) : null
  const related = [].filter(p => p.id !== post.id).slice(0, 3)
  const comments = [].filter(c => c.targetId === post.slug && c.targetType === 'post')
  const truncTitle = post.title.length > 30 ? post.title.slice(0, 30) + '…' : post.title
  const url = typeof window !== 'undefined' ? window.location.href : `https://encore.app/blog/${post.slug}`

  const body = `The atmosphere inside the venue was unlike anything we had seen this year. From the moment the lights dropped, it was clear this was going to be a different kind of show — not just a performance, but an experience carefully constructed over months of production planning.

The sound was immaculate. Every seat in the upper tier still felt close, and the mix was clean enough that you could hear individual instruments clearly even in the floor pit. This is not something we say often about stadium shows in Malaysia, where the acoustics have historically been hit and miss.

What struck us most was the setlist — it leaned heavily on the new material but was sequenced in a way that felt like a genuine narrative arc rather than a random playlist. The older songs hit differently in that context, arriving at exactly the right moments to give the crowd something familiar to hold onto.

By the end, the crowd was fully surrendered. Not just singing along — fully gone. That collective transcendence is why we come to shows, and this one delivered it without question.`

  const articleContent = (
    <>
      <CategoryBadge category={post.category} />
      <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 28, color: 'var(--text)', lineHeight: 1.25, margin: '14px 0 16px' }}>{post.title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 20, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <Avatar initials={post.author.slice(0,2).toUpperCase()} size={36} />
        <p style={{ fontSize: 14, color: 'var(--text)' }}>{post.author}</p>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>· {post.readTime} · ♥ {post.likes}</p>
      </div>
      {post.deck && <p style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>{post.deck}</p>}
      {body.split('\n\n').map((para, i) => {
        if (i === 1) return (
          <div key={i}>
            <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 20, margin: '24px 0' }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.6 }}>"The sound was immaculate. Every seat still felt close."</p>
            </div>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>{para.trim()}</p>
          </div>
        )
        return <p key={i} style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>{para.trim()}</p>
      })}
      <ShareBar title={post.title} url={url} />
      <CommentsSection targetId={post.slug} initialComments={comments} />
    </>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Blog', href: '/blog' }, { label: truncTitle }]} />
          <div style={{ display: 'flex', gap: 48, paddingTop: 8 }}>
            <aside style={{ width: 240, flexShrink: 0 }}>
              <div style={{ position: 'sticky', top: 80 }}>
                {relatedShow && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 20 }}>
                    <div style={{ height: 80, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', marginBottom: 12 }} />
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{relatedShow.artist}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{relatedShow.venue}</p>
                    <Stars rating={relatedShow.rating} size={12} />
                    <Link href={`/events/${relatedShow.id}/review`} style={{ display: 'block', marginTop: 12, border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, textAlign: 'center', padding: '8px 0', borderRadius: 8, textDecoration: 'none' }}>Write a Review</Link>
                  </div>
                )}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar initials={post.author.slice(0,2).toUpperCase()} size={36} />
                    <div>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{post.author}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>encore editorial</p>
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 12 }}>More posts</p>
                {related.map(r => (
                  <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 11, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>{r.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)' }}>{r.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
            <div style={{ flex: 1 }}>
              <BlogImage imageUrl={post.featured_image_url} gradient='linear-gradient(135deg,#1a0033,#4400aa)' style={{ height: 320, borderRadius: 'var(--radius)', marginBottom: 32 }} />
              {articleContent}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <BlogImage imageUrl={post.featured_image_url} gradient='linear-gradient(135deg,#1a0033,#4400aa)' style={{ width: '100%', height: 200 }} />
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Blog', href: '/blog' }, { label: truncTitle }]} />
          {articleContent}
          <MobileFooter />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
