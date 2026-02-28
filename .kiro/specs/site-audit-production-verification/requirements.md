# Requirements Document

## Introduction

This specification transforms the existing SITE_AUDIT_COMPREHENSIVE.md from a design intent and code inventory document into a complete, action-oriented production audit for the Model Mortgage website. The enhanced audit will include measured production data, actionable insights, compliance verification, conversion optimization, and a prioritized fix list to guide sprint planning and improve site performance, SEO, lead generation, and regulatory compliance.

## Glossary

- **Site_Audit**: The SITE_AUDIT_COMPREHENSIVE.md document that inventories the Model Mortgage website structure, features, and technical implementation
- **Production_Environment**: The live Cloudflare Pages deployment accessible to end users
- **Core_Web_Vitals**: Google's user experience metrics including LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift)
- **CrUX**: Chrome User Experience Report providing real-world field data from actual users
- **Lighthouse**: Google's automated tool for measuring web page quality across performance, accessibility, SEO, and best practices
- **Page_Type**: A category of pages with similar structure (Home, Calculator, Blog post, Loan option, Location page)
- **SERP**: Search Engine Results Page where the site appears in search results
- **Index_Coverage**: The set of site pages that search engines have discovered and included in their search index
- **Schema_Validation**: Verification that structured data markup follows Schema.org standards and passes Rich Results Test
- **NMLS**: Nationwide Multistate Licensing System for mortgage industry professionals
- **TCPA**: Telephone Consumer Protection Act regulating phone and SMS communications
- **Conversion_Event**: A user action that represents business value (form submission, call initiation, calculator PDF export)
- **CTA**: Call-to-action element prompting user engagement
- **Doorway_Page**: Low-quality page created primarily for search engines rather than users (prohibited by Google)
- **Client_Bundle**: JavaScript code shipped to the browser that must be downloaded and executed
- **Hydration**: Process of attaching React event handlers to server-rendered HTML
- **CSP**: Content Security Policy HTTP header controlling resource loading
- **HSTS**: HTTP Strict Transport Security header enforcing HTTPS connections
- **RLS**: Row Level Security policies in Supabase controlling data access
- **P0_Priority**: Critical issues breaking leads, indexing, or trust that must be fixed immediately
- **P1_Priority**: High-impact issues affecting Core Web Vitals or conversion rates
- **P2_Priority**: Content expansion and quality improvements
- **P3_Priority**: Nice-to-have enhancements with lower impact

## Requirements

### Requirement 1: Production Verification Section

**User Story:** As a site owner, I want measured production performance data in the audit, so that I can identify actual performance issues and track improvements over time.

#### Acceptance Criteria

1. THE Site_Audit SHALL include a "Production Verification" section containing measured Lighthouse scores for Mobile and Desktop across all five Page_Types
2. THE Site_Audit SHALL include Core_Web_Vitals field data from CrUX or PageSpeed Insights for each Page_Type
3. THE Site_Audit SHALL include actual bundle size analysis from Next.js build output identifying the top 5 largest client bundles
4. THE Site_Audit SHALL include error log analysis from Cloudflare Pages deploy logs and runtime errors
5. THE Site_Audit SHALL include 404 and redirect validation results from production crawl
6. THE Production_Verification_Section SHALL present data in a table format with columns for page type, score, biggest issues, fix owner, and status
7. WHEN a Page_Type has a Lighthouse score below 90, THE Site_Audit SHALL identify the top 3 performance bottlenecks for that page type

### Requirement 2: SEO Audit Enhancement

**User Story:** As a site owner, I want comprehensive SEO verification beyond metadata, so that I can ensure search engines properly index and rank my content.

#### Acceptance Criteria

