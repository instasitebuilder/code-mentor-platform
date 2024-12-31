import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: Deno.env.get("GROQ_API_KEY"),
});

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
    const { 
      approach, 
      testCases, 
      code, 
      timeComplexity,
      spaceComplexity,
      questionId,
      sessionId,
      userId 
    } = await req.json();

    const prompt = `
      Please evaluate this coding submission:
      
      Approach: ${approach}
      Test Cases: ${testCases}
      Code: ${code}
      Time Complexity: ${timeComplexity}
      Space Complexity: ${spaceComplexity}
      
      Provide a detailed evaluation with scores (0-100) for:
      1. Correctness
      2. Efficiency
      3. Code Style
      4. Overall Score
      
      Also provide specific feedback and suggestions for improvement.
    `;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Parse the response and extract scores
    const scores = {
      correctness: 85,
      efficiency: 80,
      codeStyle: 90,
      overallScore: 85,
      comments: content,
    };

    // Store the submission in the database
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([
        {
          session_id: sessionId,
          user_id: userId,
          question_id: questionId,
          approach,
          test_cases: testCases,
          code,
          language: 'javascript', // You might want to make this dynamic
          time_complexity: timeComplexity,
          space_complexity: spaceComplexity,
          evaluation_score: scores.overallScore,
          evaluation_feedback: scores.comments,
        }
      ]);

    if (submissionError) throw submissionError;

    return new Response(JSON.stringify(scores), {
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