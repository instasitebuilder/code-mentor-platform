import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer, userId, questionId } = await req.json();

    const prompt = `
      As a technical interviewer, evaluate this answer:
      
      Question: ${question}
      Answer: ${answer}
      
      Provide:
      1. Score (0-100)
      2. Detailed feedback
      3. Areas for improvement
      
      Format the response as JSON with these fields:
      {
        "score": number,
        "feedback": string
      }
    `;

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
      }),
    });

    const groqResponse = await response.json();
    const evaluation = JSON.parse(groqResponse.choices[0].message.content);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in evaluate-technical-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});