/**
 * Home Sections Content Data
 *
 * Copy lives here. Layout lives in components. No coupling.
 * This structure is purely data - no JSX, no Tailwind.
 * Components query this for content.
 */

export const homeSections = {
  hero: {
    headline: "Houston Mortgage Lender for Home Purchase & Refinance",
    subheadline: "Helping Houston buyers secure the right mortgage with competitive rates, fast pre-approvals, and local expertise you can trust.",
    bullets: [
      "Personalized mortgage advice",
      "Access to multiple loan programs",
      "Local Houston expertise"
    ],
    trustPoints: [
      "Personalized Mortgage Advice—We walk you through every step — from pre-approval to closing.",
      "Access to Multiple Loan Programs—Conventional, FHA, VA, jumbo, and investor loan options.",
      "Local Houston Expertise—We understand local property taxes, insurance, and market conditions."
    ]
  },

  credibilityStrip: {
    title: "Trusted by Houston Buyers",
    tagline: "NMLS Licensed • Google Rated • Local Advisory"
  },

  pillars: {
    title: "A Private Client Approach",
    subtitle: "We focus on confidentiality, clarity, and structured guidance.",
    items: [
      {
        title: "Confidential Guidance",
        text: "Your financial situation is private. We handle sensitive information with discretion and professionalism."
      },
      {
        title: "Multiple Lender Options",
        text: "Access to diverse loan programs. We evaluate which structure works best for your unique scenario."
      },
      {
        title: "Houston Expertise",
        text: "Local market knowledge combined with clear communication ensures you understand every step."
      }
    ]
  },

  programs: {
    title: "Loan Programs",
    subtitle: "Explore mortgage solutions designed for a range of buyer profiles and lending needs.",
    items: [
      { title: "Conventional Loans", text: "Flexible options for qualified buyers.", href: "/loan-options/conventional" },
      { title: "FHA Loans", text: "Accessible financing with flexible requirements.", href: "/loan-options/fha" },
      { title: "VA Loans", text: "Loan options for eligible veterans and service members.", href: "/loan-options/va" },
      { title: "Jumbo Loans", text: "Financing for higher-value homes.", href: "/loan-options/jumbo" },
      { title: "USDA Loans", text: "0% down options in qualifying areas.", href: "/loan-options/usda" },
      { title: "First-Time Buyers", text: "Guidance and planning for your first purchase.", href: "/loan-options/first-time-home-buyer" },
      { title: "Investment Properties", text: "Financing options for rentals and second homes.", href: "/loan-options/investment-property" },
      { title: "Refinance", text: "Explore rate/term or cash-out refinance paths.", href: "/loan-options/refinance" }
    ]
  },

  process: {
    title: "Our Process",
    subtitle: "A clear, structured workflow designed to keep communication consistent and expectations simple.",
    steps: [
      {
        title: "Pre-Qualification & Planning",
        text: "Clarify your goals, options, and budget before moving forward."
      },
      {
        title: "Application & Underwriting Coordination",
        text: "Guided documentation and transparent updates throughout review."
      },
      {
        title: "Closing Support",
        text: "Coordination with title and all parties to reach the closing table smoothly."
      }
    ]
  },

  team: {
    title: "Meet the Team",
    subtitle: "Experienced mortgage professionals dedicated to your success.",
    image: {
      src: "/images/team-office.jpg",
      alt: "Model Mortgage team office meeting room"
    }
  },

  reviews: {
    title: "What Clients Say",
    subtitle: "Trusted by Houston buyers who value clarity and professionalism."
  },

  transactions: {
    title: "Recent Transactions",
    items: [
      { area: "Houston", type: "Purchase", program: "Conventional" },
      { area: "West University", type: "Refinance", program: "Conventional" },
      { area: "Memorial", type: "Purchase", program: "Jumbo" },
      { area: "River Oaks", type: "Purchase", program: "VA" },
      { area: "Katy", type: "Refinance", program: "FHA" }
    ]
  },

  resources: {
    title: "Resources & Guides",
    items: [
      {
        title: "First-Time Homebuyer Guide",
        excerpt: "Everything you need to know before your first mortgage application.",
        href: "/blog/first-time-buyer"
      },
      {
        title: "Mortgage Rates Explained",
        excerpt: "Understanding APR, points, and how rates impact your payment.",
        href: "/blog/rates-explained"
      },
      {
        title: "Investment Property Financing",
        excerpt: "How to structure loans for rental properties and portfolio growth.",
        href: "/blog/investment-property"
      }
    ]
  },

  localAreas: {
    title: "Serving Greater Houston",
    intro: "Proudly serving Houston and surrounding areas with personalized mortgage guidance."
  },

  finalCta: {
    headline: "Begin the Conversation",
    subheadline: "Request a private consultation with our Houston mortgage team."
  }
} as const;
