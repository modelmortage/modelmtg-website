'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import styles from './InstagramFeed.module.css'

const posts = [
  'https://www.instagram.com/p/DD0FNcZvR7y/',
  'https://www.instagram.com/p/DAJogPCS8t-/',
  'https://www.instagram.com/p/C9n97LovUnJ/',
  'https://www.instagram.com/p/C6yunqULJYN/',
]

export function InstagramFeed() {
  useEffect(() => {
    // If the script has already loaded (cached from prior navigation),
    // process() needs to be called manually — the script won't re-fire.
    const processEmbeds = () => {
      if ((window as any).instgrm?.Embeds) {
        (window as any).instgrm.Embeds.process()
        return true
      }
      return false
    }

    // Try immediately in case script is already loaded
    if (processEmbeds()) return

    // Otherwise poll until it's ready (handles lazyOnload timing)
    const interval = setInterval(() => {
      if (processEmbeds()) clearInterval(interval)
    }, 200)

    // Give up after 10 seconds
    const timeout = setTimeout(() => clearInterval(interval), 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.label}>Follow Along</span>
        <div className={styles.grid}>
          {posts.map((url) => (
            <div key={url} className={styles.postWrapper}>
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
                data-instgrm-version="14"
              />
            </div>
          ))}
        </div>
      </div>
      <Script
        src="//www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).instgrm?.Embeds) {
            (window as any).instgrm.Embeds.process()
          }
        }}
      />
    </section>
  )
}
