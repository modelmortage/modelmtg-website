import { render, screen } from '@testing-library/react'
import AboutPage from '../page'
import { aboutUsContent } from '@/lib/content/aboutUs'

// Mock the ContentPage component
jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ title, subtitle, children }: any) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <div>{children}</div>
      </div>
    )
  }
})

describe('About Page', () => {
  it('renders the page title and subtitle', () => {
    render(<AboutPage />)
    
    expect(screen.getByText(aboutUsContent.hero.title)).toBeInTheDocument()
    expect(screen.getByText(aboutUsContent.hero.subtitle)).toBeInTheDocument()
  })

  it('renders all content sections', () => {
    render(<AboutPage />)
    
    aboutUsContent.sections.forEach((section) => {
      expect(screen.getByText(section.content)).toBeInTheDocument()
    })
  })

  it('renders all statistics', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('By The Numbers')).toBeInTheDocument()
    
    aboutUsContent.stats.forEach((stat) => {
      expect(screen.getByText(stat.number)).toBeInTheDocument()
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })

  it('renders all values', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('What Sets Us Apart')).toBeInTheDocument()
    
    aboutUsContent.values.forEach((value) => {
      expect(screen.getByText(value.title)).toBeInTheDocument()
      expect(screen.getByText(value.description)).toBeInTheDocument()
    })
  })

  it('renders the mission section heading', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Our Mission')).toBeInTheDocument()
  })

  it('uses the ContentPage component', () => {
    render(<AboutPage />)
    
    expect(screen.getByTestId('content-page')).toBeInTheDocument()
  })
})
