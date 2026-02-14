/**
 * Proof Points - Dynamic Proof Metrics
 *
 * Derives proof metrics from live API data (Google reviews).
 * No hardcoded numbers - always reflects current API state.
 * Graceful fallbacks when data unavailable.
 */

export interface Review {
  rating: number
  author?: string
  text?: string
  date?: string
  profile_photo_url?: string
  review_url?: string
}

export interface ProofMetrics {
  rating: string | null
  count: string | null
  source: string
}

/**
 * Format rating value with 1-decimal precision
 * Returns "—" if invalid or empty
 */
export function formatRating(value?: number): string {
  if (value === undefined || value === null) return "—"
  if (typeof value !== "number" || isNaN(value)) return "—"
  if (value < 0 || value > 5) return "—"
  return (Math.round(value * 10) / 10).toFixed(1)
}

/**
 * Format review count
 * Returns "—" if missing/invalid
 */
export function formatCount(count?: number): string {
  if (count === undefined || count === null) return "—"
  if (typeof count !== "number" || !Number.isInteger(count)) return "—"
  if (count < 0) return "—"
  return count === 1 ? "1 review" : `${count} reviews`
}

/**
 * Calculate Google proof metrics from review array
 * @param reviews - Array of reviews from Google API
 * @returns Rating (formatted to 1 decimal) and review count
 */
export function getGoogleProof(reviews?: Review[]): ProofMetrics {
  if (!reviews || reviews.length === 0) {
    return {
      rating: null,
      count: null,
      source: "Google",
    }
  }

  const reviewCount = reviews.length
  const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount

  // Round to 1 decimal to match UI style (e.g., 5.0)
  const googleRating = Math.round(avg * 10) / 10

  return {
    rating: formatRating(googleRating),
    count: formatCount(reviewCount),
    source: "Google",
  }
}

/**
 * Format proof statement: "5.0 (10 reviews)"
 * Returns just the number if count unavailable
 * Returns null if both unavailable
 */
export function getProofStatement(
  rating?: number,
  count?: number,
): string | null {
  const formattedRating = formatRating(rating)
  const formattedCount = formatCount(count)

  if (formattedRating === "—" && formattedCount === "—") {
    return null
  }

  if (formattedRating === "—") {
    return `(${formattedCount})`
  }

  if (formattedCount === "—") {
    return formattedRating
  }

  return `${formattedRating} (${formattedCount})`
}

/**
 * Sanitize and validate proof data before display
 * Returns safe object with fallbacks
 */
export function sanitizeProofData(data?: {
  rating?: unknown
  count?: unknown
}): {
  rating: number | null
  count: number | null
} {
  return {
    rating:
      typeof data?.rating === "number" && data.rating >= 0 && data.rating <= 5
        ? data.rating
        : null,
    count:
      typeof data?.count === "number" && data.count >= 0
        ? Math.floor(data.count)
        : null,
  }
}
