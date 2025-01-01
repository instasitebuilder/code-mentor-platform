import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Basic coding challenges",
        "Community access",
        "Basic progress tracking",
        "Limited peer practice sessions",
      ],
    },
    {
      name: "Pro",
      price: "$19",
      features: [
        "Advanced coding challenges",
        "Priority community support",
        "Detailed progress analytics",
        "Unlimited peer practice sessions",
        "Custom study plans",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "All Pro features",
        "Custom challenge creation",
        "Team management",
        "API access",
        "Dedicated support",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">{plan.price}</div>
              {plan.name !== "Free" && <div className="text-sm">per month</div>}
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6">
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}