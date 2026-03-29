'use client'

import { useEffect, useRef } from 'react'
import styles from './LuxurySilkBackground.module.css'

interface LuxurySilkBackgroundProps {
  intensity?: 'subtle' | 'medium' | 'strong'
  speed?: 'slow' | 'medium' | 'fast'
  enableParallax?: boolean
}

/**
 * Premium 3D architectural sculpture - ONE coherent dimensional object
 * Enters from left edge, fades into black. Feels like a luxury installation.
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
      
      // Subtle depth-based parallax
      containerRef.current.style.setProperty('--mouse-x', `${xPercent * 2}px`)
      containerRef.current.style.setProperty('--mouse-y', `${yPercent * 2}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableParallax])

  return (
    <div 
      ref={containerRef}
      className={`${styles.sculptureBackground} ${styles[intensity]} ${styles[speed]}`}
      aria-hidden="true"
    >
      {/* ONE sculptural 3D object - layered relief structure */}
      <div className={styles.sculptureObject}>
        {/* Back plane - deepest layer */}
        <div className={styles.backPlane}></div>
        
        {/* Mid relief - dimensional layer */}
        <div className={styles.midRelief}></div>
        
        {/* Front surface - closest layer */}
        <div className={styles.frontSurface}></div>
        
        {/* Edge lighting - reveals form */}
        <div className={styles.edgeLighting}></div>
        
        {/* Depth shadows - layer separation */}
        <div className={styles.depthShadow}></div>
      </div>
      
      {/* Natural fade to black */}
      <div className={styles.fadeGradient}></div>
    </div>
  )
}
