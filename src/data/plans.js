export const billingIntervals = {
  monthly: { id: 'monthly', label: 'Monthly', months: 1, note: 'Billed every month' },
  yearly: { id: 'yearly', label: 'Yearly', months: 12, note: 'Billed once a year' },
}

export const plans = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'A thoughtful first step.',
    description: 'Create your profile, explore a curated set of matches and get a feel for the experience.',
    prices: { monthly: 0, yearly: 0 },
    recommended: false,
    cta: 'Start for free',
    badge: null,
    limits: { dailyProfileViews: 10, interestsPerDay: 3, conversations: 1 },
    highlights: [
      'Create and publish a profile',
      'Browse a limited set of matches',
      'Shortlist up to 10 profiles',
      'Basic partner preferences',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'For a more intentional search.',
    description: 'More visibility, better filters and room to explore connections at your own pace.',
    prices: { monthly: 1299, yearly: 12990 },
    recommended: true,
    cta: 'Choose Plus',
    badge: 'Most popular',
    limits: { dailyProfileViews: 40, interestsPerDay: 10, conversations: 5 },
    highlights: [
      'More daily profile views',
      'Advanced search filters',
      'More interest actions each day',
      'Expanded profile insights',
      'Priority in demo suggestions',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'The full Saanjh experience.',
    description: 'Expanded discovery, deeper insights and enhanced messaging for serious conversations.',
    prices: { monthly: 2499, yearly: 24990 },
    recommended: false,
    cta: 'Choose Premium',
    badge: null,
    limits: { dailyProfileViews: 100, interestsPerDay: 25, conversations: 15 },
    highlights: [
      'Unlimited-style discovery (demo)',
      'All advanced preference filters',
      'Enhanced messaging eligibility',
      'Deeper compatibility insights',
      'Priority profile visibility (simulated)',
    ],
  },
]

export const featureGroups = [
  {
    title: 'Discovery',
    features: [
      { label: 'Profile browsing', free: 'Curated set', plus: 'Expanded', premium: 'Expanded' },
      { label: 'Daily profile views', free: '10', plus: '40', premium: '100' },
      { label: 'Search filters', free: 'Basic', plus: 'Advanced', premium: 'Advanced' },
      { label: 'Compatibility insights', free: 'Summary', plus: 'Detailed', premium: 'Detailed' },
    ],
  },
  {
    title: 'Connections',
    features: [
      { label: 'Interest actions', free: '3 / day', plus: '10 / day', premium: '25 / day' },
      { label: 'Shortlist', free: '10 profiles', plus: 'Unlimited', premium: 'Unlimited' },
      { label: 'Messaging', free: 'Accepted interests', plus: 'Accepted interests', premium: 'Enhanced eligibility' },
      { label: 'Conversation threads', free: '1', plus: '5', premium: '15' },
    ],
  },
  {
    title: 'Visibility & support',
    features: [
      { label: 'Profile visibility', free: 'Standard', plus: 'Standard', premium: 'Priority (simulated)' },
      { label: 'Profile completeness insights', free: 'Basic', plus: 'Detailed', premium: 'Detailed' },
      { label: 'Admin review priority', free: 'Standard', plus: 'Standard', premium: 'Priority (simulated)' },
      { label: 'Support', free: 'Help centre', plus: 'Email (demo)', premium: 'Priority (demo)' },
    ],
  },
]

export const messagingRules = {
  requireAcceptedInterest: true,
  allowExistingConversations: true,
  premiumCanReplyToIncoming: true,
}

export function getPlan(planId) {
  return plans.find((plan) => plan.id === planId) || plans[0]
}

export function planPrice(planId, interval = 'monthly') {
  const plan = getPlan(planId)
  return plan.prices[interval] ?? plan.prices.monthly
}

export function monthlyEquivalent(planId, interval = 'monthly') {
  const price = planPrice(planId, interval)
  if (interval === 'yearly') return Math.round(price / 12)
  return price
}

export function yearlySaving(planId) {
  const plan = getPlan(planId)
  const yearly = plan.prices.yearly
  const monthly = plan.prices.monthly * 12
  return Math.max(0, monthly - yearly)
}
