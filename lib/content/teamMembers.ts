import { TeamMember, PageMetadata } from '@/lib/types/content'

export interface MeetOurTeamContent {
  metadata: PageMetadata
  hero: {
    title: string
    subtitle: string
  }
  intro: string
  teamMembers: TeamMember[]
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'matthew-bramow',
    name: 'Matthew Bramow',
    title: 'Owner & Senior Mortgage Broker',
    bio: `Meet Matthew, a seasoned mortgage broker with nearly a decade of experience in the industry. Matthew has established himself as a trusted professional in the field, dedicated to helping individuals and families secure their dream homes.

With a loving wife and two beautiful children, Matthew understands the importance of finding the perfect place to create lifelong memories. He values the significance of homeownership and is passionate about guiding his clients through the mortgage process with care and expertise.

Known for his exceptional service and commitment to client satisfaction, Matthew has garnered high online reviews from countless satisfied customers who praise his ability to simplify complex financial matters and provide tailored solutions. With Matthew & his team by your side, you can rest assured that your mortgage needs will be handled with the utmost professionalism and personalized attention.`,
    photo: '/images/team/matthew-bramow.jpg',
    credentials: [
      'NMLS #1234567',
      'Nearly 10 years of mortgage industry experience',
      'Exceptional online reviews and client satisfaction ratings'
    ],
    specialties: [
      'First-time homebuyers',
      'Complex financial situations',
      'Personalized mortgage solutions',
      'Financial education and guidance'
    ],
    contact: {
      email: 'matthew@modelmtg.com',
      phone: '(713) 123-4567',
      calendly: 'https://calendly.com/matthew-bramow'
    },
    metadata: {
      title: 'Matthew Bramow | Senior Mortgage Broker - Model Mortgage',
      description: 'Meet Matthew Bramow, owner of Model Mortgage with nearly a decade of experience helping families secure their dream homes in Houston.',
      keywords: [
        'Matthew Bramow',
        'mortgage broker Houston',
        'Model Mortgage owner',
        'experienced mortgage professional',
        'home loan expert'
      ],
      ogImage: '/images/team/matthew-bramow-og.jpg',
      canonical: '/matthew-bramow'
    }
  },
  {
    slug: 'rolston-nicholls',
    name: 'Rolston Nicholls',
    title: 'Mortgage Broker',
    bio: `Rolston Nicholls isn't just your average mortgage broker – he's your trusted guide through the labyrinth of home financing. With a background as a former math teacher for kids, Rolston brings a unique blend of analytical prowess and empathy to the world of mortgages.

Born and raised with a passion for numbers and finance, Rolston's journey from the classroom to mortgage brokerage was a natural evolution driven by his desire to help individuals and families achieve their homeownership dreams.

Drawing from his experience as an educator, Rolston has a knack for breaking down complex financial concepts into easily digestible bits, ensuring that his clients are not just informed, but empowered to make confident decisions about their mortgage options.

Fluent in both the language of numbers and the art of communication, Rolston is committed to providing personalized guidance tailored to each client's unique needs and goals. Whether you're a first-time homebuyer navigating the maze of loan options or a seasoned investor looking to optimize your real estate portfolio, Rolston's patient, attentive approach ensures that you're in good hands every step of the way.`,
    photo: '/images/team/rolston-nicholls.jpg',
    credentials: [
      'NMLS #7654321',
      'Former mathematics educator',
      'Specialized in client education and empowerment'
    ],
    specialties: [
      'First-time homebuyers',
      'Investment property financing',
      'Financial education and literacy',
      'Complex loan scenarios'
    ],
    contact: {
      email: 'rolston@modelmtg.com',
      phone: '(713) 765-4321',
      calendly: 'https://calendly.com/rolston-nicholls'
    },
    metadata: {
      title: 'Rolston Nicholls | Mortgage Broker - Model Mortgage',
      description: 'Meet Rolston Nicholls, former math teacher turned mortgage broker, specializing in breaking down complex financial concepts for clients.',
      keywords: [
        'Rolston Nicholls',
        'mortgage broker',
        'Model Mortgage',
        'financial education',
        'home loan specialist'
      ],
      ogImage: '/images/team/rolston-nicholls-og.jpg',
      canonical: '/rolston-nicholls'
    }
  }
]

export const meetOurTeamContent: MeetOurTeamContent = {
  metadata: {
    title: 'Meet Our Team | Expert Mortgage Professionals - Model Mortgage',
    description: 'Meet the dedicated mortgage professionals at Model Mortgage. Our team combines expertise, education, and personalized service to help you achieve homeownership.',
    keywords: [
      'Model Mortgage team',
      'mortgage brokers Houston',
      'Matthew Bramow',
      'Rolston Nicholls',
      'mortgage professionals',
      'home loan experts'
    ],
    ogImage: '/images/meet-our-team-og.jpg',
    canonical: '/meet-our-team'
  },
  hero: {
    title: 'Meet Our Team',
    subtitle: 'Dedicated professionals committed to your homeownership success'
  },
  intro: `At Model Mortgage, we believe in empowering our clients not only through exceptional mortgage services but also through valuable financial education. Our team of experienced professionals is dedicated to helping individuals and families achieve their homeownership dreams with personalized guidance and expert support.`,
  teamMembers
}
