import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  sessionDetails: {
    date: string;
    startTime: string;
    endTime: string;
    questions: string[];
    sessionCode: string;
    groupName: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, sessionDetails }: EmailRequest = await req.json();
    
    const emailHtml = `
      <h2>New Practice Session Scheduled</h2>
      <p>A new practice session has been scheduled for ${sessionDetails.date}</p>
      <p>Time: ${sessionDetails.startTime} - ${sessionDetails.endTime}</p>
      <p>Group: ${sessionDetails.groupName}</p>
      <h3>Questions:</h3>
      <ul>
        ${sessionDetails.questions.map((q, i) => `<li>Question ${i + 1}: ${q}</li>`).join('')}
      </ul>
      <p>Session Code: ${sessionDetails.sessionCode}</p>
      <p>Use this code to join the session when it starts.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CodePractice <onboarding@resend.dev>",
        to,
        subject: `New Practice Session - ${sessionDetails.groupName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);