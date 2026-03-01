import { NextRequest, NextResponse } from 'next/server';
import { createMockRates, RateResponse } from '@/src/lib/rates/provider';

/**
 * GET /api/tx-rates
 *
 * Returns current Texas mortgage rates for FHA, Conventional, VA
 *
 * Response format:
 * {
 *   state: "TX",
 *   lastUpdatedISO: ISO string,
 *   sourceLabel: "Zillow" | "Mock Data",
 *   loans: {
 *     fha: { purchase30, refinance30, apr, change1w },
 *     conventional: { ... },
 *     va: { ... }
 *   }
 * }
 *
 * Caching:
 * - s-maxage=3600 (1 hour): Cache in Vercel/CDN
 * - stale-while-revalidate=86400 (24 hours): Serve stale version while revalidating
 */

// Simple in-memory cache with TTL
let ratesCache: RateResponse | null = null;
let ratesCacheTime: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchRatesFromProvider(): Promise<RateResponse> {
  try {
    const apiUrl = process.env.RATES_API_URL;
    const apiKey = process.env.RATES_API_KEY;

    if (!apiUrl) {
      console.warn('RATES_API_URL not configured, using mock rates');
      return createMockRates();
    }

    // Fetch from external provider (Zillow, etc.)
    const response = await fetch(apiUrl, {
      headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
      next: { revalidate: 3600 } // ISR: Revalidate every hour
    });

    if (!response.ok) {
      console.error(`Rates API error: ${response.status}`);
      return createMockRates();
    }

    const data = await response.json();

    // Transform provider response to standard format
    // Adjust based on actual API response shape
    return {
      state: 'TX',
      lastUpdatedISO: new Date().toISOString(),
      sourceLabel: 'Provider',
      loans: {
        fha: {
          purchase30: data?.fha?.purchase30 || '6.75%',
          refinance30: data?.fha?.refinance30 || '6.82%',
          apr: data?.fha?.apr || '7.12%',
          change1w: data?.fha?.change1w || '+0.15%'
        },
        conventional: {
          purchase30: data?.conventional?.purchase30 || '6.52%',
          refinance30: data?.conventional?.refinance30 || '6.58%',
          apr: data?.conventional?.apr || '6.89%',
          change1w: data?.conventional?.change1w || '+0.08%'
        },
        va: {
          purchase30: data?.va?.purchase30 || '6.28%',
          refinance30: data?.va?.refinance30 || '6.35%',
          apr: data?.va?.apr || '6.65%',
          change1w: data?.va?.change1w || '+0.10%'
        }
      }
    };
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return createMockRates();
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<RateResponse | { error: string }>> {
  try {
    // Check in-memory cache
    if (ratesCache && Date.now() - ratesCacheTime < CACHE_TTL_MS) {
      return NextResponse.json(ratesCache, {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json'
        }
      });
    }

    // Fetch fresh rates
    const rates = await fetchRatesFromProvider();

    // Update cache
    ratesCache = rates;
    ratesCacheTime = Date.now();

    return NextResponse.json(rates, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Rates endpoint error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
