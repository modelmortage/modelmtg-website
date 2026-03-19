'use client'

import { useEffect, useRef } from 'react'
import styles from './LuxurySilkBackground.module.css'

interface LuxurySilkBackgroundProps {
  intensity?: 'subtle' | 'medium' | 'strong'
  speed?: 'slow' | 'medium' | 'fast'
  enableParallax?: boolean
}

/**
 * Premium black silk/smoke background animation with subtle gold shimmer
 * Designed for luxury branding - Rolls-Royce / Bentley aesthetic
 */
export function LuxurySilkBackground({
  intensity = 'subtle',
  speed = 'slow',
  enableParallax = false
}: LuxurySilkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enableParallax || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      const xPercent = (clientX / innerWidth - 0.5) * 2
      const yPercent = (clientY / innerHeight - 0.5) * 2
      
      containerRef.current.style.setProperty('--mouse-x', `${xPercent * 20}px`)
      containerRef.current.style.setProperty('--mouse-y', `${yPercent * 20}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableParallax])

  return (
    <div 
      ref={containerRef}
      className={`${styles.silkBackground} ${styles[intensity]} ${styles[speed]}`}
      aria-hidden="true"
    >
      {/* Multiple silk wave layers */}
      <div className={styles.silkLayer1}></div>
      <div className={styles.silkLayer2}></div>
      <div className={styles.silkLayer3}></div>
      
      {/* Gold shimmer accents */}
      <div className={styles.goldShimmer1}></div>
      <div className={styles.goldShimmer2}></div>
      
      {/* Vignette mask */}
      <div className={styles.vignette}></div>
    </div>
  )
}
