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

  const handleSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user?.id,
          subscription_type: planType,
          payment_id: subscriptionId,
          payment_provider: 'paypal',
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
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
      createSubscription={(data, actions) => {
        return actions.subscription.create({
          plan_id: planType === 'pro' ? 'P-PRO_PLAN_ID' : 'P-ENTERPRISE_PLAN_ID', // Replace with your actual PayPal plan IDs
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            return_url: window.location.href,
            cancel_url: window.location.href
          }
        });
      }}
      onApprove={async (data, actions) => {
        if (data.subscriptionID) {
          await handleSubscription(data.subscriptionID);
        }
      }}
      onError={() => {
        toast({
          title: "Error",
          description: "PayPal transaction failed. Please try again.",
          variant: "destructive",
        });
      }}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'subscribe'
      }}
    />
  );
}