export const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic coding challenges",
      "Community access",
      "Basic progress tracking",
      "Limited peer practice sessions (2 free trials)",
      "Public leaderboard access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$5",
    description: "Best for serious learners",
    features: [
      "All Free features",
      "Advanced coding challenges",
      "Priority community support",
      "Detailed progress analytics",
      "Unlimited peer practice sessions",
      "Custom study plans",
      "Interview preparation tools",
      "Premium learning resources",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$20",
    description: "For teams and organizations",
    features: [
      "All Pro features",
      "Custom challenge creation",
      "Team management dashboard",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Advanced analytics",
      "Priority feature requests",
      "Custom branding options",
    ],
    popular: false,
  },
];

export const frequentlyAskedQuestions = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a student discount?",
    answer:
      "Yes! Students can get 50% off the Pro plan with a valid student email address.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, we offer a 30-day money-back guarantee for all paid plans.",
  },
];