/**
 * Tests for structured data implementation
 * Validates Requirement 6.6: Structured data (JSON-LD) for organization, articles, and breadcrumbs
 */

import { render } from '@testing-library/react'
import Home from '@/app/page'

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

jest.mock('@/components/home/HeroSection', () => {
  return function MockHeroSection() {
    return <div data-testid="hero">Hero</div>
  }
})

jest.mock('@/components/home/TrustBar', () => {
  return function MockTrustBar() {
    return <div data-testid="trust-bar">Trust Bar</div>
  }
})

jest.mock('@/components/home/LoanProgramsGrid', () => {
  return function MockLoanProgramsGrid() {
    return <div data-testid="loan-programs">Loan Programs</div>
  }
})

jest.mock('@/components/home/MarketPowerSection', () => {
  return function MockMarketPowerSection() {
    return <div data-testid="market-power">Market Power</div>
  }
})

jest.mock('@/components/home/AuthorityTimeline', () => {
  return function MockAuthorityTimeline() {
    return <div data-testid="authority-timeline">Authority Timeline</div>
  }
})

jest.mock('@/components/home/TrustStackWall', () => {
  return function MockTrustStackWall() {
    return <div data-testid="trust-stack">Trust Stack</div>
  }
})

jest.mock('@/components/home/PersonalBrandSection', () => {
  return function MockPersonalBrandSection() {
    return <div data-testid="personal-brand">Personal Brand</div>
  }
})

describe('Home Page Structured Data (Requirement 6.6)', () => {
  it('should include Organization structured data', () => {
    const { container } = render(<Home />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)
    
    // Find the Organization schema
    const orgScript = Array.from(scripts).find(script => {
      const content = script.textContent || ''
      return content.includes('"@type":"Organization"')
    })
    
    expect(orgScript).toBeTruthy()
    
    if (orgScript) {
      const structuredData = JSON.parse(orgScript.textContent || '{}')
      
      // Validate Organization schema structure
      expect(structuredData['@context']).toBe('https://schema.org')
      expect(structuredData['@type']).toBe('Organization')
      expect(structuredData.name).toBe('Model Mortgage')
      expect(structuredData.url).toBe('https://modelmtg.com')
      expect(structuredData.logo).toBeTruthy()
      expect(structuredData.description).toBeTruthy()
      
      // Validate address
      expect(structuredData.address).toBeDefined()
      expect(structuredData.address['@type']).toBe('PostalAddress')
      expect(structuredData.address.addressLocality).toBe('Houston')
      expect(structuredData.address.addressRegion).toBe('TX')
      expect(structuredData.address.addressCountry).toBe('US')
      
      // Validate contact point
      expect(structuredData.contactPoint).toBeDefined()
      expect(structuredData.contactPoint['@type']).toBe('ContactPoint')
      expect(structuredData.contactPoint.telephone).toBeTruthy()
      expect(structuredData.contactPoint.contactType).toBe('customer service')
    }
  })

  it('should include RealEstateAgent structured data', () => {
    const { container } = render(<Home />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    
    // Find the RealEstateAgent schema
    const agentScript = Array.from(scripts).find(script => {
      const content = script.textContent || ''
      return content.includes('"@type":"RealEstateAgent"')
    })
    
    expect(agentScript).toBeTruthy()
    
    if (agentScript) {
      const structuredData = JSON.parse(agentScript.textContent || '{}')
      
      // Validate RealEstateAgent schema structure
      expect(structuredData['@context']).toBe('https://schema.org')
      expect(structuredData['@type']).toBe('RealEstateAgent')
      expect(structuredData.name).toBeTruthy()
      expect(structuredData.telephone).toBeTruthy()
      expect(structuredData.address).toBeDefined()
      expect(structuredData.geo).toBeDefined()
    }
  })

  it('should have valid JSON in all structured data scripts', () => {
    const { container } = render(<Home />)
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    
    scripts.forEach(script => {
      const content = script.textContent || '{}'
      expect(() => JSON.parse(content)).not.toThrow()
    })
  })
})
