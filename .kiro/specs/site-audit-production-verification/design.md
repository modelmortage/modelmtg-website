# Design Document: Site Audit Production Verification

## Overview

This design transforms the existing SITE_AUDIT_COMPREHENSIVE.md from a code inventory document into a complete, action-oriented production audit. The system will generate a comprehensive markdown document (SITE_AUDIT_PRODUCTION.md) containing measured production data, compliance verification, conversion analysis, and a prioritized fix list.

The audit document serves as both a diagnostic tool and a sprint planning resource, providing concrete measurements, pass/fail compliance checks, and actionable recommendations with clear acceptance criteria.

### Goals

1. Replace subjective assessments with measured production data (Lighthouse scores, CWV metrics, bundle sizes)
2. Provide pass/fail compliance verification for mortgage industry regulations
3. Identify conversion funnel friction points and optimization opportunities
4. Generate a sprint-ready prioritized fix list with effort estimates and acceptance criteria
5. Establish monitoring recommendations for ongoing site health

### Non-Goals

1. Automated remediation of identified issues (audit only, not fix)
2. Real-time monitoring implementation (recommendations only)
3. Competitor site auditing beyond snapshot comparison
4. Historical trend analysis (baseline snapshot only)

## Architecture

### System Components

The audit generation system consists of three layers:

1. **Data Collection Layer**: Scripts and tools that gather production measurements
   - Lighthouse CLI for performance scores
   - Next.js bundle analyzer for client bundle analysis
   - Web crawlers for link depth and 404 detection
   - Schema validators for structured data verification
   - Manual verification checklists for compliance

2. **Analysis Layer**: Logic that processes collected data and applies validation rules
   - Score thresholds (Lighthouse < 90 triggers bottleneck identification)
   - Content quality rules (< 300 words = thin content)
   - Performance budgets (> 20% over budget = flag)
   - Compliance pass/fail logic

3. **Document Generation Layer**: Markdown document assembly with tables and structured sections
   - Template-based section generation
   - Table formatting with consistent column structure
   - Priority assignment logic for fix list
   - Cross-referencing between sections

### Data Flow

```
Production Site → Data Collection Tools → Raw Measurements
                                              ↓
                                    Analysis & Validation
                                              ↓
                                    Markdown Document Assembly
                                              ↓
                                    SITE_AUDIT_PRODUCTION.md
```

### Technology Stack

- **Lighthouse CLI**: Performance, accessibility, SEO, and best practices auditing
- **@next/bundle-analyzer**: Client bundle size analysis
- **Screaming Frog** or **Sitebulb**: Site crawling for link depth, 404s, canonicals
- **Google Rich Results Test**: Schema validation
- **Google Search Console API**: Index coverage and keyword data
- **PageSpeed Insights API**: CrUX field data for Core Web Vitals
- **Node.js scripts**: Custom data collection and document generation
- **Markdown**: Document format for human readability and version control

## Components and Interfaces

### 1. Data Collection Scripts

#### LighthouseCollector
```typescript
interface LighthouseResult {
  pageType: string;
  url: string;
  mobile: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    issues: string[];
  };
  desktop: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    issues: string[];
  };
}

async function collectLighthouseData(
  urls: Record<string, string>
): Promise<LighthouseResult[]>
```

Runs Lighthouse CLI against representative URLs for each page type (Home, Calculator, Blog, Loan Option, Location). Extracts scores and top issues from JSON output.

#### BundleAnalyzer
```typescript
interface BundleInfo {
  route: string;
  sizeKB: number;
  contributors: string[];
  pageTypes: string[];
}

async function analyzeBundles(): Promise<BundleInfo[]>
```

Runs Next.js build with bundle analyzer enabled, parses output to identify top 5 largest client bundles and their primary contributors (GSAP, Recharts, etc.).

#### CrawlAnalyzer
```typescript
interface CrawlResult {
  url: string;
  statusCode: number;
  clickDepth: number;
  canonical: string;
  internalLinks: number;
  wordCount: number;
  hasLocalSchema: boolean;
}

async function crawlSite(baseUrl: string): Promise<CrawlResult[]>
```

