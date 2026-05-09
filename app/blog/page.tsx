'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, Breadcrumb, CategoryBadge, Sidebar, SidebarLabel, SidebarLink, AdSpot, BlogImage, S } from '@/components'
import { getBlogPosts, type BlogPost } from '@/lib/queries'
import { SEA_COUNTRIES } from '@/lib/data'

const CATEGORIES = ['All posts', 'News', 'New Music', 'Guides', 'Scene', 'Announcements']
const GRADIENTS = [
  'linear-gradient(135deg,#1a0033,#4400aa)',
  'linear-gradient(135deg,#003322,#006644)',
  'linear-gradient(135deg,#1a0044,#7B61FF)',
  'linear-gradient(135deg,#001a33,#0066cc)',
  'linear-gradient(135deg,#1a0a00,#cc4400)',
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPosts().then(data => { setPosts(data); setLoading(false) })
  }, [])

  const hero = posts[0] ?? null
  const grid = posts.slice(1, 5)

  const PostSkeleton = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 28 }}>
      <div style={{ height: 360, background: 'var(--surface2)' }} />
      <div style={{ background: 'var(--surface)', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ height: 12, width: 80, background: 'var(--surface2)', borderRadius: 6 }} />
        <div style={{ height: 18, width: '90%', background: 'var(--surface2)', borderRadius: 6 }} />
        <div style={{ height: 18, width: '70%', background: 'var(--surface2)', borderRadius: 6 }} />
        <div style={{ height: 14, width: '60%', background: 'var(--surface2)', borderRadius: 6, marginTop: 'auto' }} />
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
          <div style={S.pageHeader}>
            <span style={S.pageLabel}>Editorial</span>
            <h1 style={S.pageTitle}>Blog</h1>
            <p style={S.pageDesc}>News, new music, and stories from the live music scene across SEA.</p>
          </div>
          <div style={S.twoCol}>
            <Sidebar>
              <AdSpot />
              <SidebarLabel>Categories</SidebarLabel>
              {CATEGORIES.map((c, i) => <SidebarLink key={c} active={i === 0}>{c}</SidebarLink>)}
              <SidebarLabel>Country</SidebarLabel>
              {SEA_COUNTRIES.map(c => (
                <label key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', padding: '6px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />{c.label}
                </label>
              ))}
            </Sidebar>
            <main>
              {loading ? <PostSkeleton /> : hero && (
                <Link href={`/blog/${hero.slug}`} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 28 }}>
                  <BlogImage imageUrl={hero.featured_image_url} gradient={GRADIENTS[0]} style={{ height: 360 }} />
                  <div style={{ background: 'var(--surface)', padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <CategoryBadge category={hero.category} />
                      <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--text)', lineHeight: 1.3, margin: '14px 0 12px' }}>{hero.title}</h2>
                      {hero.deck && <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{hero.deck}</p>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>{hero.author} · {hero.read_time} · ♥ {hero.likes}</p>
                  </div>
                </Link>
              )}
              {!loading && grid.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {grid.map((post, i) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'block', color: 'inherit' }}>
                      <BlogImage imageUrl={post.featured_image_url} gradient={GRADIENTS[i + 1]} style={{ height: 150 }} />
                      <div style={{ padding: 18 }}>
                        <CategoryBadge category={post.category} />
                        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.35, margin: '10px 0 8px' }}>{post.title}</h3>
                        <p style={{ fontSize: 12, color: 'var(--muted)' }}>{post.author} · {post.read_time} · ♥ {post.likes}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {!loading && posts.length === 0 && (
                <div style={{ textAlign: 'center' as const, padding: '60px 0' }}>
                  <p style={{ fontSize: 15, color: 'var(--muted)' }}>No posts yet — check back soon.</p>
                </div>
              )}
            </main>
          </div>
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Blog' }]} />
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 20, lineHeight: 1.2 }}>Blog</h1>
          {loading ? (
            <div style={{ height: 200, background: 'var(--surface2)', borderRadius: 10, marginBottom: 16 }} />
          ) : hero && (
            <Link href={`/blog/${hero.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 16, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', color: 'inherit' }}>
              <BlogImage imageUrl={hero.featured_image_url} gradient={GRADIENTS[0]} style={{ height: 180 }} />
              <div style={{ background: 'var(--surface)', padding: 20 }}>
                <CategoryBadge category={hero.category} />
                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1.3, margin: '10px 0 6px' }}>{hero.title}</h2>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{hero.author} · {hero.read_time}</p>
              </div>
            </Link>
          )}
          {!loading && grid.map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
              <BlogImage imageUrl={post.featured_image_url} gradient={GRADIENTS[i + 1]} style={{ width: 72, height: 72, borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <CategoryBadge category={post.category} />
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text)', lineHeight: 1.3, margin: '6px 0 4px' }}>{post.title}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{post.author}</p>
              </div>
            </Link>
          ))}
          <MobileFooter />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