1. THE Site_Audit SHALL include index coverage analysis showing which dynamic pages (location pages, blog posts, loan options) are indexed by Google
2. THE Site_Audit SHALL include canonical URL correctness verification for all dynamic location pages
3. THE Site_Audit SHALL include crawlability verification confirming robots.txt and sitemap.xml correctness in Production_Environment
4. THE Site_Audit SHALL include duplicate content risk assessment for loan option pages and city/service template pages
5. THE Site_Audit SHALL include internal linking depth analysis showing maximum click distance from homepage to all pages
6. THE Site_Audit SHALL include Schema validation results from Rich Results Test and Schema.org validator for all structured data types
7. THE Site_Audit SHALL include a baseline of top 20 target keywords with current ranking positions
8. THE Site_Audit SHALL include competitor comparison snapshot analyzing 2-3 local Houston mortgage broker competitors
9. WHEN internal linking depth exceeds 3 clicks for any page, THE Site_Audit SHALL flag it as an SEO issue

### Requirement 3: Compliance and Legal Enhancement

**User Story:** As a mortgage broker, I want compliance verification in the audit, so that I can ensure regulatory requirements are met and avoid legal issues.

#### Acceptance Criteria

1. THE Site_Audit SHALL include a "Compliance Validation Checklist (Production)" section verifying NMLS compliance language placement in footer, contact page, and about page
2. THE Site_Audit SHALL verify rate disclaimer proximity on all rate-related content pages
3. THE Site_Audit SHALL verify "No commitment / informational only" disclaimers on all 7 calculator pages
4. THE Site_Audit SHALL verify Equal Housing Lender logo and Equal Housing Opportunity statement placement
5. WHERE phone or SMS lead capture exists, THE Site_Audit SHALL verify TCPA-style consent language
6. WHERE Google Analytics or Meta Pixel tracking exists, THE Site_Audit SHALL verify cookie disclosure presence
7. THE Compliance_Checklist SHALL present each requirement with pass/fail status and location verification

### Requirement 4: Conversion Audit

**User Story:** As a site owner, I want conversion funnel analysis in the audit, so that I can identify friction points and optimize lead generation.

#### Acceptance Criteria

1. THE Site_Audit SHALL identify all primary Conversion_Events including Schedule a call, Pre-qualify submit, Contact form submit, Click-to-call, and Calculator PDF export
2. THE Site_Audit SHALL verify tracking implementation for each Conversion_Event
3. THE Site_Audit SHALL document CTA hierarchy on each Page_Type
4. THE Site_Audit SHALL include calculator-to-lead conversion analysis showing the path from calculator usage to lead capture
5. THE Site_Audit SHALL identify lead magnet opportunities for top-of-funnel content (guides, checklists, downloadable resources)
6. THE Site_Audit SHALL include a funnel map showing the path from landing to calculator/loan page to CTA to conversion
7. THE Site_Audit SHALL provide recommended CTA placements for each Page_Type template
8. WHEN a Page_Type lacks a clear primary CTA, THE Site_Audit SHALL flag it as a conversion issue

### Requirement 5: Content Strategy Audit

**User Story:** As a site owner, I want content quality verification for dynamic pages, so that I can avoid thin content penalties and doorway page patterns.

#### Acceptance Criteria

1. THE Site_Audit SHALL include unique city-specific copy validation for all location pages
2. THE Site_Audit SHALL verify local proof signals including neighborhoods served, local market constraints, and local testimonials
3. THE Site_Audit SHALL assess Doorway_Page risk for location and loan option template pages
4. THE Site_Audit SHALL provide a content quality rubric for each location page including uniqueness score, internal link count, local schema presence, and FAQ variety
5. WHEN a location page has less than 300 words of unique content, THE Site_Audit SHALL flag it as thin content
6. WHEN a location page lacks local proof signals, THE Site_Audit SHALL flag it as a Doorway_Page risk

### Requirement 6: Performance Audit Enhancement

**User Story:** As a developer, I want detailed performance analysis of heavy libraries and hydration, so that I can optimize bundle size and improve page load times.

#### Acceptance Criteria

