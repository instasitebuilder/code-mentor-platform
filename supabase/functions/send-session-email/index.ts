import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  sessionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json() as EmailRequest;
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get session details with group and questions
    const { data: session, error: sessionError } = await supabaseClient
      .from('peer_sessions')
      .select(`
        *,
        peer_groups (
          name,
          members
        ),
        peer_questions (
          question_text
        )
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not found');

    // Get member emails from profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('email')
      .in('id', session.peer_groups.members);

    if (profilesError) throw profilesError;

    const memberEmails = profiles.map(profile => profile.email).filter(Boolean);
    const questions = session.peer_questions.map((q: any) => q.question_text);
    const sessionDate = new Date(session.date).toLocaleDateString();

    // Send email using Resend
    const emailHtml = `
      <h2>New Practice Session Scheduled</h2>
      <p>A new practice session has been scheduled for ${sessionDate}</p>
      <p>Time: ${session.start_time} - ${session.end_time}</p>
      <p>Group: ${session.peer_groups.name}</p>
      <h3>Questions:</h3>
      <ul>
        ${questions.map((q: string) => `<li>${q}</li>`).join('')}
      </ul>
      <p>Session Code: ${session.session_code}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Practice Session <onboarding@resend.dev>",
        to: memberEmails,
        subject: `New Practice Session - ${session.peer_groups.name}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);