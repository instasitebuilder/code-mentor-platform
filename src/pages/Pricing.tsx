import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic coding challenges",
      "Community access",
      "Basic progress tracking",
      "Limited peer practice sessions",
      "Public leaderboard access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
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
    price: "Custom",
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

const frequentlyAskedQuestions = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a student discount?",
    answer: "Yes! Students can get 50% off the Pro plan with a valid student email address.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Can I get a refund?",
    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans.",
  },
];

export function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-2 border-purple-500 shadow-xl"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-sm font-semibold text-white">
                    <Zap className="h-4 w-4" />
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.name !== "Enterprise" && (
                      <span className="text-gray-600 dark:text-gray-400">
                        /month
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      : ""
                  }`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {frequentlyAskedQuestions.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Contact our team for more information about our plans and pricing.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
