import { supabase } from '../supabase/client'

const MAX_EXPORTS_PER_DAY = 15
const RATE_LIMIT_WINDOW_HOURS = 24

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date | null
  message?: string
}

/**
 * Generate a browser fingerprint for rate limiting
 * Uses multiple browser characteristics to create a unique identifier
 */
function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform
  ]
  
  const fingerprint = components.join('|')
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  return `fp_${Math.abs(hash).toString(36)}`
}

/**
 * Check if the user has exceeded the rate limit
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
  const fingerprint = generateFingerprint()
  const now = new Date()
  const windowStart = new Date(now.getTime() - (RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000))

  try {
    // Count exports in the last 24 hours for this fingerprint
    const { data, error } = await supabase
      .from('calculator_exports')
      .select('id, created_at')
      .eq('fingerprint', fingerprint)
      .gte('created_at', windowStart.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Rate limit check error:', error)
      // On error, allow the export but log it
      return {
        allowed: true,
        remaining: MAX_EXPORTS_PER_DAY,
        resetTime: null,
        message: 'Rate limit check failed, allowing export'
      }
    }

    const exportCount = data?.length || 0
    const remaining = Math.max(0, MAX_EXPORTS_PER_DAY - exportCount)

    if (exportCount >= MAX_EXPORTS_PER_DAY) {
      // Find the oldest export to calculate reset time
      const oldestExport = data[data.length - 1]
      const resetTime = new Date(new Date(oldestExport.created_at).getTime() + (RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000))
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        message: `Rate limit exceeded. You can export again after ${resetTime.toLocaleString()}`
      }
    }

    return {
      allowed: true,
      remaining,
      resetTime: null
    }
  } catch (err) {
    console.error('Rate limit check exception:', err)
    // On exception, allow the export
    return {
      allowed: true,
      remaining: MAX_EXPORTS_PER_DAY,
      resetTime: null
    }
  }
}

/**
 * Get the fingerprint for the current browser
 */
export function getFingerprint(): string {
  return generateFingerprint()
}

/**
 * Format time remaining until rate limit resets
 */
export function formatTimeRemaining(resetTime: Date): string {
  const now = new Date()
  const diff = resetTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'now'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`
}
