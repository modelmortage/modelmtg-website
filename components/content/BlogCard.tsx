import Link from 'next/link'
import Image from 'next/image'
import { FaCalendar, FaClock, FaArrowRight } from 'react-icons/fa'
import { BlogPost } from '@/lib/types/content'
import { Card } from '@/components/design-system/Card/Card'
import styles from './BlogCard.module.css'

export interface BlogCardProps {
  blogPost: BlogPost
}

/**
 * BlogCard component displays a preview card for a blog post
 * Shows featured image, title, excerpt, date, and read time
 * Uses design system Card component and React Icons
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
      className={styles.cardLink}
      aria-label={`Read article: ${blogPost.title}`}
    >
      <Card variant="elevated" padding="md" hoverable className={styles.card}>
        {/* Featured Image */}
        <div className={styles.imageContainer}>
          <Image
            src={blogPost.featuredImage}
            alt={blogPost.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjMwIiBmaWxsPSIjZjdmN2Y3Ii8+PC9zdmc+"
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
            <span className={styles.metadataItem}>
              <FaCalendar className={styles.icon} aria-hidden="true" />
              <time dateTime={blogPost.publishDate} className={styles.date}>
                {formattedDate}
              </time>
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.metadataItem}>
              <FaClock className={styles.icon} aria-hidden="true" />
              <span className={styles.readTime}>{blogPost.readTime} min read</span>
            </span>
          </div>

          {/* Read More Arrow */}
          <span className={styles.arrow} aria-hidden="true">
            <FaArrowRight />
          </span>
        </div>
      </Card>
    </Link>
  )
}
