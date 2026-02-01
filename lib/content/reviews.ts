import { PageMetadata } from '@/lib/types/content'

export interface Review {
  id: string
  name: string
  location: string
  text: string
  rating: number
  date: string
  loanType?: string
}

export interface ReviewsPageContent {
  metadata: PageMetadata
  hero: {
    title: string
    subtitle: string
  }
  introduction: string
  overallRating: {
    value: number
    count: number
  }
  reviews: Review[]
  trustBadges: Array<{
    iconName: string
    name: string
    description: string
  }>
}

export const reviewsContent: ReviewsPageContent = {
  metadata: {
    title: 'Client Reviews | Model Mortgage - 5-Star Rated Mortgage Services',
    description: 'Read reviews from satisfied clients who chose Model Mortgage for their home financing needs. 5.0 rating with 1,000+ reviews from Houston families.',
    keywords: [
      'Model Mortgage reviews',
      'mortgage broker reviews Houston',
      'Matthew Bramow reviews',
      'client testimonials',
      'mortgage customer reviews',
      '5-star mortgage broker'
    ],
    ogImage: '/images/og/reviews.jpg',
    canonical: '/reviews'
  },
  hero: {
    title: 'Client Reviews',
    subtitle: 'See what our clients say about their experience with Model Mortgage'
  },
  introduction: 'At Model Mortgage, we believe in empowering our clients not only through exceptional mortgage services but also through valuable financial education. Our commitment to client satisfaction is reflected in the reviews and testimonials from the families we\'ve helped achieve their homeownership dreams.',
  overallRating: {
    value: 5.0,
    count: 1000
  },
  reviews: [
    {
      id: 'review-1',
      name: 'Sarah & Michael Chen',
      location: 'Houston Heights',
      text: 'Matthew helped us navigate a complex jumbo loan with ease. His expertise and attention to detail made our dream home purchase seamless.',
      rating: 5,
      date: '2024-12-15',
      loanType: 'Jumbo Loan'
    },
    {
      id: 'review-2',
      name: 'David Rodriguez',
      location: 'Katy, TX',
      text: 'Best mortgage experience I\'ve ever had. Fast, professional, and Matthew saved us $40K over the life of our loan.',
      rating: 5,
      date: '2024-12-10',
      loanType: 'Refinance'
    },
    {
      id: 'review-3',
      name: 'Jennifer Williams',
      location: 'Sugar Land',
      text: 'As a first-time buyer, I was nervous. Matthew explained everything clearly and got us an incredible rate. Highly recommend!',
      rating: 5,
      date: '2024-12-05',
      loanType: 'First-Time Home Buyer'
    },
    {
      id: 'review-4',
      name: 'Robert & Lisa Thompson',
      location: 'The Woodlands',
      text: 'Working with Rolston was fantastic. He broke down complex financial concepts in a way we could understand. Made the entire process stress-free.',
      rating: 5,
      date: '2024-11-20',
      loanType: 'Purchase'
    },
    {
      id: 'review-5',
      name: 'Marcus Johnson',
      location: 'Pearland',
      text: 'I shopped around with multiple lenders, and Model Mortgage beat everyone on rate and service. Matthew went above and beyond to close on time.',
      rating: 5,
      date: '2024-11-15',
      loanType: 'VA Loan'
    },
    {
      id: 'review-6',
      name: 'Emily Martinez',
      location: 'Cypress',
      text: 'The team at Model Mortgage made buying our first home a breeze. They were patient with all our questions and guided us every step of the way.',
      rating: 5,
      date: '2024-11-10',
      loanType: 'FHA Loan'
    },
    {
      id: 'review-7',
      name: 'James & Patricia Wilson',
      location: 'Memorial',
      text: 'We refinanced with Matthew and couldn\'t be happier. He found us a rate that will save us thousands. Highly professional and responsive.',
      rating: 5,
      date: '2024-10-25',
      loanType: 'Refinance'
    },
    {
      id: 'review-8',
      name: 'Amanda Foster',
      location: 'Bellaire',
      text: 'Exceptional service from start to finish. The Model Mortgage team made what could have been a stressful process incredibly smooth.',
      rating: 5,
      date: '2024-10-18',
      loanType: 'Purchase'
    },
    {
      id: 'review-9',
      name: 'Christopher Lee',
      location: 'Spring',
      text: 'Matthew\'s expertise in investment property loans is unmatched. He structured our DSCR loan perfectly and closed in record time.',
      rating: 5,
      date: '2024-10-10',
      loanType: 'Investment Property'
    },
    {
      id: 'review-10',
      name: 'Nicole & Brandon Davis',
      location: 'Richmond',
      text: 'We were first-time buyers and had so many questions. Rolston was patient, educational, and helped us feel confident throughout the entire process.',
      rating: 5,
      date: '2024-09-28',
      loanType: 'First-Time Home Buyer'
    },
    {
      id: 'review-11',
      name: 'Steven Garcia',
      location: 'Friendswood',
      text: 'Model Mortgage delivered on every promise. Great rates, fast closing, and excellent communication. Would recommend to anyone.',
      rating: 5,
      date: '2024-09-15',
      loanType: 'Purchase'
    },
    {
      id: 'review-12',
      name: 'Rachel Anderson',
      location: 'League City',
      text: 'Matthew helped us with a cash-out refinance to consolidate debt. His financial guidance was invaluable and saved us money every month.',
      rating: 5,
      date: '2024-09-05',
      loanType: 'Cash-Out Refinance'
    }
  ],
  trustBadges: [
    {
      iconName: 'FaCheckCircle',
      name: 'NMLS Certified',
      description: '#2516810'
    },
    {
      iconName: 'FaBalanceScale',
      name: 'Equal Housing Opportunity',
      description: 'Accredited'
    },
    {
      iconName: 'FaUniversity',
      name: 'Approved Lender',
      description: 'All Major Banks'
    },
    {
      iconName: 'FaLock',
      name: 'SSL Certified',
      description: 'Secure Platform'
    }
  ]
}
