export const brand = {
  name: 'Saanjh',
  wordmark: 'SAANJH',
  descriptor: 'Matrimony',
  tagline: 'Where hearts find their home.',
  email: 'hello@saanjh.example',
  supportEmail: 'support@saanjh.example',
  phone: '+91 90000 00000',
  location: 'Mumbai, India',
}

export const trustStats = [
  { value: '24', label: 'sample profiles', note: 'Curated demo profiles' },
  { value: '12', label: 'compatibility signals', note: 'Transparent scoring' },
  { value: '3', label: 'membership tiers', note: 'Configurable plans' },
  { value: '100%', label: 'demo data', note: 'No real members' },
]

export const howItWorks = [
  {
    id: '01',
    icon: 'UserRound',
    title: 'Create your profile',
    description:
      'Share what matters to you — your story, your values and the kind of partnership you hope to build.',
    action: 'Build a profile',
    to: '/create-profile',
  },
  {
    id: '02',
    icon: 'Sparkles',
    title: 'Discover considered matches',
    description:
      'Use transparent compatibility signals, thoughtful preferences and human-friendly filters to shortlist people worth getting to know.',
    action: 'See matches',
    to: '/matches',
  },
  {
    id: '03',
    icon: 'MessagesSquare',
    title: 'Connect with intention',
    description:
      'Express interest, accept a connection, and begin a calm conversation when you are both ready.',
    action: 'How messaging works',
    to: '/help',
  },
]

export const whyChoose = [
  {
    icon: 'ShieldCheck',
    title: 'Privacy-aware by design',
    description:
      'You decide which details to show. Contact information is never exposed on public profiles in this demo.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Compatibility, explained',
    description:
      'See exactly which signals contribute to a sample score. No black boxes, no promises of a perfect match.',
  },
  {
    icon: 'Feather',
    title: 'Calm, not cluttered',
    description:
      'A considered interface and respectful messaging rules make space for better conversations.',
  },
  {
    icon: 'SlidersHorizontal',
    title: 'Preferences that flex',
    description:
      'Separate non-negotiables from nice-to-haves, so your search stays focused but never rigid.',
  },
]

export const testimonials = [
  {
    id: 't1',
    quote:
      'The compatibility breakdown made our first conversation so much easier. We started with the things we already had in common.',
    name: 'Meera & Rohan',
    detail: 'Sample story · Mumbai',
    note: 'Demo testimonial',
  },
  {
    id: 't2',
    quote:
      'I liked that the platform felt calm. Nothing was shouting for attention, and I could take my time with each profile.',
    name: 'Naina',
    detail: 'Sample story · Bengaluru',
    note: 'Demo testimonial',
  },
  {
    id: 't3',
    quote:
      'The interest flow felt respectful. Once we both said yes, messaging was simple and felt like a natural next step.',
    name: 'Arjun & Saanvi',
    detail: 'Sample story · Hyderabad',
    note: 'Demo testimonial',
  },
]

export const faqs = [
  {
    question: 'Is this a real matrimonial service?',
    answer:
      'No. Saanjh is a front-end demonstration built with React. Every profile, message, testimonial, statistic and payment is simulated. Nothing is sent to a real person and no payment is processed.',
  },
  {
    question: 'How is the compatibility score calculated?',
    answer:
      'The score is a transparent sample calculation based on your partner preferences: age, location, community, education, languages, shared interests, lifestyle and profession. It is not a scientific prediction and should never replace your own judgement.',
  },
  {
    question: 'Can I message anyone?',
    answer:
      'In this demo, messaging is limited to accepted interests or existing sample conversations. Premium members can also respond to profiles that have already expressed interest — a simulated eligibility rule.',
  },
  {
    question: 'What happens to my data?',
    answer:
      'Non-sensitive demo details are stored only in your browser’s localStorage so the experience survives a refresh. Passwords, payment credentials and authentication tokens are never stored.',
  },
  {
    question: 'How do I reset the demo?',
    answer:
      'Sign in with the demo admin account and use Settings → Reset demo data. This clears all Saanjh demo data from localStorage and returns the app to its starting state.',
  },
  {
    question: 'Can this be connected to a real backend?',
    answer:
      'Yes. The mock data, contexts and eligibility rules are deliberately separated from the UI. A production build would add a secure backend, verified identities, a payment provider and real consent management.',
  },
]

export const footerLinks = {
  company: [
    { label: 'About Saanjh', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'How it works', to: '/help' },
    { label: 'Membership', to: '/plans' },
  ],
  support: [
    { label: 'Help centre', to: '/help' },
    { label: 'Privacy policy', to: '/privacy' },
    { label: 'Terms of use', to: '/terms' },
    { label: 'Safety tips', to: '/help#safety' },
  ],
  explore: [
    { label: 'Discover matches', to: '/matches' },
    { label: 'Search profiles', to: '/search' },
    { label: 'Member sign in', to: '/login' },
    { label: 'Join Saanjh', to: '/register' },
  ],
}

