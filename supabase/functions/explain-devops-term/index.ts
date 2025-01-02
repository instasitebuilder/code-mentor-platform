import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { term } = await req.json();
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    // Get explanation from Groq
    const groqResponse = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a DevOps expert. Provide detailed explanations of DevOps terms and concepts."
          },
          {
            role: "user",
            content: `Explain the DevOps term or concept: "${term}" in simple terms.`
          }
        ]
      }),
    });

    const groqData = await groqResponse.json();
    const groqExplanation = groqData.choices[0].message.content;

    // Get additional insights from Gemini
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const geminiPrompt = `For the DevOps term "${term}", provide:
    1. Three relevant YouTube video titles and search URLs
    2. Three related questions that someone learning this concept might ask
    Format as JSON with structure:
    {
      "videos": [{"title": "string", "url": "string"}],
      "relatedQuestions": ["string"]
    }`;

    const geminiResult = await model.generateContent(geminiPrompt);
    const geminiResponse = await geminiResult.response;
    const geminiText = geminiResponse.text();
    
    // Parse Gemini's response
    const geminiData = JSON.parse(geminiText);

    // Combine responses
    const result = {
      explanation: groqExplanation,
      videos: geminiData.videos,
      relatedQuestions: geminiData.relatedQuestions
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});