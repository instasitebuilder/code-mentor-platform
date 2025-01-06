export interface Question {
  id: string;
  question: string;
  audio_response_url: string | null;
  feedback: string | null;
  interview_id: string;
  created_at: string;
}

export interface InterviewDetails {
  company_name: string;
  position: string;
}