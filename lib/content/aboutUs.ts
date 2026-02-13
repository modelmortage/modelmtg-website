import { PageMetadata } from '@/lib/types/content'

export interface AboutUsContent {
  metadata: PageMetadata
  hero: {
    title: string
    subtitle: string
  }
  sections: Array<{
    heading?: string
    content: string
  }>
  stats: Array<{
    number: string
    label: string
    showStars?: boolean
  }>
  values: Array<{
    title: string
    description: string
    iconName: string
  }>
}

export const aboutUsContent: AboutUsContent = {
  metadata: {
    title: 'About Us | Model Mortgage - Financial Education & Expert Mortgage Services',
    description: 'Learn about Model Mortgage, led by Matthew Bramow. We empower clients through exceptional mortgage services and valuable financial education in Houston.',
    keywords: [
      'about Model Mortgage',
      'Matthew Bramow',
      'Houston mortgage broker',
      'financial education',
      'mortgage expert',
      'personalized mortgage service'
    ],
    ogImage: '/images/about-us-og.jpg',
    canonical: '/about-us'
  },
  hero: {
    title: 'About Model Mortgage',
    subtitle: 'Empowering clients through exceptional mortgage services and financial education'
  },
  sections: [
    {
      content: `Welcome to Model Mortgage, a leading mortgage agency owned by Matthew Bramow. At Model Mortgage, we believe in empowering our clients not only through exceptional mortgage services but also through valuable financial education. Matthew Bramow, our esteemed owner, is not only a knowledgeable mortgage expert but also a passionate advocate for financial literacy.`
    },
    {
      content: `With a deep understanding of the mortgage industry and a commitment to helping individuals and families achieve their financial goals, Matthew goes beyond traditional mortgage services. He actively incorporates financial education into the client experience, providing valuable insights and guidance to ensure that clients make informed decisions about their mortgage options.`
    },
    {
      content: `Matthew's dedication to financial education stems from his belief that informed clients are empowered clients. By equipping our clients with the necessary knowledge and tools, we aim to foster long-term financial well-being and success.`
    },
    {
      content: `At Model Mortgage, we prioritize personalized service, offering tailored solutions that align with our clients' unique needs and aspirations. Our team of experienced professionals, under Matthew's leadership, is committed to providing exceptional support throughout the mortgage process.`
    },
    {
      content: `Whether you are a first-time homebuyer, looking to refinance, or seeking guidance on real estate investments, Model Mortgage is your trusted partner. Join us on this journey towards financial empowerment and let us help you navigate the world of mortgages while providing valuable financial education along the way.`
    }
  ],
  stats: [
    { number: '$500M+', label: 'Total Loans Funded' },
    { number: '5,000+', label: 'Happy Clients' },
    { number: '15+ Years', label: 'Industry Experience' },
    { number: '18 Days', label: 'Average Close Time' },
    { number: '5.0', label: 'Google Rating', showStars: true }
  ],
  values: [
    {
      title: 'Financial Education',
      description: 'We believe informed clients are empowered clients. Matthew actively incorporates financial education into every client experience, providing valuable insights to help you make confident decisions.',
      iconName: 'FaGraduationCap'
    },
    {
      title: 'Personalized Service',
      description: 'Every client has unique needs and aspirations. We offer tailored mortgage solutions that align with your specific financial goals and circumstances.',
      iconName: 'FaUserCheck'
    },
    {
      title: 'Expert Guidance',
      description: 'With deep industry knowledge and years of experience, our team provides exceptional support throughout your entire mortgage journey.',
      iconName: 'FaLightbulb'
    },
    {
      title: 'Long-Term Partnership',
      description: 'We\'re not just here for one transaction. We\'re committed to your long-term financial well-being and success, serving as your trusted mortgage partner.',
      iconName: 'FaHandshake'
    }
  ]
}
