import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { blogPosts } from '@/lib/content/blogPosts'
import styles from './BlogPostPage.module.css'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    keywords: post.metadata.keywords.join(', '),
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: 'article',
      images: post.metadata.ogImage ? [{ url: post.metadata.ogImage }] : undefined,
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description,
      images: post.metadata.ogImage ? [post.metadata.ogImage] : undefined,
    },
    alternates: {
      canonical: post.metadata.canonical,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  // Format the date for display
  const [year, month, day] = post.publishDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Process content to convert markdown-style headings to HTML
  const processContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: JSX.Element[] = []
    let currentParagraph: string[] = []
    let key = 0

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ').trim()
        if (text) {
          elements.push(
            <p key={`p-${key++}`} className={styles.paragraph}>
              {text}
            </p>
          )
        }
        currentParagraph = []
      }
    }

    lines.forEach((line) => {
      const trimmedLine = line.trim()

      // Skip empty lines
      if (!trimmedLine) {
        flushParagraph()
        return
      }

      // H1 in markdown content should become H2 (page title is already H1)
      if (trimmedLine.startsWith('# ')) {
        flushParagraph()
        elements.push(
          <h2 key={`h2-${key++}`} className={styles.h2}>
            {trimmedLine.substring(2)}
          </h2>
        )
        return
      }

      // H2 in markdown content should become H3
      if (trimmedLine.startsWith('## ')) {
        flushParagraph()
        elements.push(
          <h3 key={`h3-${key++}`} className={styles.h3}>
            {trimmedLine.substring(3)}
          </h3>
        )
        return
      }

      // H3 in markdown content should become H4
      if (trimmedLine.startsWith('### ')) {
        flushParagraph()
        elements.push(
          <h4 key={`h4-${key++}`} className={styles.h4}>
            {trimmedLine.substring(4)}
          </h4>
        )
        return
      }

      // H4 in markdown content should become H5
      if (trimmedLine.startsWith('#### ')) {
        flushParagraph()
        elements.push(
          <h5 key={`h5-${key++}`} className={styles.h5}>
            {trimmedLine.substring(5)}
          </h5>
        )
        return
      }

      // Unordered list item
      if (trimmedLine.startsWith('- ')) {
        flushParagraph()
        // Check if previous element is a ul, if not create one
        const lastElement = elements[elements.length - 1]
        if (lastElement && lastElement.type === 'ul') {
          // Add to existing ul
          const existingItems = lastElement.props.children
          elements[elements.length - 1] = (
            <ul key={lastElement.key} className={styles.list}>
              {existingItems}
              <li key={`li-${key++}`} className={styles.listItem}>
                {trimmedLine.substring(2)}
              </li>
            </ul>
          )
        } else {
          elements.push(
            <ul key={`ul-${key++}`} className={styles.list}>
              <li key={`li-${key++}`} className={styles.listItem}>
                {trimmedLine.substring(2)}
              </li>
            </ul>
          )
        }
        return
      }

      // Bold text (simple **text** pattern)
      if (trimmedLine.includes('**')) {
        flushParagraph()
        const parts = trimmedLine.split('**')
        const formatted = parts.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={`strong-${key++}`}>{part}</strong>
          }
          return part
        })
        elements.push(
          <p key={`p-${key++}`} className={styles.paragraph}>
            {formatted}
          </p>
        )
        return
      }

      // Regular paragraph line
      currentParagraph.push(trimmedLine)
    })

    // Flush any remaining paragraph
    flushParagraph()

    return elements
  }

  const contentElements = processContent(post.content)

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbContainer}>
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${post.slug}` },
            ]}
          />
        </div>

        {/* Article Header */}
        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <span className={styles.category}>{post.category}</span>
              <h1 className={styles.title}>{post.title}</h1>
              <div className={styles.metadata}>
                <span className={styles.author}>By {post.author}</span>
                <span className={styles.separator}>•</span>
                <time dateTime={post.publishDate} className={styles.date}>
                  {formattedDate}
                </time>
                <span className={styles.separator}>•</span>
                <span className={styles.readTime}>{post.readTime} min read</span>
              </div>
              {post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          <div className={styles.featuredImage}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={630}
              priority
              className={styles.image}
            />
          </div>

          {/* Article Content */}
          <div className={styles.content}>
            {contentElements}
          </div>

          {/* Article Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <p className={styles.footerText}>
                Have questions about this article? Contact our team for personalized guidance.
              </p>
              <Link href="/schedule-a-call" className={styles.footerButton}>
                Schedule a Call
              </Link>
            </div>
          </footer>
        </article>

        {/* Related Posts Section */}
        <section className={styles.relatedSection}>
          <div className={styles.relatedContainer}>
            <h2 className={styles.relatedTitle}>Continue Reading</h2>
            <div className={styles.relatedGrid}>
              {blogPosts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 3)
                .map((relatedPost) => {
                  const [y, m, d] = relatedPost.publishDate.split('-').map(Number)
                  const relatedDate = new Date(y, m - 1, d)
                  const relatedFormattedDate = relatedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })

                  return (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className={styles.relatedCard}
                    >
                      <div className={styles.relatedImageContainer}>
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.relatedImage}
                        />
                      </div>
                      <div className={styles.relatedContent}>
                        <h3 className={styles.relatedCardTitle}>{relatedPost.title}</h3>
                        <p className={styles.relatedExcerpt}>{relatedPost.excerpt}</p>
                        <time dateTime={relatedPost.publishDate} className={styles.relatedDate}>
                          {relatedFormattedDate}
                        </time>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Structured Data for Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Model Mortgage",
              "logo": {
                "@type": "ImageObject",
                "url": "https://modelmtg.com/images/logo.png"
              }
            },
            "datePublished": post.publishDate,
            "dateModified": post.publishDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://modelmtg.com/blog/${post.slug}`
            },
            "keywords": post.tags.join(', '),
            "articleSection": post.category,
            "wordCount": post.content.split(/\s+/).length
          })
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://modelmtg.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://modelmtg.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://modelmtg.com/blog/${post.slug}`
              }
            ]
          })
        }}
      />
    </>
  )
}
