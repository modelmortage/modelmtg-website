import { PageMetadata } from '@/lib/types/content'

export interface PrivacyPolicyContent {
  metadata: PageMetadata
  hero: {
    title: string
    subtitle: string
  }
  lastUpdated: string
  sections: Array<{
    heading: string
    content: string[]
    subsections?: Array<{
      heading: string
      content: string[]
    }>
  }>
}

export const privacyPolicyContent: PrivacyPolicyContent = {
  metadata: {
    title: 'Privacy Policy | Model Mortgage',
    description: 'Learn how Model Mortgage collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
    keywords: [
      'privacy policy',
      'data protection',
      'personal information',
      'Model Mortgage privacy',
      'data security',
      'GLBA compliance'
    ],
    canonical: '/privacy-policy'
  },
  hero: {
    title: 'Privacy Policy',
    subtitle: 'Your privacy is important to us. Learn how we collect, use, and protect your information.'
  },
  lastUpdated: '2024-01-15',
  sections: [
    {
      heading: 'Introduction',
      content: [
        'Model Mortgage ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
        'Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.'
      ]
    },
    {
      heading: 'Information We Collect',
      content: [
        'We may collect information about you in a variety of ways. The information we may collect includes:'
      ],
      subsections: [
        {
          heading: 'Personal Data',
          content: [
            'Personally identifiable information, such as your name, shipping address, email address, telephone number, and demographic information that you voluntarily give to us when you register with the site, apply for a mortgage, or when you choose to participate in various activities related to the site, such as using our mortgage calculators or requesting information.',
            'Financial information such as income, assets, debts, credit history, employment information, and other data necessary to process your mortgage application.'
          ]
        },
        {
          heading: 'Derivative Data',
          content: [
            'Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.'
          ]
        },
        {
          heading: 'Financial Data',
          content: [
            'Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the site. We store only very limited, if any, financial information that we collect.'
          ]
        },
        {
          heading: 'Data from Contests, Giveaways, and Surveys',
          content: [
            'Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.'
          ]
        }
      ]
    },
    {
      heading: 'Use of Your Information',
      content: [
        'Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:'
      ],
      subsections: [
        {
          heading: 'Primary Uses',
          content: [
            'Process your mortgage application and provide mortgage services',
            'Create and manage your account',
            'Email you regarding your account or order',
            'Fulfill and manage purchases, orders, payments, and other transactions related to the site',
            'Generate a personal profile about you to make future visits to the site more personalized',
            'Increase the efficiency and operation of the site',
            'Monitor and analyze usage and trends to improve your experience with the site',
            'Notify you of updates to the site and our services',
            'Offer new products, services, and/or recommendations to you',
            'Perform other business activities as needed',
            'Request feedback and contact you about your use of the site',
            'Resolve disputes and troubleshoot problems',
            'Respond to product and customer service requests',
            'Send you a newsletter',
            'Comply with legal and regulatory requirements'
          ]
        }
      ]
    },
    {
      heading: 'Disclosure of Your Information',
      content: [
        'We may share information we have collected about you in certain situations. Your information may be disclosed as follows:'
      ],
      subsections: [
        {
          heading: 'By Law or to Protect Rights',
          content: [
            'If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.'
          ]
        },
        {
          heading: 'Business Transfers',
          content: [
            'We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.'
          ]
        },
        {
          heading: 'Third-Party Service Providers',
          content: [
            'We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, mortgage underwriting, credit reporting agencies, and marketing assistance.'
          ]
        },
        {
          heading: 'Marketing Communications',
          content: [
            'With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.'
          ]
        },
        {
          heading: 'Interactions with Other Users',
          content: [
            'If you interact with other users of the site, those users may see your name, profile photo, and descriptions of your activity.'
          ]
        },
        {
          heading: 'Online Postings',
          content: [
            'When you post comments, contributions or other content to the site, your posts may be viewed by all users and may be publicly distributed outside the site in perpetuity.'
          ]
        }
      ]
    },
    {
      heading: 'Security of Your Information',
      content: [
        'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.',
        'Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.'
      ]
    },
    {
      heading: 'Policy for Children',
      content: [
        'We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you believe we might have any information from or about a child under 13, please contact us.'
      ]
    },
    {
      heading: 'Controls for Do-Not-Track Features',
      content: [
        'Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.',
        'No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy.'
      ]
    },
    {
      heading: 'Options Regarding Your Information',
      content: [
        'You may at any time review or change the information in your account or terminate your account by:'
      ],
      subsections: [
        {
          heading: 'Account Management',
          content: [
            'Logging into your account settings and updating your account',
            'Contacting us using the contact information provided below',
            'Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.'
          ]
        },
        {
          heading: 'Emails and Communications',
          content: [
            'If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:',
            'Noting your preferences at the time you register your account with the site',
            'Logging into your account settings and updating your preferences',
            'Contacting us using the contact information provided below',
            'If you no longer wish to receive correspondence, emails, or other communications from third parties, you are responsible for contacting the third party directly.'
          ]
        }
      ]
    },
    {
      heading: 'California Privacy Rights',
      content: [
        'California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year.',
        'If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.'
      ]
    },
    {
      heading: 'Gramm-Leach-Bliley Act (GLBA) Compliance',
      content: [
        'As a mortgage broker, Model Mortgage is subject to the privacy provisions of the Gramm-Leach-Bliley Act (GLBA). We are committed to protecting the confidentiality and security of information we collect about you.',
        'We will provide you with a separate GLBA Privacy Notice that describes our privacy practices in detail when you apply for a mortgage or establish a customer relationship with us. This notice will explain:',
        'The types of nonpublic personal information we collect',
        'How we use and share that information',
        'How we protect the security and confidentiality of that information',
        'Your rights under federal privacy law'
      ]
    },
    {
      heading: 'Contact Us',
      content: [
        'If you have questions or comments about this Privacy Policy, please contact us at:',
        'Model Mortgage',
        'Email: info@modelmortgage.com',
        'Phone: (832) 727-4128',
        'Address: Houston, Texas'
      ]
    },
    {
      heading: 'Changes to This Privacy Policy',
      content: [
        'We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
        'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.'
      ]
    }
  ]
}
