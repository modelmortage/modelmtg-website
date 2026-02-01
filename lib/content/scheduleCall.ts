import { PageMetadata } from '@/lib/types/content'
import { IconType } from 'react-icons'

export interface ScheduleCallContent {
  metadata: PageMetadata
  hero: {
    title: string
    subtitle: string
  }
  intro: string
  schedulingOptions: Array<{
    title: string
    description: string
    iconName: string
    action: {
      text: string
      href: string
    }
  }>
  benefits: Array<{
    title: string
    description: string
    iconName: string
  }>
  calendlyUrl?: string
}

export const scheduleCallContent: ScheduleCallContent = {
  metadata: {
    title: 'Schedule a Call | Model Mortgage - Book Your Free Consultation',
    description: 'Schedule a free consultation with Model Mortgage. Discuss your mortgage needs with Matthew Bramow or Rolston Nicholls. Fast, personalized service.',
    keywords: [
      'schedule mortgage consultation',
      'book mortgage call',
      'free mortgage consultation Houston',
      'Matthew Bramow appointment',
      'Model Mortgage consultation',
      'mortgage broker meeting'
    ],
    ogImage: '/images/schedule-call-og.jpg',
    canonical: '/schedule-a-call'
  },
  hero: {
    title: 'Schedule Your Free Consultation',
    subtitle: 'Let\'s discuss your mortgage goals and find the perfect solution for your needs'
  },
  intro: 'Ready to take the next step in your homeownership journey? Schedule a call with one of our mortgage professionals to discuss your unique situation, explore your options, and get personalized guidance.',
  schedulingOptions: [
    {
      title: 'Matthew Bramow',
      description: 'Owner & Senior Mortgage Advisor. Specializing in purchase loans, refinancing, and financial education.',
      iconName: 'FaUser',
      action: {
        text: 'Schedule with Matthew',
        href: 'https://calendly.com/matthew-bramow'
      }
    },
    {
      title: 'Rolston Nicholls',
      description: 'Mortgage Advisor. Expert in VA loans, first-time homebuyers, and investment properties.',
      iconName: 'FaUser',
      action: {
        text: 'Schedule with Rolston',
        href: 'https://calendly.com/rolston-nicholls'
      }
    },
    {
      title: 'Call Us Directly',
      description: 'Prefer to speak with someone right away? Give us a call during business hours.',
      iconName: 'FaPhone',
      action: {
        text: 'Call (832) 727-4128',
        href: 'tel:832-727-4128'
      }
    },
    {
      title: 'Send a Message',
      description: 'Not ready for a call? Send us a message and we\'ll respond within 2 hours.',
      iconName: 'FaEnvelope',
      action: {
        text: 'Contact Us',
        href: '/contact'
      }
    }
  ],
  benefits: [
    {
      title: 'Free Consultation',
      description: 'No obligation, no pressure. Just honest advice and guidance tailored to your situation.',
      iconName: 'FaGift'
    },
    {
      title: 'Expert Guidance',
      description: 'Work with experienced mortgage professionals who understand the Houston market and your unique needs.',
      iconName: 'FaUserTie'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Choose a time that works for you. We offer early morning, evening, and weekend appointments.',
      iconName: 'FaClock'
    },
    {
      title: 'Fast Response',
      description: 'We typically respond within 2 hours and can often schedule same-day or next-day consultations.',
      iconName: 'FaBolt'
    }
  ],
  calendlyUrl: 'https://calendly.com/matthew-bramow'
}
