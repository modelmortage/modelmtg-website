import { render, screen } from '@testing-library/react'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'

describe('Breadcrumbs', () => {
  it('should render home link', () => {
    const items: BreadcrumbItem[] = []
    render(<Breadcrumbs items={items} />)
    
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('should render breadcrumb items with links', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Loan Options', href: '/loan-options' },
      { label: 'FHA Loans', href: '/loan-options/fha' }
    ]
    render(<Breadcrumbs items={items} />)
    
    const loanOptionsLink = screen.getByRole('link', { name: /loan options/i })
    expect(loanOptionsLink).toBeInTheDocument()
    expect(loanOptionsLink).toHaveAttribute('href', '/loan-options')
    
    // Last item should not be a link
    const fhaText = screen.getByText('FHA Loans')
    expect(fhaText).toBeInTheDocument()
    expect(fhaText.tagName).toBe('SPAN')
  })

  it('should mark last item as current page', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Blog', href: '/blog' },
      { label: 'Article Title', href: '/blog/article-title' }
    ]
    render(<Breadcrumbs items={items} />)
    
    const currentPage = screen.getByText('Article Title')
    expect(currentPage).toHaveAttribute('aria-current', 'page')
  })

  it('should render separators between items', () => {
    const items: BreadcrumbItem[] = [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/about/team' }
    ]
    render(<Breadcrumbs items={items} />)
    
    const separators = screen.getAllByText('/')
    // Should have 2 separators: Home / About / Team
    expect(separators).toHaveLength(2)
  })

  it('should have proper accessibility attributes', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Test', href: '/test' }
    ]
    render(<Breadcrumbs items={items} />)
    
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
  })

  it('should handle single breadcrumb item', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Contact', href: '/contact' }
    ]
    render(<Breadcrumbs items={items} />)
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should handle deep navigation paths', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Level 1', href: '/level1' },
      { label: 'Level 2', href: '/level1/level2' },
      { label: 'Level 3', href: '/level1/level2/level3' },
      { label: 'Level 4', href: '/level1/level2/level3/level4' }
    ]
    render(<Breadcrumbs items={items} />)
    
    // Should have links for all but the last item
    expect(screen.getByRole('link', { name: /level 1/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /level 2/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /level 3/i })).toBeInTheDocument()
    
    // Last item should not be a link
    const level4 = screen.getByText('Level 4')
    expect(level4.tagName).toBe('SPAN')
    expect(level4).toHaveAttribute('aria-current', 'page')
  })
})
