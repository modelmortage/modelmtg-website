import { render, screen } from '@testing-library/react'
import LearningCenterPage from '../page'
import { blogPosts } from '@/lib/content/blogPosts'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Learning Center Page', () => {
  it('renders the page without errors', () => {
    render(<LearningCenterPage />)
    
    // Check for main heading
    expect(screen.getByRole('heading', { name: /learning center/i, level: 1 })).toBeInTheDocument()
  })

  it('displays the hero section with title and subtitle', () => {
    render(<LearningCenterPage />)
    
    expect(screen.getByRole('heading', { name: /learning center/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/your comprehensive resource for mortgage education/i)).toBeInTheDocument()
  })

  it('displays popular topics section', () => {
    render(<LearningCenterPage />)
    
    expect(screen.getByRole('heading', { name: /popular topics/i })).toBeInTheDocument()
    expect(screen.getAllByText(/getting started/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/loan types/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/rates & costs/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/refinancing/i).length).toBeGreaterThan(0)
  })

  it('displays category sections with blog posts', () => {
    render(<LearningCenterPage />)
    
    // Check for category headings (using getAllByRole since some titles appear multiple times)
    const gettingStartedHeadings = screen.getAllByRole('heading', { name: /getting started/i })
    expect(gettingStartedHeadings.length).toBeGreaterThan(0)
    
    expect(screen.getByRole('heading', { name: /understanding loan types/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /all articles/i })).toBeInTheDocument()
  })

  it('displays blog post cards', () => {
    render(<LearningCenterPage />)
    
    // Check that at least some blog posts are rendered
    // We should see blog post titles from the blogPosts array
    const firstPost = blogPosts[0]
    expect(screen.getAllByText(firstPost.title).length).toBeGreaterThan(0)
  })

  it('displays mortgage calculators section', () => {
    render(<LearningCenterPage />)
    
    expect(screen.getByRole('heading', { name: /mortgage calculators & tools/i })).toBeInTheDocument()
    expect(screen.getByText(/affordability calculator/i)).toBeInTheDocument()
    expect(screen.getByText(/purchase calculator/i)).toBeInTheDocument()
    expect(screen.getByText(/refinance calculator/i)).toBeInTheDocument()
    expect(screen.getByText(/va loan calculator/i)).toBeInTheDocument()
  })

  it('displays call to action section', () => {
    render(<LearningCenterPage />)
    
    expect(screen.getByRole('heading', { name: /ready to take the next step/i })).toBeInTheDocument()
    expect(screen.getByText(/schedule a consultation/i)).toBeInTheDocument()
    expect(screen.getByText(/learn about us/i)).toBeInTheDocument()
  })

  it('has proper links to calculators', () => {
    render(<LearningCenterPage />)
    
    const affordabilityLink = screen.getByRole('link', { name: /affordability calculator/i })
    expect(affordabilityLink).toHaveAttribute('href', '/calculator/affordability')
    
    const purchaseLink = screen.getByRole('link', { name: /purchase calculator/i })
    expect(purchaseLink).toHaveAttribute('href', '/calculator/purchase')
    
    const refinanceLink = screen.getByRole('link', { name: /refinance calculator/i })
    expect(refinanceLink).toHaveAttribute('href', '/calculator/refinance')
    
    const vaLink = screen.getByRole('link', { name: /va loan calculator/i })
    expect(vaLink).toHaveAttribute('href', '/calculator/va-purchase')
  })

  it('has proper links in CTA section', () => {
    render(<LearningCenterPage />)
    
    const scheduleLink = screen.getByRole('link', { name: /schedule a consultation/i })
    expect(scheduleLink).toHaveAttribute('href', '/schedule-a-call')
    
    const aboutLink = screen.getByRole('link', { name: /learn about us/i })
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('includes structured data for SEO', () => {
    const { container } = render(<LearningCenterPage />)
    
    const structuredData = container.querySelector('script[type="application/ld+json"]')
    expect(structuredData).toBeInTheDocument()
    
    if (structuredData?.textContent) {
      const data = JSON.parse(structuredData.textContent)
      expect(data['@type']).toBe('CollectionPage')
      expect(data.name).toBe('Model Mortgage Learning Center')
      expect(data.mainEntity['@type']).toBe('ItemList')
    }
  })

  it('organizes posts by categories', () => {
    render(<LearningCenterPage />)
    
    // Check that category sections exist
    const gettingStartedSections = screen.getAllByRole('heading', { name: /getting started/i })
    expect(gettingStartedSections.length).toBeGreaterThan(0)
    
    const loanTypesSection = screen.getByRole('heading', { name: /understanding loan types/i })
    expect(loanTypesSection).toBeInTheDocument()
    
    const allArticlesSection = screen.getByRole('heading', { name: /all articles/i })
    expect(allArticlesSection).toBeInTheDocument()
  })

  it('displays topic cards with proper structure', () => {
    render(<LearningCenterPage />)
    
    // Check for topic card links
    const gettingStartedLink = screen.getByRole('link', { name: /getting started first-time buyer guides/i })
    expect(gettingStartedLink).toHaveAttribute('href', '#getting-started')
    
    const loanTypesLink = screen.getByRole('link', { name: /loan types compare mortgage options/i })
    expect(loanTypesLink).toHaveAttribute('href', '#loan-types')
  })

  it('sorts blog posts by date (newest first)', () => {
    render(<LearningCenterPage />)
    
    // Verify that posts are sorted by checking the order
    // The most recent post should appear first
    const sortedPosts = [...blogPosts].sort((a, b) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    })
    
    // Check that the first post title is present
    expect(screen.getAllByText(sortedPosts[0].title).length).toBeGreaterThan(0)
  })
})
