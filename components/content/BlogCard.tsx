import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/types/content'
import styles from './BlogCard.module.css'

export interface BlogCardProps {
  blogPost: BlogPost
}

/**
 * BlogCard component displays a preview card for a blog post
 * Shows featured image, title, excerpt, date, and read time
 * Responsive design with hover effects
 */
export default function BlogCard({ blogPost }: BlogCardProps) {
  // Format the date for display
  // Parse the date string and add timezone offset to avoid timezone issues
  const [year, month, day] = blogPost.publishDate.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Link
      href={`/blog/${blogPost.slug}`}
      className={styles.card}
      aria-label={`Read article: ${blogPost.title}`}
    >
      {/* Featured Image */}
      <div className={styles.imageContainer}>
        <Image
          src={blogPost.featuredImage}
          alt={blogPost.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Category Badge */}
        <span className={styles.category}>{blogPost.category}</span>

        {/* Title */}
        <h2 className={styles.title}>{blogPost.title}</h2>

        {/* Excerpt */}
        <p className={styles.excerpt}>{blogPost.excerpt}</p>

        {/* Metadata */}
        <div className={styles.metadata}>
          <time dateTime={blogPost.publishDate} className={styles.date}>
            {formattedDate}
          </time>
          <span className={styles.separator}>•</span>
          <span className={styles.readTime}>{blogPost.readTime} min read</span>
        </div>

        {/* Read More Arrow */}
        <span className={styles.arrow} aria-hidden="true">→</span>
      </div>
    </Link>
  )
}
