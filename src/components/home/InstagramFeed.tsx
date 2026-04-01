'use client'

import Script from 'next/script'
import styles from './InstagramFeed.module.css'

const posts = [
  'https://www.instagram.com/p/DD0FNcZvR7y/',
  'https://www.instagram.com/p/DAJogPCS8t-/',
  'https://www.instagram.com/p/C9n97LovUnJ/',
  'https://www.instagram.com/p/C6yunqULJYN/',
]

export function InstagramFeed() {
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
      <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
    </section>
  )
}
