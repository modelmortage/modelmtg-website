import { Metadata } from 'next'
import { FaCalendarAlt, FaPhone } from 'react-icons/fa'
import BlogCard from '@/components/content/BlogCard'
import { Button } from '@/components/design-system/Button/Button'
import { blogPosts } from '@/lib/content/blogPosts'
import styles from './blog.module.css'

export const metadata: Metadata = {
  title: 'Mortgage & Home Buying Blog | Expert Tips & Guides | Model Mortgage',
  description: 'Expert mortgage advice, home buying tips, and financial guidance. Learn about loan types, rates, affordability, and more from Model Mortgage professionals.',
  keywords: 'mortgage blog, home buying tips, mortgage advice, real estate blog, home financing, mortgage guides, first-time homebuyer',
  openGraph: {
    title: 'Mortgage & Home Buying Blog | Model Mortgage',
    description: 'Expert mortgage advice, home buying tips, and financial guidance from Model Mortgage professionals.',
    type: 'website',
    images: [{ url: '/images/blog/blog-og.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage & Home Buying Blog | Model Mortgage',
    description: 'Expert mortgage advice, home buying tips, and financial guidance from Model Mortgage professionals.',
    images: ['/images/blog/blog-og.jpg'],
  },
  alternates: {
    canonical: '/blog',
  },
}

// Configure Incremental Static Regeneration (ISR)
// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400

export default function BlogPage() {
  // Sort blog posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })

  return (
    <div className={styles.blogPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Mortgage & Home Buying Blog</h1>
          <p className={styles.heroSubtitle}>
            Expert advice, tips, and guides to help you navigate the home buying and mortgage process with confidence.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className={styles.postsSection}>
        <div className={styles.container}>
          <div className={styles.postsGrid}>
            {sortedPosts.map((post) => (
              <BlogCard key={post.slug} blogPost={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Home Buying Journey?</h2>
          <p className={styles.ctaText}>
            Get personalized mortgage advice and competitive rates from our experienced team.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/schedule-a-call" className={styles.buttonLink}>
              <Button variant="primary" size="lg" icon={<FaPhone />} iconPosition="left">
                Schedule a Call
              </Button>
            </a>
            <a href="/calculator/affordability" className={styles.buttonLink}>
              <Button variant="secondary" size="lg" icon={<FaCalendarAlt />} iconPosition="left">
                Calculate Affordability
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Model Mortgage Blog",
            "description": "Expert mortgage advice, home buying tips, and financial guidance",
            "url": "https://modelmtg.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Model Mortgage",
              "logo": {
                "@type": "ImageObject",
                "url": "https://modelmtg.com/images/logo.png"
              }
            },
            "blogPost": sortedPosts.slice(0, 10).map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "datePublished": post.publishDate,
              "image": post.featuredImage,
              "url": `https://modelmtg.com/blog/${post.slug}`
            }))
          })
        }}
      />
    </div>
  )
}
