/**
 * Tests for team member page breadcrumb structured data
 * Validates Requirement 6.6: BreadcrumbList schema on nested pages
 */

import { render } from '@testing-library/react'
import RolstonNichollsPage from '@/app/rolston-nicholls/page'
import { teamMembers } from '@/lib/content/teamMembers'

// Mock the components
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>
  }
})

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

jest.mock('@/components/shared/Breadcrumbs', () => {
  return function MockBreadcrumbs() {
    return <nav data-testid="breadcrumbs">Breadcrumbs</nav>
  }
})

describe('Rolston Nicholls Page Breadcrumb Structured Data (Requirement 6.6)', () => {
  const member = teamMembers.find(m => m.slug === 'rolston-nicholls')!

  it('should include BreadcrumbList structured data', () => {
    const { container } = render(<RolstonNichollsPage />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)
    
    // Find the BreadcrumbList schema
    const breadcrumbScript = Array.from(scripts).find(script => {
      const content = script.textContent || ''
      return content.includes('"@type":"BreadcrumbList"')
    })
    
    expect(breadcrumbScript).toBeTruthy()
  })

  it('should have valid BreadcrumbList schema structure', () => {
    const { container } = render(<RolstonNichollsPage />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const breadcrumbScript = Array.from(scripts).find(script => {
      const content = script.textContent || ''
      return content.includes('"@type":"BreadcrumbList"')
    })
    
    if (breadcrumbScript) {
      const structuredData = JSON.parse(breadcrumbScript.textContent || '{}')
      
      // Validate BreadcrumbList schema structure
      expect(structuredData['@context']).toBe('https://schema.org')
      expect(structuredData['@type']).toBe('BreadcrumbList')
      expect(structuredData.itemListElement).toBeDefined()
      expect(Array.isArray(structuredData.itemListElement)).toBe(true)
    }
  })

  it('should have correct breadcrumb hierarchy', () => {
    const { container } = render(<RolstonNichollsPage />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const breadcrumbScript = Array.from(scripts).find(script => {
      const content = script.textContent || ''
      return content.includes('"@type":"BreadcrumbList"')
    })
    
    if (breadcrumbScript) {
      const structuredData = JSON.parse(breadcrumbScript.textContent || '{}')
      const items = structuredData.itemListElement
      
      // Should have 3 levels: Home > Meet Our Team > Rolston Nicholls
      expect(items.length).toBe(3)
      
      // Validate first item (Home)
      expect(items[0]['@type']).toBe('ListItem')
      expect(items[0].position).toBe(1)
      expect(items[0].name).toBe('Home')
      expect(items[0].item).toBe('https://modelmtg.com')
      
      // Validate second item (Meet Our Team)
      expect(items[1]['@type']).toBe('ListItem')
      expect(items[1].position).toBe(2)
      expect(items[1].name).toBe('Meet Our Team')
      expect(items[1].item).toBe('https://modelmtg.com/meet-our-team')
      
      // Validate third item (Rolston Nicholls)
      expect(items[2]['@type']).toBe('ListItem')
      expect(items[2].position).toBe(3)
      expect(items[2].name).toBe(member.name)
      expect(items[2].item).toBe(`https://modelmtg.com/${member.slug}`)
    }
  })

  it('should have valid JSON in structured data', () => {
    const { container } = render(<RolstonNichollsPage />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    
    scripts.forEach(script => {
      const content = script.textContent || '{}'
      expect(() => JSON.parse(content)).not.toThrow()
    })
  })
})
