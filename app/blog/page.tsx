import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/lib/content/blogPosts'
import styles from './blog.module.css'

export const metadata: Metadata = {
  title: 'Market Insights & Strategy | Model Mortgage Blog',
  description: 'Expert analysis on Houston real estate, mortgage rates, and wealth-building strategies for the modern investor.',
  keywords: 'mortgage blog, home buying tips, mortgage advice, real estate blog, home financing, mortgage guides, Houston real estate',
  openGraph: {
    title: 'Market Insights & Strategy | Model Mortgage Blog',
    description: 'Expert analysis on Houston real estate, mortgage rates, and wealth-building strategies.',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
}

export const revalidate = 86400

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })

  const featuredPost = sortedPosts[0]
  const regularPosts = sortedPosts.slice(1)

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Header */}
        <header className={styles.hero}>
          <div className={styles.heroContainer}>
            <span className={styles.heroLabel}>Resources</span>
            <h1 className={styles.heroTitle}>
              Market Insights <br className={styles.heroBreak} />
              <span className={styles.heroAmpersand}>&</span> Strategy
            </h1>
            <p className={styles.heroSubtitle}>
              Expert analysis on Houston real estate, mortgage rates, and wealth-building strategies for the modern investor.
            </p>
          </div>
        </header>

        {/* Featured Article */}
        {featuredPost && (
          <section className={styles.featuredSection}>
            <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
              <div className={styles.featuredImage}>
                <div className={styles.featuredOverlay}></div>
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  fill
                  className={styles.featuredImg}
                />
                <div className={styles.featuredBadge}>
                  <span>Featured Strategy</span>
                </div>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={styles.featuredCategory}>{featuredPost.category}</span>
                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                <span className={styles.featuredLink}>
                  Read Strategy
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Category Filter */}
        <div className={styles.filterSection}>
          <div className={styles.filterContainer}>
            <button className={styles.filterActive}>All Insights</button>
            <button className={styles.filterButton}>Mortgage Guides</button>
            <button className={styles.filterButton}>Real Estate News</button>
            <button className={styles.filterButton}>Investment Strategy</button>
            <button className={styles.filterButton}>Client Stories</button>
          </div>
        </div>

        {/* Articles Grid */}
        <section className={styles.articlesSection}>
          <div className={styles.articlesGrid}>
            {regularPosts.map((post) => (
              <article key={post.slug} className={styles.articleCard}>
                <Link href={`/blog/${post.slug}`} className={styles.articleLink}>
                  <div className={styles.articleImage}>
                    <div className={styles.articleOverlay}></div>
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className={styles.articleImg}
                    />
                  </div>
                  <div className={styles.articleContent}>
                    <div className={styles.articleMeta}>
                      <span className={styles.articleCategory}>{post.category}</span>
                      <span className={styles.articleDate}>
                        {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className={styles.articleTitle}>{post.title}</h3>
                    <p className={styles.articleExcerpt}>{post.excerpt}</p>
                    <div className={styles.articleFooter}>
                      <span className={styles.articleReadMore}>
                        Read Strategy
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
