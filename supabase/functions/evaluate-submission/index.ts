import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { approach, testCases, code, questionId } = await req.json();

    // Here we'll evaluate the submission using an LLM
    // For now, return mock feedback
    const feedback = {
      correctness: 85,
      efficiency: 80,
      codeStyle: 90,
      overallScore: 85,
      comments: `Good solution! Here's some feedback:
      - Your approach is well-thought-out
      - Test cases cover important scenarios
      - Code is clean and readable
      - Consider optimizing the space complexity`,
    };

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in evaluate-submission function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});