Uses Screaming Frog or custom crawler to map site structure, identify 404s, measure link depth, and collect page-level metrics.

#### SchemaValidator
```typescript
interface SchemaValidation {
  url: string;
  schemaType: string;
  isValid: boolean;
  errors: string[];
  richResultsEligible: boolean;
}

async function validateSchema(urls: string[]): Promise<SchemaValidation[]>
```

Tests structured data using Google Rich Results Test API and Schema.org validator.

#### CoreWebVitalsCollector
```typescript
interface CWVData {
  pageType: string;
  url: string;
  lcp: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' };
  inp: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' };
  cls: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' };
  source: 'CrUX' | 'Lab';
}

async function collectCWV(urls: string[]): Promise<CWVData[]>
```

Fetches field data from PageSpeed Insights API (CrUX) or falls back to lab data.

### 2. Analysis Components

#### PerformanceAnalyzer
```typescript
interface PerformanceIssue {
  pageType: string;
  score: number;
  bottlenecks: string[];
  budgetStatus: 'within' | 'over';
  budgetOverage: number;
}

function analyzePerformance(
  lighthouse: LighthouseResult[],
  bundles: BundleInfo[],
  budgets: Record<string, number>
): PerformanceIssue[]
```

Applies validation rules:
- Score < 90 → identify top 3 bottlenecks
- Bundle size > budget * 1.2 → flag as performance issue

#### SEOAnalyzer
```typescript
interface SEOIssue {
  type: 'link-depth' | 'thin-content' | 'duplicate' | 'canonical' | 'schema';
  url: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

function analyzeSEO(crawl: CrawlResult[], schema: SchemaValidation[]): SEOIssue[]
```

Applies validation rules:
- Click depth > 3 → flag as SEO issue
- Word count < 300 → flag as thin content
- Missing local proof signals → flag as doorway page risk

#### ComplianceChecker
```typescript
interface ComplianceItem {
  requirement: string;
  pagesVerified: string[];
  status: 'pass' | 'fail';
  evidence: string;
  remediation: string;
}

function checkCompliance(manualChecklist: Record<string, boolean>): ComplianceItem[]
```

Processes manual verification checklist and generates pass/fail table.

#### ConversionAnalyzer
```typescript
interface ConversionInsight {
  pageType: string;
  hasPrimaryCTA: boolean;
  ctaHierarchy: string[];
  trackingStatus: Record<string, boolean>;
  recommendations: string[];
}

function analyzeConversion(
  pageTypes: string[],
  trackingData: Record<string, boolean>
): ConversionInsight[]
```

Identifies missing CTAs and tracking gaps.

### 3. Document Generator

#### AuditDocumentGenerator
```typescript
interface AuditConfig {
  productionUrl: string;
  snapshotDate: string;
  environment: string;
  pageTypes: string[];
  budgets: Record<string, number>;
}

class AuditDocumentGenerator {
  constructor(config: AuditConfig);
  
  async generate(): Promise<string>;
  
  private generateExecutiveSummary(): string;
  private generateProductionVerification(): string;
  private generateSEOAudit(): string;
  private generateComplianceChecklist(): string;
  private generateConversionAudit(): string;
  private generateContentStrategy(): string;
  private generatePerformanceAudit(): string;
  private generateSecurityAudit(): string;
  private generateReliabilitySection(): string;
  private generatePrioritizedFixList(): string;
  private generateMissingPages(): string;
}
```

Assembles markdown document from analyzed data, applying consistent table formatting and section structure.

## Data Models

### Page Type Classification
```typescript
type PageType = 
  | 'Home'
  | 'Calculator'
  | 'Blog'
  | 'Loan Option'
  | 'Location';

interface PageTypeConfig {
  type: PageType;
  exampleUrl: string;
  jsBudgetKB: number;
  requiredElements: string[];
}
```

### Fix List Entry
```typescript
interface FixListEntry {
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  issue: string;
  effort: 'S' | 'M' | 'L';
  impact: 'Low' | 'Medium' | 'High';
  owner: string;
  acceptanceCriteria: string;
  sourceSection: string;
}
```