export const infoPages = {
  about: {
    title: 'A calmer way to meet someone',
    eyebrow: 'About',
    intro:
      'Saanjh is a design-led matrimonial demo that treats finding a partner with the care and intention it deserves.',
    sections: [
      {
        heading: 'Why we built this demo',
        body: 'The matrimonial category is full of noise: endless cards, urgent notifications and numbers with very little meaning. Saanjh explores a different rhythm — premium, warm, transparent and unhurried. This build exists to demonstrate the complete front-end experience for a client presentation.',
      },
      {
        heading: 'What makes it different',
        body: 'Instead of hiding how matches are suggested, we explain the signals. Instead of inviting messages from anyone, we use mutual interest. Instead of exposing personal details, we let members decide what is visible. Every label that says demo is there for a reason.',
      },
      {
        heading: 'The honest fine print',
        body: 'Saanjh is not a live matchmaking service. There are no real members, no background checks and no secure production backend. All profiles and content are fictional sample data designed to exercise the interface.',
      },
    ],
  },
  contact: {
    title: 'We would love to hear from you',
    eyebrow: 'Contact',
    intro:
      'Questions about the demo, the design system or a potential production build? Send a note. This form is simulated.',
    sections: [
      {
        heading: 'Demo support',
        body: 'For the purposes of this demo, messages submitted here are not delivered anywhere. They show the intended interaction and validation states.',
      },
    ],
  },
  privacy: {
    title: 'Privacy, in plain language',
    eyebrow: 'Privacy policy',
    intro:
      'A short, honest explanation of what this demo stores and what it deliberately does not.',
    sections: [
      {
        heading: 'What is stored',
        body: 'Non-sensitive demo data — a display name, email, profile details, preferences, shortlists, interests, sample conversations, notifications, theme choice and the selected demo plan — may be saved in your browser’s localStorage so the experience survives a refresh.',
      },
      {
        heading: 'What is never stored',
        body: 'Passwords, payment credentials, private authentication tokens and sensitive identity documents are never stored. The sign-in flow is a simulation and no real authentication takes place.',
      },
      {
        heading: 'Your control',
        body: 'You can clear demo data at any time from the admin settings, or by clearing your browser storage for this site. No data is sent to a server in this demo.',
      },
    ],
  },
  terms: {
    title: 'Terms of use',
    eyebrow: 'Legal',
    intro: 'These terms apply to the Saanjh front-end demonstration.',
    sections: [
      {
        heading: 'Demonstration only',
        body: 'This application is provided as a design and development demo. It does not offer a real matchmaking service, verification, background checks or guaranteed introductions. All profiles, conversations and statistics are fictional.',
      },
      {
        heading: 'No real payments',
        body: 'Membership checkout is simulated. No card details are collected and no money changes hands. A production service would require a payment provider, a secure backend and applicable legal agreements.',
      },
      {
        heading: 'Respectful use',
        body: 'You agree to use the demo for exploration and evaluation only. Do not attempt to use it to contact real people or to represent sample profiles as real individuals.',
      },
    ],
  },
  help: {
    title: 'A little help, whenever you need it',
    eyebrow: 'Help centre',
    intro:
      'Understand the demo flows, eligibility rules and how to get the most from the experience.',
    sections: [
      {
        heading: 'Signing in',
        body: 'Use the one-tap demo member or admin sign-in on the login page. Any valid-looking email and password can also create a simulated session. Credentials are not checked against a real account.',
      },
      {
        heading: 'Matching and preferences',
        body: 'Open Partner preferences to choose the attributes that matter most. Mark an attribute as a must-match to treat it as a strict filter. Save preferences to refresh your match suggestions.',
      },
      {
        heading: 'Messaging rules',
        body: 'A conversation becomes available when an interest is accepted, or when a seeded sample conversation already exists. Premium members can also reply to an incoming interest before accepting it.',
      },
      {
        heading: 'Resetting the demo',
        body: 'Sign in as the demo admin and go to Settings → Demo data. Resetting clears localStorage for this app and reloads the experience. This is the cleanest way to start from scratch.',
      },
    ],
  },
}

export const announcement = {
  text: 'A simulated matrimonial experience — every profile and conversation is sample data.',
  linkLabel: 'See how the demo works',
  to: '/help',
}

export const footerNote =
  'Saanjh is a front-end demonstration. Profiles, stories, statistics and payments are simulated. Not a real matchmaking service.'
