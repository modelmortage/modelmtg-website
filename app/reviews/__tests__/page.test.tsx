import { render, screen } from '@testing-library/react'
import ReviewsPage from '../page'
import { reviewsContent } from '@/lib/content/reviews'

// Mock the ContentPage component
jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ 
    title, 
    subtitle, 
    children 
  }: { 
    title: string
    subtitle: string
    children: React.ReactNode 
  }) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    )
  }
})

describe('ReviewsPage', () => {
  it('renders the page title and subtitle', () => {
    render(<ReviewsPage />)
    
    expect(screen.getByText(reviewsContent.hero.title)).toBeInTheDocument()
    expect(screen.getByText(reviewsContent.hero.subtitle)).toBeInTheDocument()
  })

  it('uses the ContentPage component', () => {
    render(<ReviewsPage />)
    
    expect(screen.getByTestId('content-page')).toBeInTheDocument()
  })

  it('renders the introduction text', () => {
    render(<ReviewsPage />)
    
    expect(screen.getByText(reviewsContent.introduction)).toBeInTheDocument()
  })

  it('displays the overall rating value', () => {
    render(<ReviewsPage />)
    
    const ratingValue = reviewsContent.overallRating.value.toFixed(1)
    expect(screen.getByText(ratingValue)).toBeInTheDocument()
  })

  it('displays the review count', () => {
    render(<ReviewsPage />)
    
    const reviewCount = `Based on ${reviewsContent.overallRating.count.toLocaleString()}+ reviews`
    expect(screen.getByText(reviewCount)).toBeInTheDocument()
  })

  it('renders all reviews', () => {
    render(<ReviewsPage />)
    
    reviewsContent.reviews.forEach(review => {
      expect(screen.getByText(review.name)).toBeInTheDocument()
      expect(screen.getByText(review.location)).toBeInTheDocument()
      // Check for review text (without quotes, as they're in separate elements)
      expect(screen.getByText(review.text)).toBeInTheDocument()
    })
  })

  it('displays loan types for reviews that have them', () => {
    render(<ReviewsPage />)
    
    const loanTypesWithReviews = reviewsContent.reviews
      .filter(review => review.loanType)
      .map(review => review.loanType)
    
    const uniqueLoanTypes = [...new Set(loanTypesWithReviews)]
    
    uniqueLoanTypes.forEach(loanType => {
      if (loanType) {
        const elements = screen.getAllByText(loanType)
        expect(elements.length).toBeGreaterThan(0)
      }
    })
  })

  it('renders review dates in correct format', () => {
    render(<ReviewsPage />)
    
    const formattedDates = reviewsContent.reviews.map(review => 
      new Date(review.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      })
    )
    
    const uniqueDates = [...new Set(formattedDates)]
    
    uniqueDates.forEach(formattedDate => {
      const elements = screen.getAllByText(formattedDate)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('displays client avatars with initials', () => {
    render(<ReviewsPage />)
    
    reviewsContent.reviews.forEach(review => {
      const firstInitial = review.name.split(' ')[0][0]
      const lastInitial = review.name.split(' ')[review.name.split(' ').length - 1][0]
      const initials = firstInitial + lastInitial
      
      // Check that the initials appear in the document
      const avatars = screen.getAllByText(initials)
      expect(avatars.length).toBeGreaterThan(0)
    })
  })

  it('renders the "What Our Clients Say" section title', () => {
    render(<ReviewsPage />)
    
    expect(screen.getByText('What Our Clients Say')).toBeInTheDocument()
  })

  it('renders all trust badges', () => {
    render(<ReviewsPage />)
    
    reviewsContent.trustBadges.forEach(badge => {
      expect(screen.getByText(badge.name)).toBeInTheDocument()
      expect(screen.getByText(badge.description)).toBeInTheDocument()
    })
  })

  it('renders the "Licensed & Certified" section title', () => {
    render(<ReviewsPage />)
    
    expect(screen.getByText('Licensed & Certified')).toBeInTheDocument()
  })

  it('includes structured data script for reviews', () => {
    const { container } = render(<ReviewsPage />)
    
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    
    if (script) {
      const structuredData = JSON.parse(script.textContent || '{}')
      expect(structuredData['@type']).toBe('Organization')
      expect(structuredData.name).toBe('Model Mortgage')
      expect(structuredData.aggregateRating).toBeDefined()
      expect(structuredData.review).toBeDefined()
      expect(structuredData.review.length).toBe(reviewsContent.reviews.length)
    }
  })

  it('includes correct aggregate rating in structured data', () => {
    const { container } = render(<ReviewsPage />)
    
    const script = container.querySelector('script[type="application/ld+json"]')
    if (script) {
      const structuredData = JSON.parse(script.textContent || '{}')
      expect(structuredData.aggregateRating.ratingValue).toBe(
        reviewsContent.overallRating.value.toString()
      )
      expect(structuredData.aggregateRating.reviewCount).toBe(
        reviewsContent.overallRating.count.toString()
      )
    }
  })

  it('renders review articles with proper semantic HTML', () => {
    const { container } = render(<ReviewsPage />)
    
    const articles = container.querySelectorAll('article')
    expect(articles.length).toBe(reviewsContent.reviews.length)
  })

  it('includes time elements with proper datetime attributes', () => {
    const { container } = render(<ReviewsPage />)
    
    reviewsContent.reviews.forEach(review => {
      const timeElement = container.querySelector(`time[datetime="${review.date}"]`)
      expect(timeElement).toBeInTheDocument()
    })
  })

  it('displays 5-star ratings for all reviews', () => {
    render(<ReviewsPage />)
    
    // Each review should have 5 stars
    // We have 12 reviews, plus 5 stars in the overall rating section
    // Total: (12 reviews × 5 stars) + 5 overall stars = 65 stars
    const stars = screen.getAllByText('★')
    expect(stars.length).toBeGreaterThanOrEqual(60) // At least 60 stars (12 reviews × 5)
  })

  it('renders quotes around review text', () => {
    const { container } = render(<ReviewsPage />)
    
    // Check for quote elements
    const quotes = container.querySelectorAll('.quote')
    // Each review has 2 quotes (opening and closing)
    expect(quotes.length).toBe(reviewsContent.reviews.length * 2)
  })
})