### Audit Snapshot
```typescript
interface AuditSnapshot {
  date: string;
  environment: string;
  productionUrl: string;
  lighthouse: LighthouseResult[];
  cwv: CWVData[];
  bundles: BundleInfo[];
  crawl: CrawlResult[];
  schema: SchemaValidation[];
  compliance: ComplianceItem[];
  fixList: FixListEntry[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing the prework analysis, I identified the following patterns:

1. **Document Structure Properties**: Most acceptance criteria are about ensuring specific sections and data exist in the generated document. These are primarily example-based tests (verify section exists, verify table has correct columns).

2. **Conditional Flagging Properties**: Several criteria follow the pattern "WHEN condition THEN flag as issue". These are true properties that apply across all instances meeting the condition:
   - Score < 90 → identify bottlenecks
   - Depth > 3 → flag SEO issue
   - Words < 300 → flag thin content
   - Budget overrun > 20% → flag performance issue
   - Missing CTA → flag conversion issue
   - Missing header → flag security issue

3. **Priority Categorization Properties**: Fix list entries must be correctly categorized based on their characteristics (P0 = breaks leads/indexing/trust, P1 = affects CWV/conversion, etc.).

4. **Completeness Properties**: Every fix list entry must have acceptance criteria, every compliance item must have pass/fail status.

The properties below focus on the conditional rules and categorization logic that apply universally across the audit data.

### Property 1: Low Lighthouse Scores Trigger Bottleneck Identification

*For any* page type with a Lighthouse score below 90, the audit document must identify the top 3 performance bottlenecks for that page type.

**Validates: Requirements 1.7**

### Property 2: Deep Link Depth Triggers SEO Flagging

*For any* page with internal linking depth exceeding 3 clicks from the homepage, the audit document must flag it as an SEO issue.

**Validates: Requirements 2.9**

### Property 3: Thin Content Triggers Content Quality Flag

*For any* location page with less than 300 words of unique content, the audit document must flag it as thin content.

**Validates: Requirements 5.5**

### Property 4: Missing Local Proof Signals Trigger Doorway Page Risk Flag

*For any* location page lacking local proof signals (neighborhoods, market constraints, testimonials), the audit document must flag it as a doorway page risk.

**Validates: Requirements 5.6**

### Property 5: Budget Overruns Trigger Performance Flags

*For any* page type where the client JS bundle size exceeds its defined budget by more than 20%, the audit document must flag it as a performance issue.

**Validates: Requirements 6.7**

### Property 6: Missing CTAs Trigger Conversion Flags

*For any* page type lacking a clear primary call-to-action, the audit document must flag it as a conversion issue.

**Validates: Requirements 4.8**

### Property 7: Missing Security Headers Trigger Security Flags with Remediation

*For any* required security header (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) that is missing from production, the audit document must flag it as a security issue and include remediation steps.

**Validates: Requirements 7.6**

### Property 8: P0 Issues Must Break Leads, Indexing, or Trust

*For any* issue categorized as P0 priority in the fix list, it must be an issue that breaks lead generation, search engine indexing, or user trust.

**Validates: Requirements 9.3**

### Property 9: P1 Issues Must Affect Core Web Vitals or Conversion

*For any* issue categorized as P1 priority in the fix list, it must be an issue that affects Core Web Vitals metrics or conversion rates.

**Validates: Requirements 9.4**

### Property 10: P2 Issues Must Be Content Quality Improvements

*For any* issue categorized as P2 priority in the fix list, it must be a content expansion or quality improvement issue.

**Validates: Requirements 9.5**

### Property 11: P3 Issues Must Be Nice-to-Have Enhancements

*For any* issue categorized as P3 priority in the fix list, it must be a nice-to-have enhancement with lower impact.

**Validates: Requirements 9.6**

### Property 12: All Fix List Entries Have Acceptance Criteria

*For any* entry in the prioritized fix list, it must include clear acceptance criteria that can be used to verify completion.

**Validates: Requirements 9.7**

### Property 13: Missing Legal Pages Trigger Compliance Gap Flags

*For any* standard legal page (Terms of Use, Terms of Service) that is missing from the site, the audit document must flag it as a compliance gap.

**Validates: Requirements 10.5**

## Error Handling

### Data Collection Errors

**Lighthouse Failures**
- Retry with exponential backoff (3 attempts)
- Fall back to manual testing if automated fails
- Document which pages could not be tested

**API Rate Limiting**
- Implement request throttling for PageSpeed Insights API
- Cache results to minimize API calls
- Provide fallback to lab data when field data unavailable

**Crawl Errors**
- Handle 5xx errors gracefully (mark as server error, not 404)
- Respect robots.txt and rate limits
- Timeout protection for slow pages

**Schema Validation Errors**
- Catch malformed JSON-LD gracefully
- Report validation errors without crashing
- Continue validation for remaining pages

### Analysis Errors

**Missing Data**
- Use "N/A" or "Not Measured" for missing metrics
- Flag data gaps in executive summary
- Provide partial analysis when complete data unavailable

**Invalid Thresholds**
- Validate budget configurations before analysis
- Use sensible defaults if budgets not provided
- Warn when thresholds seem unrealistic

### Document Generation Errors

**Template Errors**
- Validate markdown syntax before writing
- Escape special characters in table cells
- Handle empty sections gracefully

**File System Errors**
- Check write permissions before generation
- Create backup of existing audit if present
- Atomic write to prevent partial documents

## Testing Strategy

### Unit Testing

Unit tests verify specific examples, edge cases, and error conditions for individual components:

**Data Collection Tests**
- Test Lighthouse CLI invocation with mock responses
- Test bundle analyzer parsing with sample build output
- Test crawler with mock HTML responses
- Test schema validator with valid and invalid JSON-LD

**Analysis Tests**
- Test score threshold logic (89 triggers bottleneck, 90 does not)
- Test budget calculation (120% overrun triggers flag, 119% does not)
- Test priority categorization with example issues
- Test edge cases (empty data, missing fields, null values)

**Document Generation Tests**
- Test markdown table formatting with various data
- Test section generation with complete and partial data
- Test special character escaping in table cells
- Test file writing and error handling

### Property-Based Testing

Property tests verify universal properties across all inputs using fast-check (minimum 100 iterations per test):

**Property Test 1: Low Score Bottleneck Identification**
```typescript
// Feature: site-audit-production-verification, Property 1: Low Lighthouse Scores Trigger Bottleneck Identification
fc.assert(
  fc.property(
    fc.array(lighthouseResultArbitrary),
    (results) => {
      const doc = generateAuditDocument({ lighthouse: results });
      const lowScorePages = results.filter(r => r.mobile.performance < 90 || r.desktop.performance < 90);
      
      for (const page of lowScorePages) {
        const bottlenecks = extractBottlenecks(doc, page.pageType);
        expect(bottlenecks.length).toBeGreaterThanOrEqual(3);
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 2: Deep Link Depth Flagging**
```typescript
// Feature: site-audit-production-verification, Property 2: Deep Link Depth Triggers SEO Flagging
fc.assert(
  fc.property(
    fc.array(crawlResultArbitrary),
    (crawlResults) => {
      const doc = generateAuditDocument({ crawl: crawlResults });
      const deepPages = crawlResults.filter(r => r.clickDepth > 3);
      
      for (const page of deepPages) {
        expect(doc).toContain(`SEO issue`);
        expect(doc).toContain(page.url);
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 3: Thin Content Flagging**
```typescript
// Feature: site-audit-production-verification, Property 3: Thin Content Triggers Content Quality Flag
fc.assert(
  fc.property(
    fc.array(locationPageArbitrary),
    (pages) => {
      const doc = generateAuditDocument({ crawl: pages });
      const thinPages = pages.filter(p => p.wordCount < 300);
      
      for (const page of thinPages) {
        expect(doc).toContain(`thin content`);
        expect(doc).toContain(page.url);
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 4: Budget Overrun Flagging**
```typescript
// Feature: site-audit-production-verification, Property 5: Budget Overruns Trigger Performance Flags
fc.assert(
  fc.property(
    fc.array(bundleInfoArbitrary),
    fc.record({ Home: fc.nat(500), Calculator: fc.nat(500) }),
    (bundles, budgets) => {
      const doc = generateAuditDocument({ bundles, budgets });
      
      for (const bundle of bundles) {
        const budget = budgets[bundle.pageTypes[0]];
        if (bundle.sizeKB > budget * 1.2) {
          expect(doc).toContain(`performance issue`);
          expect(doc).toContain(bundle.route);
        }
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 5: Priority Categorization Correctness**
```typescript
// Feature: site-audit-production-verification, Property 8-11: Priority Categorization
fc.assert(
  fc.property(
    fc.array(fixListEntryArbitrary),
    (entries) => {
      for (const entry of entries) {
        if (entry.priority === 'P0') {
          expect(
            entry.issue.includes('lead') ||
            entry.issue.includes('index') ||
            entry.issue.includes('trust') ||
            entry.issue.includes('broken')
          ).toBe(true);
        }
        
        if (entry.priority === 'P1') {
          expect(
            entry.issue.includes('CWV') ||
            entry.issue.includes('conversion') ||
            entry.issue.includes('performance') ||
            entry.issue.includes('LCP') ||
            entry.issue.includes('CLS')
          ).toBe(true);
        }
      }
    }
  ),
  { numRuns: 100 }
);
```

**Property Test 6: Acceptance Criteria Completeness**
```typescript
// Feature: site-audit-production-verification, Property 12: All Fix List Entries Have Acceptance Criteria
fc.assert(
  fc.property(
    fc.array(fixListEntryArbitrary),
    (entries) => {
      for (const entry of entries) {
        expect(entry.acceptanceCriteria).toBeTruthy();
        expect(entry.acceptanceCriteria.length).toBeGreaterThan(0);
      }
    }
  ),
  { numRuns: 100 }
);
```

### Integration Testing

Integration tests verify the complete audit generation workflow:

- End-to-end test with mock production site
- Test data collection → analysis → document generation pipeline
- Verify generated document structure and completeness
- Test with various data scenarios (all passing, all failing, mixed)

### Manual Testing

Manual verification required for:

- Compliance checklist items (visual inspection of production site)
- Content quality assessment (human judgment of uniqueness)
- Competitor analysis (manual research)
- Document readability and formatting

### Test Configuration

All property-based tests configured with:
- Minimum 100 iterations per test
- Seed-based reproducibility for failures
- Shrinking enabled for minimal counterexamples
- Tagged with feature name and property number


## Document Structure Specification

The generated SITE_AUDIT_PRODUCTION.md follows this structure:

### Section 0: Executive Summary

**Content:**
- Changes since intent audit (what's new in this production version)
- Biggest risks (P0/P1 issues summary)
- Top 5 wins (fastest ROI opportunities)
- Baseline snapshot metadata (date, environment, production URL)

**Format:**
```markdown
## Executive Summary

**Audit Date:** [YYYY-MM-DD]
**Environment:** Production (Cloudflare Pages)
**Base URL:** [production URL]
**Previous Audit:** SITE_AUDIT_COMPREHENSIVE.md (code inventory)

### What Changed
This production audit replaces the code inventory with measured data...

### Biggest Risks (P0/P1)
1. [Issue] - [Impact]
2. [Issue] - [Impact]
...

### Top 5 Quick Wins
1. [Fix] - [Estimated effort] - [Expected impact]
...
```

### Section 1: Production Verification

**Content:**
- 1.1 Lighthouse Results by Page Type (table)
- 1.2 Core Web Vitals Field Data (table)
- 1.3 Bundle Size / Client Bundles (table)
- 1.4 Error Log Analysis (list with counts)
- 1.5 404 + Redirect Validation (list)

**Table 1.1 Format:**
| Page Type | Example URL | Mobile Score | Desktop Score | Biggest Issues (Top 3) | Fix Owner | Status |
|-----------|-------------|--------------|---------------|------------------------|-----------|--------|
| Home | / | 92 | 95 | - | - | ✅ |
| Calculator | /calculator/purchase | 78 | 85 | 1. Large JS bundle (450KB)<br>2. Render-blocking GSAP<br