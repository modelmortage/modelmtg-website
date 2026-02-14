'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page when the route changes
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // 1. Instant scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Critical for preventing weird smooth scroll jumps
    })

    // 2. Fallback timeout to catch any late layout shifts or browser restoration
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null
}
