/**
 * Site Data - Single Source of Truth
 * All brand info, contact, CTAs, and compliance data
 *
 * NO component hardcodes: NMLS, CTAs, compliance, phone, email, address.
 * Everything comes from here.
 */

export const siteData = {
  // === BRAND IDENTITY ===
  brand: {
    name: "Model Mortgage",
    tagline: "Private Client Mortgage Advisory",
    shortDescription:
      "Houston-based mortgage advisory specializing in structured lending for primary residences, investment properties, and jumbo homes.",
    logo: "/logo-v3.png",

    // Photography registry (paths and settings)
    photography: {
      hero: {
        src: "/images/home/hero-skyline.jpg",
        alt: "Houston skyline at dusk",
        focalPoint: "center",
      },
      team: {
        src: "/images/home/team-headshot.jpg",
        alt: "Matthew Bramow, Founder",
        focalPoint: "center",
      },
      office: {
        src: "/images/home/office-desk.jpg",
        alt: "Model Mortgage office details",
        focalPoint: "center",
      },
    },
  },

  // === CONTACT & LOCATION ===
  contact: {
    phone: "(832) 727-4128",
    email: "info@modelmortgage.com",
    address: {
      street: "1177 West Loop South, Suite 1700",
      city: "Houston",
      state: "TX",
      zip: "77027",
      country: "US",
      fullAddress: "1177 West Loop South, Suite 1700, Houston, TX 77027",
    },
    coordinates: {
      lat: 29.7589,
      lng: -95.4086,
    },
  },

  // === COMPLIANCE & LICENSING ===
  compliance: {
    nmls: "2516810",
    texasLicense: "Texas Mortgage Broker License #2516810",
    nmlsConsumerAccessUrl: "https://www.nmlsconsumeraccess.org",
    equalHousingUrl: "#",
    licenseState: "Texas",
  },

  // === TEAM ===
  team: {
    founder: {
      name: "Matthew Bramow",
      title: "Founder & Mortgage Advisor",
      nmls: "2516810",
      bio: "Committed to providing Houston families and investors with transparent, strategic mortgage advisory. Focused on understanding your long-term financial goals.",
      photoSrc: "/images/home/team-headshot.jpg",
    },
  },

  // === PRIMARY CTAs ===
  cta: {
    preQualify: { label: "Get Pre-Qualified", href: "/pre-qualify", variant: "primary" },
    applyOnline: { label: "Apply Online", href: "https://2516810.my1003app.com/?time=1702581789975", variant: "primary" },
    requestQuote: { label: "Request Quote", href: "/rates", variant: "primary" },
    scheduleCall: { label: "Schedule a Call", href: "/call", variant: "secondary" },
    learnMore: { label: "Learn More", href: "#", variant: "secondary" },
  },

  // === NAVIGATION ===
  navigation: {
    main: [
      { label: "Loan Programs", href: "#programs" },
      { label: "Our Process", href: "#process" },
      { label: "About Us", href: "/about" },
      { label: "Resources", href: "#resources" },
      { label: "Contact", href: "/contact" },
    ],
  },

  // === SOCIAL MEDIA ===
  social: {
    facebook: "https://www.facebook.com/modelmortgage",
    instagram: "https://www.instagram.com/modelmortgage",
    linkedin: "https://www.linkedin.com/company/modelmortgage",
  },

  // === SERVICE AREAS ===
  serviceAreas: {
    primary: [
      "Houston",
      "River Oaks",
      "Memorial",
      "The Heights",
      "West University",
    ],
    secondary: ["Sugar Land", "Katy", "Cypress", "Woodlands"],
    state: ["Texas"],
    allFormatted:
      "Houston, River Oaks, Memorial, The Heights, West University, Sugar Land, and Katy",
  },

  // === LOAN PROGRAMS ===
  loanPrograms: [
    {
      id: "conventional",
      name: "Conventional Loans",
      description:
        "Competitive rates for qualified borrowers on primary residences and investment properties.",
    },
    {
      id: "fha",
      name: "FHA Loans",
      description:
        "Lower down payment options with flexible approval criteria.",
    },
    {
      id: "va",
      name: "VA Loans",
      description:
        "Zero-down financing for eligible veterans and active-duty service members.",
    },
    {
      id: "jumbo",
      name: "Jumbo Loans",
      description:
        "High-balance financing for luxury properties and premium markets.",
    },
    {
      id: "investment",
      name: "Investment Property Loans",
      description:
        "Tailored programs for real estate investors and portfolio growth.",
    },
    {
      id: "dscr",
      name: "DSCR Loans",
      description:
        "Income qualification based on property cash flow, not personal income.",
    },
  ],

  // === RATES ===
  rates: {
    disclaimer:
      "Rates provided are for informational purposes and may not reflect your specific loan terms. Contact us for a personalized rate quote.",
    updateFrequency: "6 hours",
  },

  // === META ===
  meta: {
    siteTitle: "Private Mortgage Advisory | Houston Mortgage Broker | Model Mortgage",
    siteDescription:
      "Houston-based mortgage advisory specializing in structured lending for primary residences, investment properties, and jumbo homes.",
    ogImage: "/logo-v3.png",
  },
} as const

/**
 * Get full address as formatted string
 */
export function getFullAddress(includePhone = false): string {
  const { address, phone } = siteData.contact
  const addr = `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  return includePhone ? `${addr} | ${phone}` : addr
}

/**
 * Get compliance statement
 */
export function getComplianceStatement(): string {
  const { name } = siteData.brand
  const { texasLicense } = siteData.compliance
  return `${name} is licensed in Texas. ${texasLicense}.`
}
