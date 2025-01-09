import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButton } from "@/components/PayPalButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
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

const frequentlyAskedQuestions = [
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

export function Pricing() {
  const { user } = useAuth();
  
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <PayPalScriptProvider options={{ 
        "client-id": process.env.VITE_PAYPAL_CLIENT_ID || "",
        currency: "USD"
      }}>
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-md">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a 30-day money-back guarantee.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative transition-transform transform hover:scale-105 ${
                  plan.popular
                    ? "border-4 border-purple-500 shadow-xl"
                    : "border border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                      <Zap className="h-4 w-4" />
                      Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <h3 className="text-3xl font-bold">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-5xl font-extrabold text-gray-800 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.name !== "Free" && (
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
                  {plan.name === "Free" ? (
                    <Button className="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                      Current Plan
                    </Button>
                  ) : (
                    subscription?.subscription_type !== plan.name.toLowerCase() && (
                      <PayPalButton 
                        amount={plan.price.replace("$", "")} 
                        planType={plan.name.toLowerCase() as 'pro' | 'enterprise'} 
                      />
                    )
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {frequentlyAskedQuestions.map((faq, index) => (
                <details
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg shadow-md dark:border-gray-700"
                >
                  <summary className="cursor-pointer text-xl font-semibold">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </PayPalScriptProvider>
    </div>
  );
}

export default Pricing;