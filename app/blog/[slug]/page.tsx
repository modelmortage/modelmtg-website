import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaCalendar, FaClock, FaUser } from 'react-icons/fa'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { Button } from '@/components/design-system/Button/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { safeJsonLd } from '@/lib/safeJsonLd'
import styles from './BlogPostPage.module.css'

export const dynamic = 'force-static'
export const dynamicParams = false

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter: post } = getPostBySlug(slug)

    return {
      title: post.metadata?.title || post.title,
      description: post.metadata?.description || post.excerpt,
      keywords: post.metadata?.keywords?.join(', '),
      openGraph: {
        title: post.metadata?.title || post.title,
        description: post.metadata?.description || post.excerpt,
        type: 'article',
        images: post.metadata?.ogImage ? [{ url: post.metadata.ogImage }] : undefined,
        publishedTime: post.publishDate,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.metadata?.title || post.title,
        description: post.metadata?.description || post.excerpt,
        images: post.metadata?.ogImage ? [post.metadata.ogImage] : undefined,
      },
      alternates: {
        canonical: post.metadata?.canonical,
      },
    }
  } catch (e) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  let postData

  try {
    postData = getPostBySlug(slug)
  } catch (e) {
    notFound()
  }

  const { frontmatter: post, content } = postData
  const allPosts = getAllPosts()

  // Format the date for display
  const [year, month, day] = post.publishDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Social sharing URLs
  const pageUrl = `https://modelmtg.com/blog/${post.slug}`
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${pageUrl}`)}`
  }

  // MDX Components Map to match the original design's classes
  const mdxComponents = {
    // Basic formatting
    p: (props: any) => <p className={styles.paragraph} {...props} />,
    strong: (props: any) => <strong {...props} />,
    em: (props: any) => <em {...props} />,

    // Headings - Shifted levels to match user's previous logic
    // user mapped "# " to h2, "## " to h3, "### " to h4, "#### " to h5
    h1: (props: any) => <h2 className={styles.h2} {...props} />,
    h2: (props: any) => <h3 className={styles.h3} {...props} />,
    h3: (props: any) => <h4 className={styles.h4} {...props} />,
    h4: (props: any) => <h5 className={styles.h5} {...props} />,

    // Lists
    ul: (props: any) => <ul className={styles.list} {...props} />,
    ol: (props: any) => <ol className={styles.list} {...props} />, // Using same list style
    li: (props: any) => <li className={styles.listItem} {...props} />,

    // Links
    a: (props: any) => <a className={styles.link} {...props} target="_blank" rel="noopener noreferrer" />,
  }

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
                <span className={styles.metadataItem}>
                  <FaUser className={styles.icon} aria-hidden="true" />
                  <span className={styles.author}>By {post.author}</span>
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.metadataItem}>
                  <FaCalendar className={styles.icon} aria-hidden="true" />
                  <time dateTime={post.publishDate} className={styles.date}>
                    {formattedDate}
                  </time>
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.metadataItem}>
                  <FaClock className={styles.icon} aria-hidden="true" />
                  <span className={styles.readTime}>{post.readTime} min read</span>
                </span>
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
          {post.featuredImage && (
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
          )}

          {/* Social Sharing Buttons */}
          <div className={styles.socialShare}>
            <span className={styles.shareLabel}>Share this article:</span>
            <div className={styles.shareButtons}>
              <a
                href={shareUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
                aria-label="Share on Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href={shareUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href={shareUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareButton}
                aria-label="Share on LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href={shareUrls.email}
                className={styles.shareButton}
                aria-label="Share via Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Article Content */}
          <div className={styles.content}>
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {/* Article Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <p className={styles.footerText}>
                Have questions about this article? Contact our team for personalized guidance.
              </p>
              <Link href="/schedule-a-call" className={styles.buttonLink}>
                <Button variant="primary" size="lg">
                  Schedule a Call
                </Button>
              </Link>
            </div>
          </footer>
        </article>

        {/* Related Posts Section */}
        <section className={styles.relatedSection}>
          <div className={styles.relatedContainer}>
            <h2 className={styles.relatedTitle}>Continue Reading</h2>
            <div className={styles.relatedGrid}>
              {allPosts
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
                        {relatedPost.featuredImage && (
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjwvc3ZnPg=="
                            className={styles.relatedImage}
                          />
                        )}
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
          __html: safeJsonLd({
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
            "wordCount": content.split(/\s+/).length
          })
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
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
