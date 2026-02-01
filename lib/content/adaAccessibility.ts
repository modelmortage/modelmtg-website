import { PageMetadata } from '@/lib/types/content'

export interface AdaAccessibilityContent {
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

export const adaAccessibilityContent: AdaAccessibilityContent = {
  metadata: {
    title: 'ADA Accessibility Statement | Model Mortgage',
    description: 'Model Mortgage is committed to digital accessibility for people with disabilities. Learn about our WCAG 2.1 AA compliance and accessibility features.',
    keywords: [
      'ADA compliance',
      'web accessibility',
      'WCAG 2.1',
      'accessibility statement',
      'Model Mortgage accessibility',
      'disability access'
    ],
    canonical: '/ada-accessibility-statement'
  },
  hero: {
    title: 'ADA Accessibility Statement',
    subtitle: 'Our commitment to making our website accessible to everyone'
  },
  lastUpdated: '2024-01-15',
  sections: [
    {
      heading: 'Our Commitment',
      content: [
        'Model Mortgage is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.',
        'We believe that everyone should have equal access to information and services, regardless of their abilities. This commitment extends to our website, which we strive to make accessible to the widest possible audience.'
      ]
    },
    {
      heading: 'Conformance Status',
      content: [
        'The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.',
        'Model Mortgage\'s website is designed to be conformant with WCAG 2.1 Level AA standards. We are committed to maintaining and improving this level of accessibility.'
      ]
    },
    {
      heading: 'Accessibility Features',
      content: [
        'Our website includes the following accessibility features to ensure a positive experience for all users:'
      ],
      subsections: [
        {
          heading: 'Keyboard Navigation',
          content: [
            'All interactive elements on our website can be accessed using a keyboard alone, without requiring a mouse.',
            'We provide visible focus indicators to help keyboard users understand which element currently has focus.',
            'Tab order follows a logical sequence throughout all pages.'
          ]
        },
        {
          heading: 'Screen Reader Compatibility',
          content: [
            'Our website is compatible with popular screen readers including JAWS, NVDA, and VoiceOver.',
            'We use semantic HTML elements and ARIA labels to provide context and meaning to assistive technologies.',
            'All images include descriptive alternative text (alt text) to convey their meaning and purpose.',
            'Form fields are properly labeled and include helpful instructions.'
          ]
        },
        {
          heading: 'Visual Design',
          content: [
            'Text and interactive elements meet WCAG AA color contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text).',
            'Text can be resized up to 200% without loss of content or functionality.',
            'Our responsive design ensures content is accessible on various devices and screen sizes.',
            'We avoid using color as the only means of conveying information.'
          ]
        },
        {
          heading: 'Content Structure',
          content: [
            'Pages use proper heading hierarchy (H1, H2, H3, etc.) to organize content logically.',
            'Links have descriptive text that makes sense out of context.',
            'Tables include proper headers and captions where applicable.',
            'Lists are marked up semantically for easy navigation.'
          ]
        },
        {
          heading: 'Forms and Interactive Elements',
          content: [
            'All form fields have clear, descriptive labels.',
            'Error messages are clearly identified and provide guidance on how to correct issues.',
            'Required fields are clearly marked.',
            'Interactive elements (buttons, links) have sufficient size for easy interaction (minimum 44x44 pixels).'
          ]
        },
        {
          heading: 'Multimedia Content',
          content: [
            'Videos include captions and transcripts where applicable.',
            'Audio content includes transcripts.',
            'We avoid content that flashes more than three times per second to prevent seizures.'
          ]
        }
      ]
    },
    {
      heading: 'Assistive Technologies',
      content: [
        'Our website is designed to work with the following assistive technologies:'
      ],
      subsections: [
        {
          heading: 'Supported Technologies',
          content: [
            'Screen readers (JAWS, NVDA, VoiceOver, TalkBack)',
            'Screen magnification software',
            'Speech recognition software',
            'Alternative input devices',
            'Browser accessibility features and extensions'
          ]
        }
      ]
    },
    {
      heading: 'Known Limitations',
      content: [
        'Despite our best efforts to ensure accessibility, there may be some limitations. Below are known limitations:'
      ],
      subsections: [
        {
          heading: 'Third-Party Content',
          content: [
            'Some third-party content embedded on our website (such as maps, videos, or social media feeds) may not be fully accessible. We are working with our third-party providers to improve accessibility.',
            'PDF documents and downloadable files may not always meet accessibility standards. We are working to remediate these documents and provide accessible alternatives where possible.'
          ]
        },
        {
          heading: 'Legacy Content',
          content: [
            'Some older content on our website may not meet current accessibility standards. We are actively working to update and improve this content.'
          ]
        }
      ]
    },
    {
      heading: 'Ongoing Efforts',
      content: [
        'Accessibility is an ongoing effort, and we are committed to continuous improvement. Our accessibility initiatives include:'
      ],
      subsections: [
        {
          heading: 'Regular Testing',
          content: [
            'We conduct regular accessibility audits using both automated tools and manual testing.',
            'We test our website with various assistive technologies to ensure compatibility.',
            'We involve users with disabilities in our testing process to gain real-world feedback.'
          ]
        },
        {
          heading: 'Training and Awareness',
          content: [
            'Our team receives regular training on accessibility best practices and standards.',
            'We incorporate accessibility considerations into our design and development processes from the start.',
            'We stay informed about evolving accessibility standards and technologies.'
          ]
        },
        {
          heading: 'Continuous Improvement',
          content: [
            'We regularly update our website to address accessibility issues and implement improvements.',
            'We monitor user feedback and prioritize accessibility enhancements based on user needs.',
            'We review and update our accessibility statement to reflect our current practices and commitments.'
          ]
        }
      ]
    },
    {
      heading: 'Feedback and Contact Information',
      content: [
        'We welcome your feedback on the accessibility of Model Mortgage\'s website. If you encounter any accessibility barriers or have suggestions for improvement, please let us know.',
        'Your feedback helps us identify areas for improvement and ensures we can provide the best possible experience for all users.'
      ],
      subsections: [
        {
          heading: 'How to Contact Us',
          content: [
            'Email: info@modelmortgage.com',
            'Phone: (832) 727-4128',
            'Address: Houston, Texas',
            'When contacting us about accessibility, please include:',
            '• The web page or feature you are having difficulty with',
            '• A description of the problem',
            '• The assistive technology you are using (if applicable)',
            '• Your contact information so we can follow up with you'
          ]
        },
        {
          heading: 'Response Time',
          content: [
            'We aim to respond to accessibility feedback within 2 business days. For urgent accessibility issues, please call us directly at (832) 727-4128.',
            'We will work with you to provide the information or service you need in an accessible format.'
          ]
        }
      ]
    },
    {
      heading: 'Alternative Access',
      content: [
        'If you are unable to access any content or use any features on our website due to a disability, we are happy to provide alternative access. Please contact us using the information above, and we will work with you to provide the information or service you need through an alternative communication method that is accessible to you.',
        'Alternative access options may include:',
        'Phone consultation with our mortgage specialists',
        'Email communication',
        'Accessible document formats',
        'In-person meetings (by appointment)'
      ]
    },
    {
      heading: 'Legal Information',
      content: [
        'Model Mortgage is committed to compliance with the Americans with Disabilities Act (ADA) and other applicable federal and state laws regarding accessibility.',
        'This accessibility statement applies to the Model Mortgage website (modelmortgage.com). We do not control the accessibility of third-party websites that may be linked from our site.'
      ]
    },
    {
      heading: 'Technical Specifications',
      content: [
        'Accessibility of Model Mortgage\'s website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:'
      ],
      subsections: [
        {
          heading: 'Technologies',
          content: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'WAI-ARIA (Accessible Rich Internet Applications)',
            'These technologies are relied upon for conformance with the accessibility standards used.'
          ]
        }
      ]
    },
    {
      heading: 'Assessment and Testing',
      content: [
        'Model Mortgage assessed the accessibility of this website using the following methods:'
      ],
      subsections: [
        {
          heading: 'Testing Methods',
          content: [
            'Self-evaluation: We conduct internal accessibility reviews and testing.',
            'Automated testing: We use automated accessibility testing tools to identify potential issues.',
            'Manual testing: We perform manual testing with keyboard navigation and screen readers.',
            'User testing: We gather feedback from users with disabilities to identify real-world accessibility barriers.'
          ]
        }
      ]
    },
    {
      heading: 'Updates to This Statement',
      content: [
        'We are committed to maintaining and improving the accessibility of our website. This accessibility statement will be updated as we make changes and improvements to our website.',
        'This statement was last updated on the date shown at the top of this page. We review and update this statement regularly to ensure it accurately reflects our current accessibility practices and commitments.'
      ]
    }
  ]
}