1. THE Site_Audit SHALL identify which Page_Types unnecessarily ship GSAP, Framer Motion, Recharts, html2canvas, or jsPDF in their Client_Bundle
2. THE Site_Audit SHALL verify that chart and calculator components are isolated to client components only when needed
3. THE Site_Audit SHALL verify that animations are gated behind intersection observers to prevent unnecessary execution
4. THE Site_Audit SHALL verify that PDF export libraries are dynamically imported only on user click
5. THE Site_Audit SHALL define a "Client JS budget" in kilobytes for each Page_Type
6. THE Site_Audit SHALL list the top 5 largest Client_Bundles with their sizes and primary contributors
7. WHEN a Page_Type exceeds its Client_JS_Budget by more than 20%, THE Site_Audit SHALL flag it as a performance issue

### Requirement 7: Security Audit Enhancement

**User Story:** As a site owner, I want security verification for edge deployment and API routes, so that I can ensure the site is protected against common vulnerabilities.

#### Acceptance Criteria

1. THE Site_Audit SHALL verify that Cloudflare Pages serves CSP, HSTS, X-Frame-Options, and X-Content-Type-Options headers in Production_Environment
2. THE Site_Audit SHALL verify rate limiting implementation for all API routes
3. THE Site_Audit SHALL verify contact form spam controls including honeypot or CAPTCHA
4. WHERE Supabase stores form submissions, THE Site_Audit SHALL verify RLS policies are configured
5. THE Site_Audit SHALL verify that no environment variables or source maps are exposed in Production_Environment
6. WHEN any security header is missing, THE Site_Audit SHALL flag it as a security issue with remediation steps

### Requirement 8: Reliability Section

**User Story:** As a site owner, I want a monitoring plan in the audit, so that I can proactively detect and resolve issues before they impact users.

#### Acceptance Criteria

1. THE Site_Audit SHALL include a "Reliability & Monitoring" section recommending uptime monitoring tools and configuration
2. THE Site_Audit SHALL recommend form delivery success rate monitoring
3. THE Site_Audit SHALL recommend API latency and error rate monitoring for all API routes
4. THE Site_Audit SHALL recommend Core_Web_Vitals trend monitoring via CrUX
5. THE Site_Audit SHALL recommend Google Search Console monitoring for index coverage and enhancement issues
6. THE Reliability_Section SHALL provide specific tool recommendations with setup instructions

### Requirement 9: Prioritized Fix List

**User Story:** As a project manager, I want a sprint-ready prioritized fix list, so that I can efficiently allocate development resources to high-impact improvements.

#### Acceptance Criteria

1. THE Site_Audit SHALL include a "Prioritized Fix List" section organizing all identified issues by priority (P0, P1, P2, P3)
2. THE Fix_List SHALL include columns for Priority, Issue Description, Effort (S/M/L), Impact (Low/Medium/High), Owner, and Acceptance Criteria
3. THE Fix_List SHALL categorize P0_Priority issues as those breaking leads, indexing, or trust
4. THE Fix_List SHALL categorize P1_Priority issues as those affecting Core_Web_Vitals or conversion rates
5. THE Fix_List SHALL categorize P2_Priority issues as content expansion and quality improvements
6. THE Fix_List SHALL categorize P3_Priority issues as nice-to-have enhancements
7. THE Fix_List SHALL provide clear acceptance criteria for each issue that can be used to verify completion

### Requirement 10: Missing Pages Section

**User Story:** As a site owner, I want identification of missing legal pages, so that I can ensure complete legal coverage and user transparency.

#### Acceptance Criteria

1. THE Site_Audit SHALL include a "Missing Pages" section identifying that Terms of Use and Terms of Service pages are not present
2. THE Missing_Pages_Section SHALL provide content recommendations for Terms of Use including user conduct, intellectual property, and limitation of liability
3. THE Missing_Pages_Section SHALL provide content recommendations for Terms of Service including service description, user obligations, and termination conditions
4. THE Missing_Pages_Section SHALL recommend footer link placement for Terms of Use and Terms of Service
5. WHEN a standard legal page is missing, THE Site_Audit SHALL flag it as a compliance gap
