import { render, screen } from '@testing-library/react'
import BlogPage from '../page'
import { blogPosts } from '@/lib/content/blogPosts'

// Mock the BlogCard component
jest.mock('@/components/content/BlogCard', () => {
  return function MockBlogCard({ blogPost }: { blogPost: any }) {
    return (
      <div data-testid={`blog-card-${blogPost.slug}`}>
        <h3>{blogPost.title}</h3>
        <p>{blogPost.excerpt}</p>
      </div>
    )
  }
})

describe('BlogPage', () => {
  it('renders the page title', () => {
    render(<BlogPage />)
    expect(screen.getByRole('heading', { name: /mortgage & home buying blog/i, level: 1 })).toBeInTheDocument()
  })

  it('renders the hero subtitle', () => {
    render(<BlogPage />)
    expect(screen.getByText(/expert advice, tips, and guides/i)).toBeInTheDocument()
  })

  it('renders all blog posts', () => {
    render(<BlogPage />)
    
    // Check that all blog posts are rendered
    blogPosts.forEach(post => {
      expect(screen.getByTestId(`blog-card-${post.slug}`)).toBeInTheDocument()
    })
  })

  it('renders blog posts in reverse chronological order', () => {
    render(<BlogPage />)
    
    // Get all blog card elements
    const blogCards = screen.getAllByTestId(/blog-card-/)
    
    // Verify we have the expected number of posts
    expect(blogCards.length).toBe(blogPosts.length)
    
    // Sort posts by date (newest first) to match component logic
    const sortedPosts = [...blogPosts].sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    })
    
    // Check that the first card matches the newest post
    expect(blogCards[0]).toHaveAttribute('data-testid', `blog-card-${sortedPosts[0].slug}`)
  })

  it('renders call-to-action section', () => {
    render(<BlogPage />)
    expect(screen.getByRole('heading', { name: /ready to start your home buying journey/i })).toBeInTheDocument()
  })

  it('renders CTA buttons with correct links', () => {
    render(<BlogPage />)
    
    const scheduleLink = screen.getByRole('link', { name: /schedule a call/i })
    expect(scheduleLink).toHaveAttribute('href', '/schedule-a-call')
    
    const calculatorLink = screen.getByRole('link', { name: /calculate affordability/i })
    expect(calculatorLink).toHaveAttribute('href', '/calculator/affordability')
  })

  it('includes structured data for SEO', () => {
    const { container } = render(<BlogPage />)
    
    const structuredData = container.querySelector('script[type="application/ld+json"]')
    expect(structuredData).toBeInTheDocument()
    
    if (structuredData) {
      const data = JSON.parse(structuredData.textContent || '{}')
      expect(data['@type']).toBe('Blog')
      expect(data.name).toBe('Model Mortgage Blog')
      expect(data.blogPost).toBeDefined()
      expect(Array.isArray(data.blogPost)).toBe(true)
    }
  })

  it('limits structured data to 10 most recent posts', () => {
    const { container } = render(<BlogPage />)
    
    const structuredData = container.querySelector('script[type="application/ld+json"]')
    if (structuredData) {
      const data = JSON.parse(structuredData.textContent || '{}')
      expect(data.blogPost.length).toBeLessThanOrEqual(10)
    }
  })

  it('displays at least 10 blog posts as per requirements', () => {
    render(<BlogPage />)
    
    const blogCards = screen.getAllByTestId(/blog-card-/)
    expect(blogCards.length).toBeGreaterThanOrEqual(10)
  })

  it('renders with proper semantic HTML structure', () => {
    const { container } = render(<BlogPage />)
    
    // Check for main sections
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThanOrEqual(3) // hero, posts, cta
    
    // Check for proper heading hierarchy
    const h1 = container.querySelectorAll('h1')
    expect(h1.length).toBe(1) // Only one H1
  })
})
