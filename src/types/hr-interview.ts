export interface Question {
  id: number;
  type: string;
  question: string;
}

export interface InterviewDetails {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  created_at: string;
  status: 'in_progress' | 'completed';
  feedback_pdf_url?: string;
}

export interface EvaluationCriteria {
  relevance: string;
  clarity: string;
  depth: string;
  examples: string;
  communication: string;
}