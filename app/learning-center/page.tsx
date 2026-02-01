import { Metadata } from 'next'
import BlogCard from '@/components/content/BlogCard'
import { blogPosts } from '@/lib/content/blogPosts'
import styles from './learning-center.module.css'

export const metadata: Metadata = {
  title: 'Learning Center | Mortgage Education & Resources | Model Mortgage',
  description: 'Mortgage education center with guides and resources for home buyers. Learn about loan types, rates, affordability, and the home buying process.',
  keywords: 'mortgage education, home buying guide, mortgage learning center, real estate education, mortgage resources, home financing tips',
  openGraph: {
    title: 'Learning Center | Mortgage Education & Resources | Model Mortgage',
    description: 'Comprehensive mortgage education center with guides, tips, and resources for home buyers.',
    type: 'website',
    images: [{ url: '/images/learning-center/learning-center-og.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning Center | Mortgage Education & Resources | Model Mortgage',
    description: 'Comprehensive mortgage education center with guides, tips, and resources for home buyers.',
    images: ['/images/learning-center/learning-center-og.jpg'],
  },
  alternates: {
    canonical: '/learning-center',
  },
}

export default function LearningCenterPage() {
  // Sort blog posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })

  // Organize posts by category for better structure
  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Essential guides for first-time home buyers and those new to the mortgage process.',
      keywords: ['home buying', 'first-time buyer', 'home shopping', 'affordability']
    },
    {
      id: 'loan-types',
      title: 'Understanding Loan Types',
      description: 'Learn about different mortgage options and find the right loan for your situation.',
      keywords: ['FHA', 'VA', 'conventional', 'loan comparison', 'mortgage types']
    },
    {
      id: 'rates-and-costs',
      title: 'Rates & Costs',
      description: 'Understand mortgage rates, closing costs, and how to get the best deal.',
      keywords: ['mortgage rates', 'interest rates', 'closing costs', 'fees']
    },
    {
      id: 'refinancing',
      title: 'Refinancing',
      description: 'Explore refinancing options to lower your rate or access your home equity.',
      keywords: ['refinance', 'cash-out', 'rate reduction', 'IRRRL']
    },
    {
      id: 'all-articles',
      title: 'All Articles',
      description: 'Browse our complete collection of mortgage and home buying resources.',
      keywords: []
    }
  ]

  // Function to filter posts by category keywords
  const getPostsByCategory = (categoryKeywords: string[]) => {
    if (categoryKeywords.length === 0) {
      return sortedPosts // Return all posts for "All Articles"
    }
    
    return sortedPosts.filter(post => {
      const postText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase()
      return categoryKeywords.some(keyword => postText.includes(keyword.toLowerCase()))
    })
  }

  return (
    <div className={styles.learningCenter}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Learning Center</h1>
          <p className={styles.heroSubtitle}>
            Your comprehensive resource for mortgage education. From first-time home buying to refinancing, 
            we provide expert guidance to help you make informed decisions about your home financing.
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className={styles.quickLinks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Popular Topics</h2>
          <div className={styles.topicsGrid}>
            <a href="#getting-started" className={styles.topicCard}>
              <div className={styles.topicIcon}>🏠</div>
              <h3 className={styles.topicTitle}>Getting Started</h3>
              <p className={styles.topicDescription}>First-time buyer guides</p>
            </a>
            <a href="#loan-types" className={styles.topicCard}>
              <div className={styles.topicIcon}>📋</div>
              <h3 className={styles.topicTitle}>Loan Types</h3>
              <p className={styles.topicDescription}>Compare mortgage options</p>
            </a>
            <a href="#rates-and-costs" className={styles.topicCard}>
              <div className={styles.topicIcon}>💰</div>
              <h3 className={styles.topicTitle}>Rates & Costs</h3>
              <p className={styles.topicDescription}>Understand pricing</p>
            </a>
            <a href="#refinancing" className={styles.topicCard}>
              <div className={styles.topicIcon}>🔄</div>
              <h3 className={styles.topicTitle}>Refinancing</h3>
              <p className={styles.topicDescription}>Lower your rate</p>
            </a>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categories.map((category) => {
        const categoryPosts = getPostsByCategory(category.keywords)
        
        // Skip empty categories (except "All Articles")
        if (categoryPosts.length === 0 && category.id !== 'all-articles') {
          return null
        }

        return (
          <section key={category.id} id={category.id} className={styles.categorySection}>
            <div className={styles.container}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <p className={styles.categoryDescription}>{category.description}</p>
              </div>
              <div className={styles.postsGrid}>
                {categoryPosts.map((post) => (
                  <BlogCard key={post.slug} blogPost={post} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Tools & Calculators Section */}
      <section className={styles.toolsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Mortgage Calculators & Tools</h2>
          <p className={styles.sectionDescription}>
            Use our free calculators to estimate payments, affordability, and compare loan options.
          </p>
          <div className={styles.toolsGrid}>
            <a href="/calculator/affordability" className={styles.toolCard}>
              <h3 className={styles.toolTitle}>Affordability Calculator</h3>
              <p className={styles.toolDescription}>Find out how much home you can afford</p>
              <span className={styles.toolArrow}>→</span>
            </a>
            <a href="/calculator/purchase" className={styles.toolCard}>
              <h3 className={styles.toolTitle}>Purchase Calculator</h3>
              <p className={styles.toolDescription}>Calculate your monthly mortgage payment</p>
              <span className={styles.toolArrow}>→</span>
            </a>
            <a href="/calculator/refinance" className={styles.toolCard}>
              <h3 className={styles.toolTitle}>Refinance Calculator</h3>
              <p className={styles.toolDescription}>See if refinancing makes sense</p>
              <span className={styles.toolArrow}>→</span>
            </a>
            <a href="/calculator/va-purchase" className={styles.toolCard}>
              <h3 className={styles.toolTitle}>VA Loan Calculator</h3>
              <p className={styles.toolDescription}>Calculate VA loan payments and benefits</p>
              <span className={styles.toolArrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Take the Next Step?</h2>
          <p className={styles.ctaText}>
            Our experienced mortgage professionals are here to answer your questions and guide you through the process.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/schedule-a-call" className={styles.ctaPrimary}>
              Schedule a Consultation
            </a>
            <a href="/about" className={styles.ctaSecondary}>
              Learn About Us
            </a>
          </div>
        </div>
      </section>

      {/* Structured Data for Learning Center */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Model Mortgage Learning Center",
            "description": "Comprehensive mortgage education center with guides, tips, and resources for home buyers",
            "url": "https://modelmtg.com/learning-center",
            "publisher": {
              "@type": "Organization",
              "name": "Model Mortgage",
              "logo": {
                "@type": "ImageObject",
                "url": "https://modelmtg.com/images/logo.png"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": sortedPosts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Article",
                  "headline": post.title,
                  "description": post.excerpt,
                  "author": {
                    "@type": "Person",
                    "name": post.author
                  },
                  "datePublished": post.publishDate,
                  "url": `https://modelmtg.com/blog/${post.slug}`
                }
              }))
            }
          })
        }}
      />
    </div>
  )
}
