'use client'

import { motion } from 'framer-motion'
import styles from './LocationMap.module.css'

export function LocationMap() {
  return (
    <section className={styles.section} aria-labelledby="location-heading">
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className={styles.textContent}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.label}>Visit Us</span>
            <h2 id="location-heading" className={styles.title}>
              Office Location
            </h2>
            <div className={styles.divider}></div>
            <address className={styles.address}>
              <p className={styles.addressLine}>Model Mortgage</p>
              <p className={styles.addressLine}>Houston, Texas</p>
            </address>
          </motion.div>

          <motion.div 
            className={styles.mapWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.306904989146!2d-95.467524!3d29.739829800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c165fe3d21d9%3A0xd9e4c8f2f6b7720c!2s5251%20Westheimer%20Rd%20%23830%2C%20Houston%2C%20TX%2077056!5e0!3m2!1sen!2sus!4v1773933627411!5m2!1sen!2sus"
              className={styles.map}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Model Mortgage location in Houston, Texas"
              aria-label="Google Maps showing Model Mortgage office location in Houston, Texas"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
