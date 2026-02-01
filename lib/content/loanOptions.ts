import { LoanOption, PageMetadata } from '@/lib/types/content'

export interface LoanOptionsHubContent {
  metadata: PageMetadata
  hero: {
    title: string
    subtitle: string
  }
  intro: string
  loanOptions: LoanOption[]
}

export const loanOptions: LoanOption[] = [
  {
    id: 'fixed-rate-mortgage',
    slug: 'fixed-rate-mortgage',
    title: 'Fixed Rate Mortgage',
    shortDescription: 'Predictable payments with a locked interest rate for the life of your loan',
    fullDescription: `A fixed-rate mortgage is the most popular type of home loan, offering stability and predictability throughout the entire loan term. With a fixed-rate mortgage, your interest rate remains constant from the day you close until the day you pay off your loan, whether that's 15, 20, or 30 years. This means your principal and interest payment stays the same every month, making it easier to budget and plan for the future.

Fixed-rate mortgages are ideal for borrowers who value stability and plan to stay in their home for an extended period. They protect you from rising interest rates and provide peace of mind knowing exactly what your payment will be year after year.`,
    benefits: [
      'Consistent monthly payments that never change',
      'Protection from rising interest rates',
      'Easier budgeting and financial planning',
      'Build equity at a predictable rate',
      'Available in various term lengths (15, 20, 30 years)',
      'No surprises or payment adjustments'
    ],
    requirements: [
      'Credit score typically 620 or higher',
      'Down payment of 3% to 20% (depending on loan type)',
      'Debt-to-income ratio generally below 43%',
      'Stable employment and income history',
      'Sufficient cash reserves for closing costs',
      'Property appraisal meeting loan requirements'
    ],
    idealFor: [
      'First-time homebuyers seeking stability',
      'Buyers planning to stay in their home long-term',
      'Those who want predictable monthly payments',
      'Borrowers concerned about rising interest rates',
      'Anyone who values financial certainty'
    ],
    icon: 'home',
    relatedCalculators: ['purchase', 'affordability', 'refinance'],
    metadata: {
      title: 'Fixed Rate Mortgage | Stable Home Loans - Model Mortgage',
      description: 'Learn about fixed-rate mortgages with predictable payments and locked interest rates. Get expert guidance on 15, 20, and 30-year fixed-rate home loans.',
      keywords: [
        'fixed rate mortgage',
        'fixed rate home loan',
        '30 year fixed mortgage',
        '15 year fixed mortgage',
        'stable mortgage rates',
        'predictable mortgage payments'
      ],
      ogImage: '/images/loan-options/fixed-rate-mortgage-og.jpg',
      canonical: '/loan-options/fixed-rate-mortgage'
    }
  },
  {
    id: 'fha-home-loan',
    slug: 'fha-home-loan',
    title: 'FHA Home Loan',
    shortDescription: 'Government-backed loans with low down payments and flexible credit requirements',
    fullDescription: `FHA loans are mortgages insured by the Federal Housing Administration, designed to help make homeownership more accessible, especially for first-time buyers and those with less-than-perfect credit. These loans require as little as 3.5% down and have more lenient credit score requirements compared to conventional loans.

FHA loans are particularly attractive for borrowers who may not have a large down payment saved or who have credit scores in the fair range. The government insurance protects lenders, allowing them to offer more favorable terms to borrowers who might not otherwise qualify for conventional financing.`,
    benefits: [
      'Down payment as low as 3.5%',
      'Credit scores as low as 580 accepted',
      'Seller can contribute up to 6% toward closing costs',
      'Gift funds allowed for down payment',
      'More lenient debt-to-income ratios',
      'Assumable loans (can be transferred to new buyer)',
      'Streamline refinance options available'
    ],
    requirements: [
      'Credit score of 580 or higher for 3.5% down',
      'Credit score of 500-579 requires 10% down',
      'Debt-to-income ratio typically below 43%',
      'Property must be primary residence',
      'FHA mortgage insurance required (upfront and monthly)',
      'Property must meet FHA appraisal standards',
      'Steady employment history (typically 2 years)'
    ],
    idealFor: [
      'First-time homebuyers',
      'Borrowers with limited savings for down payment',
      'Those with credit scores in the 580-680 range',
      'Buyers who need flexible qualification requirements',
      'Anyone seeking government-backed loan security'
    ],
    icon: 'shield',
    relatedCalculators: ['purchase', 'affordability'],
    metadata: {
      title: 'FHA Home Loan | Low Down Payment Mortgages - Model Mortgage',
      description: 'FHA loans offer low down payments (3.5%) and flexible credit requirements. Perfect for first-time buyers and those with limited savings.',
      keywords: [
        'FHA loan',
        'FHA mortgage',
        'low down payment loan',
        'first time buyer loan',
        'FHA home loan requirements',
        '3.5% down payment'
      ],
      ogImage: '/images/loan-options/fha-home-loan-og.jpg',
      canonical: '/loan-options/fha-home-loan'
    }
  },
  {
    id: 'va-home-loan',
    slug: 'va-home-loan',
    title: 'VA Home Loan',
    shortDescription: 'Zero down payment loans for eligible veterans, active military, and surviving spouses',
    fullDescription: `VA loans are a powerful benefit available to veterans, active-duty service members, and eligible surviving spouses. Backed by the Department of Veterans Affairs, these loans offer incredible advantages including no down payment requirement, no private mortgage insurance, and competitive interest rates.

VA loans recognize the service and sacrifice of our military members by making homeownership more accessible and affordable. With no down payment required and no ongoing mortgage insurance premiums, VA loans can save borrowers tens of thousands of dollars compared to other loan types.`,
    benefits: [
      'No down payment required (0% down)',
      'No private mortgage insurance (PMI)',
      'Competitive interest rates',
      'No prepayment penalties',
      'Seller can pay all closing costs',
      'More lenient credit requirements',
      'VA funding fee can be financed into loan',
      'Assumable by qualified buyers',
      'Streamline refinance options (IRRRL)'
    ],
    requirements: [
      'Certificate of Eligibility (COE) from VA',
      'Satisfactory credit (typically 620+ score)',
      'Sufficient income to cover mortgage payments',
      'Property must be primary residence',
      'Property must meet VA minimum property requirements',
      'VA funding fee applies (waived for disabled veterans)',
      'Debt-to-income ratio typically below 41%'
    ],
    idealFor: [
      'Veterans and active-duty military members',
      'Eligible surviving spouses',
      'Buyers with limited savings for down payment',
      'Those seeking to avoid mortgage insurance',
      'Military families relocating frequently'
    ],
    icon: 'flag',
    relatedCalculators: ['va-purchase', 'va-refinance', 'affordability'],
    metadata: {
      title: 'VA Home Loan | Zero Down Payment for Veterans - Model Mortgage',
      description: 'VA loans offer 0% down payment, no PMI, and competitive rates for veterans and active military. Learn about VA loan benefits and requirements.',
      keywords: [
        'VA loan',
        'VA home loan',
        'veterans mortgage',
        'zero down payment',
        'military home loan',
        'VA loan benefits',
        'no PMI loan'
      ],
      ogImage: '/images/loan-options/va-home-loan-og.jpg',
      canonical: '/loan-options/va-home-loan'
    }
  },
  {
    id: 'usda-loan',
    slug: 'usda-loan',
    title: 'USDA Loan',
    shortDescription: 'Zero down payment loans for rural and suburban homebuyers',
    fullDescription: `USDA loans are government-backed mortgages designed to promote homeownership in rural and suburban areas. Offered through the United States Department of Agriculture, these loans require no down payment and feature competitive interest rates, making them an excellent option for eligible buyers in qualifying locations.

Despite the "rural" designation, many suburban areas qualify for USDA financing. These loans are income-restricted and designed to help low-to-moderate income families achieve homeownership in less densely populated areas.`,
    benefits: [
      'No down payment required (100% financing)',
      'Competitive interest rates',
      'Lower mortgage insurance costs than FHA',
      'Flexible credit guidelines',
      'Seller can pay closing costs',
      'Gift funds allowed for closing costs',
      '30-year fixed-rate terms available'
    ],
    requirements: [
      'Property must be in USDA-eligible rural area',
      'Income limits apply (typically 115% of area median income)',
      'Credit score typically 640 or higher',
      'Property must be primary residence',
      'Debt-to-income ratio generally below 41%',
      'USDA guarantee fee and annual fee required',
      'U.S. citizenship or permanent residency required'
    ],
    idealFor: [
      'Buyers in rural and suburban areas',
      'Low-to-moderate income families',
      'Those with limited savings for down payment',
      'First-time homebuyers in qualifying areas',
      'Families seeking affordable homeownership'
    ],
    icon: 'tree',
    relatedCalculators: ['purchase', 'affordability'],
    metadata: {
      title: 'USDA Loan | Zero Down Rural Home Financing - Model Mortgage',
      description: 'USDA loans offer 0% down payment for rural and suburban homebuyers. Check eligibility and learn about USDA loan benefits and requirements.',
      keywords: [
        'USDA loan',
        'USDA mortgage',
        'rural home loan',
        'zero down payment',
        'USDA eligible areas',
        'rural development loan'
      ],
      ogImage: '/images/loan-options/usda-loan-og.jpg',
      canonical: '/loan-options/usda-loan'
    }
  },
  {
    id: 'jumbo-home-loan',
    slug: 'jumbo-home-loan',
    title: 'Jumbo Home Loan',
    shortDescription: 'Financing for luxury homes exceeding conventional loan limits',
    fullDescription: `Jumbo loans are mortgages that exceed the conforming loan limits set by the Federal Housing Finance Agency (FHFA). These loans are designed for buyers purchasing high-value properties in expensive real estate markets or luxury homes that require larger loan amounts.

Because jumbo loans aren't backed by Fannie Mae or Freddie Mac, they typically have stricter qualification requirements. However, they offer the financing power needed to purchase premium properties while still providing competitive rates for well-qualified borrowers.`,
    benefits: [
      'Finance luxury and high-value properties',
      'Competitive rates for qualified borrowers',
      'Flexible loan amounts above conforming limits',
      'Various term options (15, 20, 30 years)',
      'Can be used for primary, secondary, or investment properties',
      'Interest may be tax-deductible (consult tax advisor)'
    ],
    requirements: [
      'Loan amount exceeds conforming limits ($766,550 in most areas for 2024)',
      'Credit score typically 700 or higher',
      'Down payment usually 10-20% or more',
      'Debt-to-income ratio typically below 43%',
      'Substantial cash reserves (6-12 months)',
      'Extensive documentation of income and assets',
      'Property appraisal required',
      'Strong employment and income history'
    ],
    idealFor: [
      'Buyers purchasing luxury or high-value homes',
      'Those in expensive real estate markets',
      'High-income borrowers with excellent credit',
      'Buyers needing loans above conforming limits',
      'Investors purchasing premium properties'
    ],
    icon: 'building',
    relatedCalculators: ['purchase', 'affordability', 'refinance'],
    metadata: {
      title: 'Jumbo Home Loan | Luxury Property Financing - Model Mortgage',
      description: 'Jumbo loans for high-value properties exceeding conforming loan limits. Competitive rates for qualified borrowers purchasing luxury homes.',
      keywords: [
        'jumbo loan',
        'jumbo mortgage',
        'luxury home loan',
        'high value property financing',
        'jumbo loan limits',
        'jumbo mortgage rates'
      ],
      ogImage: '/images/loan-options/jumbo-home-loan-og.jpg',
      canonical: '/loan-options/jumbo-home-loan'
    }
  },
  {
    id: 'first-time-home-buyer',
    slug: 'first-time-home-buyer',
    title: 'First Time Home Buyer Programs',
    shortDescription: 'Special programs and assistance for first-time homebuyers',
    fullDescription: `First-time homebuyer programs are designed to make the dream of homeownership more accessible for those purchasing their first home. These programs often combine lower down payment requirements, reduced interest rates, down payment assistance, and educational resources to help new buyers navigate the home buying process.

Whether through FHA loans, conventional 97% LTV programs, state and local assistance programs, or special grants, first-time buyers have numerous options to reduce upfront costs and qualify for favorable loan terms. Many programs also provide homebuyer education courses to ensure buyers are prepared for the responsibilities of homeownership.`,
    benefits: [
      'Down payment as low as 3% or less',
      'Down payment assistance programs available',
      'Reduced mortgage insurance options',
      'Homebuyer education and counseling',
      'Potential tax credits and deductions',
      'Flexible credit requirements',
      'Gift funds accepted for down payment',
      'Seller concessions allowed'
    ],
    requirements: [
      'Must be first-time buyer (or not owned home in 3 years)',
      'Credit score typically 580-620 or higher',
      'Completion of homebuyer education course (some programs)',
      'Income limits may apply (varies by program)',
      'Property must be primary residence',
      'Debt-to-income ratio requirements vary by program',
      'Meet specific program eligibility criteria'
    ],
    idealFor: [
      'First-time homebuyers',
      'Those with limited savings for down payment',
      'Buyers seeking educational resources',
      'Those who qualify for assistance programs',
      'Anyone purchasing their first home'
    ],
    icon: 'key',
    relatedCalculators: ['affordability', 'purchase'],
    metadata: {
      title: 'First Time Home Buyer Programs | Low Down Payment Options - Model Mortgage',
      description: 'Discover first-time homebuyer programs with low down payments, assistance programs, and educational resources to help you purchase your first home.',
      keywords: [
        'first time home buyer',
        'first time buyer programs',
        'down payment assistance',
        'homebuyer education',
        'first home loan',
        'low down payment'
      ],
      ogImage: '/images/loan-options/first-time-home-buyer-og.jpg',
      canonical: '/loan-options/first-time-home-buyer'
    }
  },
  {
    id: 'low-down-payment-purchase-options',
    slug: 'low-down-payment-purchase-options',
    title: 'Low Down Payment Purchase Options',
    shortDescription: 'Flexible financing with minimal down payment requirements',
    fullDescription: `Low down payment mortgage options make homeownership accessible to buyers who haven't saved a traditional 20% down payment. These programs include conventional loans with as little as 3% down, FHA loans at 3.5% down, and even zero-down options like VA and USDA loans for eligible borrowers.

While a smaller down payment means you can purchase a home sooner, it's important to understand the trade-offs, including mortgage insurance requirements and potentially higher monthly payments. However, for many buyers, the ability to enter the housing market sooner and start building equity outweighs these considerations.`,
    benefits: [
      'Purchase a home with minimal upfront cash',
      'Start building equity sooner',
      'Keep savings for emergencies and home improvements',
      'Multiple program options available',
      'Competitive interest rates',
      'Potential for mortgage insurance removal later',
      'Gift funds often accepted'
    ],
    requirements: [
      'Credit score requirements vary by program (580-620+)',
      'Down payment as low as 0-3.5% depending on program',
      'Mortgage insurance typically required',
      'Debt-to-income ratio requirements vary',
      'Property must meet program standards',
      'Sufficient income to cover payments',
      'Cash reserves may be required'
    ],
    idealFor: [
      'Buyers with limited savings',
      'First-time homebuyers',
      'Those who want to preserve cash reserves',
      'Buyers in competitive markets who need to act quickly',
      'Anyone seeking to enter homeownership sooner'
    ],
    icon: 'percent',
    relatedCalculators: ['affordability', 'purchase'],
    metadata: {
      title: 'Low Down Payment Mortgage Options | 3% Down Loans - Model Mortgage',
      description: 'Explore low down payment mortgage options from 0-3.5% down. Learn about FHA, conventional, VA, and USDA low down payment programs.',
      keywords: [
        'low down payment mortgage',
        '3% down payment',
        'minimal down payment',
        'low down payment options',
        'small down payment loan'
      ],
      ogImage: '/images/loan-options/low-down-payment-og.jpg',
      canonical: '/loan-options/low-down-payment-purchase-options'
    }
  },
  {
    id: 'investment-property-loans',
    slug: 'investment-property-loans',
    title: 'Investment Property Loans',
    shortDescription: 'Financing solutions for rental properties and real estate investments',
    fullDescription: `Investment property loans are specifically designed for purchasing rental properties, vacation homes, or properties intended to generate income. These loans recognize the unique nature of investment real estate and provide financing options for both experienced investors and those just starting to build their real estate portfolio.

Investment property loans typically require larger down payments and have stricter qualification requirements than primary residence loans, as lenders consider them higher risk. However, rental income from the property can often be used to help qualify for the loan, making it possible to leverage real estate for wealth building.`,
    benefits: [
      'Build wealth through real estate',
      'Generate passive rental income',
      'Potential tax benefits and deductions',
      'Rental income can help qualify for loan',
      'Portfolio diversification',
      'Appreciation potential',
      'Multiple property financing available',
      'DSCR loans available (no income verification)'
    ],
    requirements: [
      'Down payment typically 15-25%',
      'Credit score usually 620-680 or higher',
      'Cash reserves for 6-12 months of payments',
      'Debt-to-income ratio requirements (or DSCR ratio)',
      'Property appraisal and rent schedule',
      'Investment property experience may be required',
      'Higher interest rates than primary residence loans',
      'Rental income documentation or projections'
    ],
    idealFor: [
      'Real estate investors',
      'Those seeking passive income',
      'Buyers purchasing rental properties',
      'Investors building property portfolios',
      'Those seeking wealth through real estate'
    ],
    icon: 'chart',
    relatedCalculators: ['dscr', 'purchase', 'rent-vs-buy'],
    metadata: {
      title: 'Investment Property Loans | Rental Property Financing - Model Mortgage',
      description: 'Finance rental properties and real estate investments with specialized investment property loans. Learn about DSCR loans and portfolio financing.',
      keywords: [
        'investment property loan',
        'rental property financing',
        'DSCR loan',
        'real estate investment loan',
        'rental property mortgage',
        'investment property mortgage'
      ],
      ogImage: '/images/loan-options/investment-property-og.jpg',
      canonical: '/loan-options/investment-property-loans'
    }
  },
  {
    id: 'refinance',
    slug: 'refinance',
    title: 'Refinance',
    shortDescription: 'Lower your rate, reduce your payment, or change your loan terms',
    fullDescription: `Refinancing your mortgage means replacing your current home loan with a new one, typically to take advantage of better terms. Whether you want to lower your interest rate, reduce your monthly payment, shorten your loan term, or switch from an adjustable-rate to a fixed-rate mortgage, refinancing can help you achieve your financial goals.

The decision to refinance depends on several factors including current interest rates, how long you plan to stay in your home, closing costs, and your financial objectives. A rate-and-term refinance focuses on improving your loan terms, while a cash-out refinance allows you to tap into your home's equity for other purposes.`,
    benefits: [
      'Lower your interest rate and monthly payment',
      'Shorten your loan term to build equity faster',
      'Switch from adjustable to fixed-rate mortgage',
      'Remove private mortgage insurance (PMI)',
      'Consolidate debt (with cash-out refinance)',
      'Access home equity for improvements or expenses',
      'Potentially save thousands over the life of the loan'
    ],
    requirements: [
      'Sufficient home equity (typically 20% or more)',
      'Credit score typically 620 or higher',
      'Debt-to-income ratio generally below 43%',
      'Stable income and employment',
      'Property appraisal required',
      'Closing costs (typically 2-5% of loan amount)',
      'Break-even analysis should favor refinancing'
    ],
    idealFor: [
      'Homeowners with higher interest rates',
      'Those seeking lower monthly payments',
      'Borrowers wanting to shorten loan term',
      'Homeowners with adjustable-rate mortgages',
      'Those looking to remove PMI',
      'Anyone seeking better loan terms'
    ],
    icon: 'refresh',
    relatedCalculators: ['refinance', 'purchase'],
    metadata: {
      title: 'Mortgage Refinance | Lower Your Rate & Payment - Model Mortgage',
      description: 'Refinance your mortgage to lower your rate, reduce payments, or change loan terms. Calculate potential savings with our refinance calculator.',
      keywords: [
        'mortgage refinance',
        'refinance mortgage',
        'lower mortgage rate',
        'refinance calculator',
        'home loan refinance',
        'rate and term refinance'
      ],
      ogImage: '/images/loan-options/refinance-og.jpg',
      canonical: '/loan-options/refinance'
    }
  },
  {
    id: 'cash-out-refinance',
    slug: 'cash-out-refinance',
    title: 'Cash Out Refinance',
    shortDescription: 'Access your home equity while refinancing your mortgage',
    fullDescription: `A cash-out refinance allows you to refinance your existing mortgage for more than you currently owe and receive the difference in cash. This powerful financial tool lets you tap into your home's equity to fund home improvements, consolidate high-interest debt, pay for education, or cover other major expenses.

With a cash-out refinance, you're replacing your current mortgage with a new, larger loan. The difference between your old loan balance and the new loan amount is paid to you in cash at closing. This can be an attractive option when you have significant equity in your home and need access to funds at mortgage interest rates, which are typically much lower than credit cards or personal loans.`,
    benefits: [
      'Access home equity at mortgage interest rates',
      'Consolidate high-interest debt',
      'Fund home improvements that add value',
      'Pay for education or major expenses',
      'Potentially tax-deductible interest (consult tax advisor)',
      'Single monthly payment instead of multiple debts',
      'May improve credit score by reducing credit utilization'
    ],
    requirements: [
      'Minimum 20% equity remaining after cash-out',
      'Credit score typically 620 or higher',
      'Debt-to-income ratio generally below 43%',
      'Stable income and employment history',
      'Property appraisal required',
      'Closing costs apply (can sometimes be financed)',
      'Maximum cash-out typically 80% of home value'
    ],
    idealFor: [
      'Homeowners with significant equity',
      'Those consolidating high-interest debt',
      'Homeowners funding major renovations',
      'Borrowers needing funds for large expenses',
      'Those seeking lower interest rates than other credit'
    ],
    icon: 'dollar',
    relatedCalculators: ['refinance', 'purchase'],
    metadata: {
      title: 'Cash Out Refinance | Access Your Home Equity - Model Mortgage',
      description: 'Cash-out refinance lets you access home equity for debt consolidation, home improvements, or major expenses. Learn about requirements and benefits.',
      keywords: [
        'cash out refinance',
        'cash-out refinance',
        'home equity cash out',
        'refinance for cash',
        'tap home equity',
        'debt consolidation refinance'
      ],
      ogImage: '/images/loan-options/cash-out-refinance-og.jpg',
      canonical: '/loan-options/cash-out-refinance'
    }
  },
  {
    id: 'va-loan-refinance-options',
    slug: 'va-loan-refinance-options',
    title: 'VA Loan Refinance Options',
    shortDescription: 'Specialized refinance programs for veterans and military members',
    fullDescription: `VA refinance options provide veterans and active-duty military members with specialized programs to refinance their existing mortgages. The VA offers two main refinance programs: the Interest Rate Reduction Refinance Loan (IRRRL), also known as a VA Streamline Refinance, and the VA Cash-Out Refinance.

The IRRRL is designed to help veterans lower their interest rate with minimal documentation and no appraisal required in most cases. The VA Cash-Out Refinance allows veterans to tap into their home equity while taking advantage of VA loan benefits like no mortgage insurance. Both programs offer significant advantages over conventional refinancing options.`,
    benefits: [
      'IRRRL requires minimal documentation',
      'No appraisal required for IRRRL (in most cases)',
      'No mortgage insurance on either program',
      'Competitive interest rates',
      'VA funding fee can be financed',
      'Funding fee reduced for IRRRL',
      'Cash-out option available up to 100% LTV',
      'No prepayment penalties'
    ],
    requirements: [
      'Certificate of Eligibility (COE) required',
      'Current loan must be VA loan (for IRRRL)',
      'Must have made at least 6 payments on current loan',
      'Credit score typically 620 or higher',
      'Property must be primary residence',
      'VA funding fee applies (lower for IRRRL)',
      'Occupancy certification required',
      'Net tangible benefit required for IRRRL'
    ],
    idealFor: [
      'Veterans with existing VA loans',
      'Active-duty military members',
      'Those seeking to lower their rate (IRRRL)',
      'Veterans needing to access home equity',
      'Military families wanting to avoid mortgage insurance'
    ],
    icon: 'star',
    relatedCalculators: ['va-refinance', 'refinance'],
    metadata: {
      title: 'VA Refinance Options | IRRRL & Cash-Out for Veterans - Model Mortgage',
      description: 'VA refinance programs including IRRRL streamline refinance and VA cash-out refinance. Lower rates and access equity with no mortgage insurance.',
      keywords: [
        'VA refinance',
        'IRRRL',
        'VA streamline refinance',
        'VA cash out refinance',
        'veterans refinance',
        'VA loan refinance options'
      ],
      ogImage: '/images/loan-options/va-refinance-og.jpg',
      canonical: '/loan-options/va-loan-refinance-options'
    }
  }
]

// Hub page content
export const loanOptionsHubContent: LoanOptionsHubContent = {
  metadata: {
    title: 'Loan Options | Mortgage Programs & Home Financing - Model Mortgage',
    description: 'Explore mortgage loan options including FHA, VA, USDA, conventional, jumbo, and investment property loans. Find the right home financing solution for you.',
    keywords: [
      'mortgage loan options',
      'home loan programs',
      'mortgage types',
      'FHA VA USDA loans',
      'home financing options',
      'mortgage programs'
    ],
    ogImage: '/images/loan-options-hub-og.jpg',
    canonical: '/loan-options'
  },
  hero: {
    title: 'Explore Your Loan Options',
    subtitle: 'Find the perfect mortgage solution for your unique situation'
  },
  intro: `At Model Mortgage, we understand that every homebuyer's situation is unique. That's why we offer a comprehensive range of loan options designed to meet diverse needs and financial circumstances. Whether you're a first-time buyer, a veteran, purchasing a luxury home, or investing in real estate, we have financing solutions tailored to your goals.`,
  loanOptions
}
