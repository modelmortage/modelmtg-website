import { render, screen } from '@testing-library/react'
import BlogPostPage, { generateMetadata, generateStaticParams } from '../page'
import { blogPosts } from '@/lib/content/blogPosts'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  usePathname: jest.fn(() => '/blog/test-post'),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

describe('BlogPostPage', () => {
  const mockPost = blogPosts[0]
  const mockParams = { slug: mockPost.slug }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateStaticParams', () => {
    it('should generate params for all blog posts', async () => {
      const params = await generateStaticParams()
      
      expect(params).toHaveLength(blogPosts.length)
      expect(params).toEqual(
        blogPosts.map((post) => ({ slug: post.slug }))
      )
    })

    it('should include all blog post slugs', async () => {
      const params = await generateStaticParams()
      const slugs = params.map((p) => p.slug)
      
      blogPosts.forEach((post) => {
        expect(slugs).toContain(post.slug)
      })
    })
  })

  describe('generateMetadata', () => {
    it('should generate correct metadata for a blog post', async () => {
      const metadata = await generateMetadata({ params: mockParams })
      
      expect(metadata.title).toBe(mockPost.metadata.title)
      expect(metadata.description).toBe(mockPost.metadata.description)
      expect(metadata.keywords).toBe(mockPost.metadata.keywords.join(', '))
    })

    it('should include Open Graph metadata with article type', async () => {
      const metadata = await generateMetadata({ params: mockParams })
      
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.openGraph?.title).toBe(mockPost.metadata.title)
      expect(metadata.openGraph?.description).toBe(mockPost.metadata.description)
    })

    it('should include article-specific Open Graph data', async () => {
      const metadata = await generateMetadata({ params: mockParams })
      
      expect(metadata.openGraph?.publishedTime).toBe(mockPost.publishDate)
      expect(metadata.openGraph?.authors).toEqual([mockPost.author])
      expect(metadata.openGraph?.tags).toEqual(mockPost.tags)
    })

    it('should include Twitter card metadata', async () => {
      const metadata = await generateMetadata({ params: mockParams })
      
      expect(metadata.twitter).toBeDefined()
      expect(metadata.twitter?.card).toBe('summary_large_image')
      expect(metadata.twitter?.title).toBe(mockPost.metadata.title)
      expect(metadata.twitter?.description).toBe(mockPost.metadata.description)
    })

    it('should include canonical URL', async () => {
      const metadata = await generateMetadata({ params: mockParams })
      
      expect(metadata.alternates?.canonical).toBe(mockPost.metadata.canonical)
    })

    it('should return not found metadata for invalid slug', async () => {
      const metadata = await generateMetadata({ params: { slug: 'non-existent-post' } })
      
      expect(metadata.title).toBe('Blog Post Not Found')
      expect(metadata.description).toBe('The requested blog post could not be found.')
    })
  })

  describe('BlogPostPage Component', () => {
    it('should render blog post title', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const titles = screen.getAllByText(mockPost.title)
      expect(titles.length).toBeGreaterThan(0)
    })

    it('should render blog post metadata', () => {
      render(<BlogPostPage params={mockParams} />)
      
      expect(screen.getByText(`By ${mockPost.author}`)).toBeInTheDocument()
      expect(screen.getByText(`${mockPost.readTime} min read`)).toBeInTheDocument()
    })

    it('should render category badge', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const categoryBadges = screen.getAllByText(mockPost.category)
      expect(categoryBadges.length).toBeGreaterThan(0)
    })

    it('should render all tags', () => {
      render(<BlogPostPage params={mockParams} />)
      
      mockPost.tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument()
      })
    })

    it('should render featured image', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const images = screen.getAllByAltText(mockPost.title)
      expect(images.length).toBeGreaterThan(0)
      expect(images[0]).toHaveAttribute('src', mockPost.featuredImage)
    })

    it('should render breadcrumb navigation', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const blogLinks = screen.getAllByText('Blog')
      expect(blogLinks.length).toBeGreaterThan(0)
      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    })

    it('should render article content', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Check that some content from the post is rendered
      // Skip the first line (which is the H1 title) and get actual content
      const contentLines = mockPost.content.trim().split('\n').filter(line => line.trim())
      const contentLine = contentLines.find(line => !line.startsWith('#') && line.length > 20)
      
      if (contentLine) {
        const firstWords = contentLine.trim().split(' ').slice(0, 5).join(' ')
        // The content should be present somewhere in the document
        expect(document.body.textContent).toContain(firstWords)
      } else {
        // If no suitable content line found, just check that body has content
        expect(document.body.textContent!.length).toBeGreaterThan(100)
      }
    })

    it('should render call-to-action button', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const ctaButtons = screen.getAllByText('Schedule a Call')
      expect(ctaButtons.length).toBeGreaterThan(0)
    })

    it('should render related posts section', () => {
      render(<BlogPostPage params={mockParams} />)
      
      expect(screen.getByText('Continue Reading')).toBeInTheDocument()
    })

    it('should render up to 3 related posts', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Get all related posts (excluding the current one)
      const relatedPosts = blogPosts.filter((p) => p.slug !== mockPost.slug).slice(0, 3)
      
      relatedPosts.forEach((post) => {
        const postTitles = screen.getAllByText(post.title)
        expect(postTitles.length).toBeGreaterThan(0)
      })
    })

    it('should include Article structured data', () => {
      const { container } = render(<BlogPostPage params={mockParams} />)
      
      const scripts = container.querySelectorAll('script[type="application/ld+json"]')
      expect(scripts.length).toBeGreaterThan(0)
      
      const articleScript = Array.from(scripts).find((script) => {
        const content = script.textContent || ''
        return content.includes('"@type":"BlogPosting"')
      })
      
      expect(articleScript).toBeDefined()
      
      if (articleScript) {
        const structuredData = JSON.parse(articleScript.textContent || '{}')
        expect(structuredData['@type']).toBe('BlogPosting')
        expect(structuredData.headline).toBe(mockPost.title)
        expect(structuredData.author.name).toBe(mockPost.author)
        expect(structuredData.datePublished).toBe(mockPost.publishDate)
      }
    })

    it('should include BreadcrumbList structured data', () => {
      const { container } = render(<BlogPostPage params={mockParams} />)
      
      const scripts = container.querySelectorAll('script[type="application/ld+json"]')
      const breadcrumbScript = Array.from(scripts).find((script) => {
        const content = script.textContent || ''
        return content.includes('"@type":"BreadcrumbList"')
      })
      
      expect(breadcrumbScript).toBeDefined()
      
      if (breadcrumbScript) {
        const structuredData = JSON.parse(breadcrumbScript.textContent || '{}')
        expect(structuredData['@type']).toBe('BreadcrumbList')
        expect(structuredData.itemListElement).toHaveLength(3)
        expect(structuredData.itemListElement[0].name).toBe('Home')
        expect(structuredData.itemListElement[1].name).toBe('Blog')
        expect(structuredData.itemListElement[2].name).toBe(mockPost.title)
      }
    })

    it('should call notFound for invalid slug', () => {
      const { notFound } = require('next/navigation')
      
      // notFound() throws an error in Next.js, so we need to catch it
      expect(() => {
        render(<BlogPostPage params={{ slug: 'non-existent-post' }} />)
      }).toThrow()
      
      expect(notFound).toHaveBeenCalled()
    })

    it('should format date correctly', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Check that the date is formatted in a readable way
      const dateElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'TIME' && content.includes(',')
      })
      
      expect(dateElements.length).toBeGreaterThan(0)
    })

    it('should render Header and Footer components', () => {
      const { container } = render(<BlogPostPage params={mockParams} />)
      
      // Check for header and footer presence
      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
    })
  })

  describe('Content Processing', () => {
    it('should render markdown headings as HTML headings', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Check that headings are rendered (the content has markdown headings)
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(1) // At least title + content headings
    })

    it('should render lists from markdown', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Check for list elements
      const lists = document.querySelectorAll('ul, ol')
      expect(lists.length).toBeGreaterThan(0)
    })

    it('should render paragraphs from content', () => {
      const { container } = render(<BlogPostPage params={mockParams} />)
      
      // Check for paragraph elements in the content
      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      // Should have at least one H1 (the title)
      expect(h1Elements.length).toBeGreaterThanOrEqual(1)
    })

    it('should have accessible breadcrumb navigation', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(breadcrumb).toBeInTheDocument()
    })

    it('should have proper time elements with datetime attribute', () => {
      const { container } = render(<BlogPostPage params={mockParams} />)
      
      const timeElements = container.querySelectorAll('time[datetime]')
      expect(timeElements.length).toBeGreaterThan(0)
      
      timeElements.forEach((time) => {
        expect(time.getAttribute('datetime')).toBeTruthy()
      })
    })

    it('should have alt text for images', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const images = screen.getAllByRole('img')
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt')
      })
    })
  })

  describe('Requirements Validation', () => {
    it('should display full article content - Requirement 4.5', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Verify that content is rendered
      expect(document.body.textContent).toBeTruthy()
      expect(document.body.textContent!.length).toBeGreaterThan(100)
    })

    it('should include breadcrumb navigation - Requirement 8.4', () => {
      render(<BlogPostPage params={mockParams} />)
      
      const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(breadcrumb).toBeInTheDocument()
      const blogLinks = screen.getAllByText('Blog')
      expect(blogLinks.length).toBeGreaterThan(0)
    })

    it('should include article structured data - Requirement 6.6', () => {
      const { container } = render(<BlogPostPage params={mockParams} />)
      
      const scripts = container.querySelectorAll('script[type="application/ld+json"]')
      const hasArticleSchema = Array.from(scripts).some((script) => {
        const content = script.textContent || ''
        return content.includes('"@type":"BlogPosting"')
      })
      
      expect(hasArticleSchema).toBe(true)
    })

    it('should include proper metadata - Requirements 6.1, 6.2', async () => {
      const metadata = await generateMetadata({ params: mockParams })
      
      expect(metadata.title).toBeTruthy()
      expect(metadata.description).toBeTruthy()
      expect(metadata.description!.length).toBeLessThanOrEqual(160)
    })

    it('should display article with proper formatting - Requirement 4.6', () => {
      render(<BlogPostPage params={mockParams} />)
      
      // Check for proper article structure
      const titles = screen.getAllByText(mockPost.title)
      expect(titles.length).toBeGreaterThan(0)
      expect(screen.getByText(`By ${mockPost.author}`)).toBeInTheDocument()
      const categories = screen.getAllByText(mockPost.category)
      expect(categories.length).toBeGreaterThan(0)
    })
  })
})
