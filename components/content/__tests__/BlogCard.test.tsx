import { render, screen } from '@testing-library/react'
import BlogCard from '../BlogCard'
import { BlogPost } from '@/lib/types/content'

describe('BlogCard', () => {
  const mockBlogPost: BlogPost = {
    slug: 'test-blog-post',
    title: 'Test Blog Post Title',
    excerpt: 'This is a test blog post excerpt that provides a preview of the article content.',
    content: 'Full article content goes here...',
    author: 'John Doe',
    publishDate: '2024-01-15',
    category: 'Learn',
    tags: ['test', 'blog'],
    featuredImage: '/images/blog/test-image.jpg',
    readTime: 5,
    metadata: {
      title: 'Test Blog Post',
      description: 'Test description',
      keywords: ['test']
    }
  }

  it('renders blog post title', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument()
  })

  it('renders blog post excerpt', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    expect(screen.getByText('This is a test blog post excerpt that provides a preview of the article content.')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('renders formatted publish date', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
  })

  it('renders read time', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('renders featured image with correct attributes', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    const image = screen.getByAltText('Test Blog Post Title')
    expect(image).toBeInTheDocument()
  })

  it('renders as a link with correct href', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    const link = screen.getByRole('link', { name: /read article: test blog post title/i })
    expect(link).toHaveAttribute('href', '/blog/test-blog-post')
  })

  it('renders arrow indicator', () => {
    const { container } = render(<BlogCard blogPost={mockBlogPost} />)
    // Arrow is now an SVG icon (FaArrowRight) instead of text
    const arrow = container.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'Read article: Test Blog Post Title')
  })

  it('renders time element with correct datetime attribute', () => {
    render(<BlogCard blogPost={mockBlogPost} />)
    const timeElement = screen.getByText('January 15, 2024')
    expect(timeElement.tagName).toBe('TIME')
    expect(timeElement).toHaveAttribute('datetime', '2024-01-15')
  })

  describe('date formatting', () => {
    it('formats dates correctly for different months', () => {
      const marchPost = { ...mockBlogPost, publishDate: '2024-03-22' }
      render(<BlogCard blogPost={marchPost} />)
      expect(screen.getByText('March 22, 2024')).toBeInTheDocument()
    })

    it('formats dates correctly for December', () => {
      const decemberPost = { ...mockBlogPost, publishDate: '2024-12-31' }
      render(<BlogCard blogPost={decemberPost} />)
      expect(screen.getByText('December 31, 2024')).toBeInTheDocument()
    })

    it('formats dates correctly for single-digit days', () => {
      const singleDigitDay = { ...mockBlogPost, publishDate: '2024-05-05' }
      render(<BlogCard blogPost={singleDigitDay} />)
      expect(screen.getByText('May 5, 2024')).toBeInTheDocument()
    })
  })

  describe('read time variations', () => {
    it('displays 1 min read for single minute', () => {
      const oneMinPost = { ...mockBlogPost, readTime: 1 }
      render(<BlogCard blogPost={oneMinPost} />)
      expect(screen.getByText('1 min read')).toBeInTheDocument()
    })

    it('displays correct read time for longer articles', () => {
      const longPost = { ...mockBlogPost, readTime: 15 }
      render(<BlogCard blogPost={longPost} />)
      expect(screen.getByText('15 min read')).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    it('applies correct CSS classes for responsive layout', () => {
      const { container } = render(<BlogCard blogPost={mockBlogPost} />)
      const card = container.querySelector('a')
      expect(card).toHaveClass('card')
    })

    it('applies correct CSS classes to image container', () => {
      const { container } = render(<BlogCard blogPost={mockBlogPost} />)
      const imageContainer = container.querySelector('.imageContainer')
      expect(imageContainer).toBeInTheDocument()
    })

    it('applies correct CSS classes to content section', () => {
      const { container } = render(<BlogCard blogPost={mockBlogPost} />)
      const content = container.querySelector('.content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles long titles gracefully', () => {
      const longTitlePost = {
        ...mockBlogPost,
        title: 'This is a Very Long Blog Post Title That Should Still Display Properly Without Breaking the Layout'
      }
      render(<BlogCard blogPost={longTitlePost} />)
      expect(screen.getByText(/This is a Very Long Blog Post Title/)).toBeInTheDocument()
    })

    it('handles long excerpts gracefully', () => {
      const longExcerptPost = {
        ...mockBlogPost,
        excerpt: 'This is a very long excerpt that goes on and on and should still be displayed properly within the card component without breaking the layout or causing any visual issues. It should be truncated with CSS if it exceeds the maximum number of lines.'
      }
      render(<BlogCard blogPost={longExcerptPost} />)
      expect(screen.getByText(/This is a very long excerpt/)).toBeInTheDocument()
    })

    it('handles empty excerpt', () => {
      const emptyExcerptPost = { ...mockBlogPost, excerpt: '' }
      const { container } = render(<BlogCard blogPost={emptyExcerptPost} />)
      const excerpt = container.querySelector('.excerpt')
      expect(excerpt).toBeInTheDocument()
      expect(excerpt?.textContent).toBe('')
    })

    it('handles different category names', () => {
      const tutorialPost = { ...mockBlogPost, category: 'Tutorial' }
      render(<BlogCard blogPost={tutorialPost} />)
      expect(screen.getByText('Tutorial')).toBeInTheDocument()
    })

    it('handles special characters in title', () => {
      const specialCharPost = {
        ...mockBlogPost,
        title: 'Understanding Mortgage Rates: How They Work & What Affects Them?'
      }
      render(<BlogCard blogPost={specialCharPost} />)
      expect(screen.getByText(/Understanding Mortgage Rates/)).toBeInTheDocument()
    })
  })

  describe('metadata display', () => {
    it('displays metadata separator', () => {
      render(<BlogCard blogPost={mockBlogPost} />)
      expect(screen.getByText('•')).toBeInTheDocument()
    })

    it('displays all metadata elements in correct order', () => {
      const { container } = render(<BlogCard blogPost={mockBlogPost} />)
      const metadata = container.querySelector('.metadata')
      expect(metadata?.textContent).toContain('January 15, 2024')
      expect(metadata?.textContent).toContain('•')
      expect(metadata?.textContent).toContain('5 min read')
    })
  })

  describe('image optimization', () => {
    it('uses Next.js Image component for optimization', () => {
      const { container } = render(<BlogCard blogPost={mockBlogPost} />)
      const image = container.querySelector('img')
      expect(image).toBeInTheDocument()
    })

    it('sets correct alt text for accessibility', () => {
      render(<BlogCard blogPost={mockBlogPost} />)
      const image = screen.getByAltText('Test Blog Post Title')
      expect(image).toBeInTheDocument()
    })
  })
})
