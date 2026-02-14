'use client'

import { useState } from 'react'
import styles from './contact.module.css'

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [notes, setNotes] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        setIsLoading(true)
        setStatus('idle')
        setErrorMessage('')

        const formData = new FormData(form)
        // ... (data creation)
        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            strategy_interest: formData.get('strategy_interest'),
            briefing_notes: notes,
            company: formData.get('company'), // Honeypot
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/contact-submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'Failed to submit form')
            }

            setStatus('success')
            // Reset form
            form.reset()
            setNotes('')
        } catch (error) {
            console.error('Submission error:', error)
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* ... other imports/fields ... */}

            {/* Form fields start here... */}

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        className={styles.formInput}
                        placeholder="John Sterling"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                        type="email"
                        name="email"
                        className={styles.formInput}
                        placeholder="client@email.com"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    className={styles.formInput}
                    placeholder="(555) 123-4567"
                    disabled={isLoading}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Strategy Interest</label>
                <select name="strategy_interest" className={styles.formSelect} required disabled={isLoading}>
                    <option value="">Select an option</option>
                    <option value="purchase">Home Purchase</option>
                    <option value="refinance">Refinance</option>
                    <option value="investment">Investment Property</option>
                    <option value="construction">Custom Construction</option>
                    <option value="consultation">General Consultation</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Briefing Notes</label>
                <textarea
                    name="briefing_notes"
                    className={styles.formTextarea}
                    placeholder="Outline your specific requirements..."
                    rows={4}
                    maxLength={250}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isLoading}
                ></textarea>
                <div className={styles.charCount}>
                    {notes.length}/250
                </div>
            </div>

            <div className={styles.formSubmit}>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    <span className={styles.buttonText}>
                        {isLoading ? 'Submitting...' : 'Request Consultation'}
                    </span>
                    <div className={styles.buttonOverlay}></div>
                </button>
            </div>

            {status === 'success' && (
                <div className={styles.successMessage}>
                    Thank you. Your request has been received. We will be in touch shortly.
                </div>
            )}

            {status === 'error' && (
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}
        </form>
    )
}
