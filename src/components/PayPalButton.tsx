import { useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PayPalButtonProps {
  amount: string;
  planType: 'pro' | 'enterprise';
}

export function PayPalButton({ amount, planType }: PayPalButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscription = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user?.id,
          subscription_type: planType,
          payment_id: paymentId,
          payment_provider: 'paypal',
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });

      if (error) throw error;

      toast({
        title: "Subscription Successful",
        description: `You are now subscribed to the ${planType} plan!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount,
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const order = await actions.order.capture();
          await handleSubscription(order.id);
        }
      }}
      onError={() => {
        toast({
          title: "Error",
          description: "PayPal transaction failed. Please try again.",
          variant: "destructive",
        });
      }}
    />
  );
}