/**
 * Provider-agnostic rates adapter
 * Transforms external API responses into consistent RateResponse format
 */

export interface RateData {
  purchase30: number | string;
  refinance30: number | string;
  apr: number | string;
  change1w: number | string;
}

export interface RateResponse {
  state: 'TX';
  lastUpdatedISO: string;
  sourceLabel: string;
  loans: {
    fha: RateData;
    conventional: RateData;
    va: RateData;
  };
}

/**
 * Mock/default rates adapter
 * Used when API unavailable or in development
 */
export function createMockRates(): RateResponse {
  return {
    state: 'TX',
    lastUpdatedISO: new Date().toISOString(),
    sourceLabel: 'Mock Data',
    loans: {
      fha: {
        purchase30: '6.75%',
        refinance30: '6.82%',
        apr: '7.12%',
        change1w: '+0.15%'
      },
      conventional: {
        purchase30: '6.52%',
        refinance30: '6.58%',
        apr: '6.89%',
        change1w: '+0.08%'
      },
      va: {
        purchase30: '6.28%',
        refinance30: '6.35%',
        apr: '6.65%',
        change1w: '+0.10%'
      }
    }
  };
}

/**
 * Adapter for Zillow API format
 * @param zillowResponse - Response from Zillow API
 * @returns Standardized RateResponse
 */
export function adaptZillowRates(zillowResponse: any): RateResponse {
  // Example adapter - adjust based on actual Zillow API shape
  return {
    state: 'TX',
    lastUpdatedISO: new Date().toISOString(),
    sourceLabel: 'Zillow',
    loans: {
      fha: {
        purchase30: zillowResponse?.fha?.purchase30 || '6.75%',
        refinance30: zillowResponse?.fha?.refinance30 || '6.82%',
        apr: zillowResponse?.fha?.apr || '7.12%',
        change1w: zillowResponse?.fha?.change1w || '+0.15%'
      },
      conventional: {
        purchase30: zillowResponse?.conventional?.purchase30 || '6.52%',
        refinance30: zillowResponse?.conventional?.refinance30 || '6.58%',
        apr: zillowResponse?.conventional?.apr || '6.89%',
        change1w: zillowResponse?.conventional?.change1w || '+0.08%'
      },
      va: {
        purchase30: zillowResponse?.va?.purchase30 || '6.28%',
        refinance30: zillowResponse?.va?.refinance30 || '6.35%',
        apr: zillowResponse?.va?.apr || '6.65%',
        change1w: zillowResponse?.va?.change1w || '+0.10%'
      }
    }
  };
}
