import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, InterviewDetails } from '@/types/hr-interview';
import { useToast } from '@/hooks/use-toast';

export function useHRInterview(interviewId: string) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const { data: interview, error: interviewError } = await supabase
          .from('hr_interviews')
          .select('*')
          .eq('id', interviewId)
          .single();

        if (interviewError) throw interviewError;

        setInterviewDetails(interview);

        const response = await fetch('/hr-interview-questions.json');
        const data = await response.json();
        const processedQuestions = data.questions.map((q: any) => ({
          ...q,
          question: q.question
            .replace('{company_name}', interview.company_name)
            .replace('{position}', interview.position)
        }));

        setQuestions(processedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching interview details:', error);
        toast({
          title: "Error",
          description: "Failed to load interview questions",
          variant: "destructive"
        });
      }
    };

    if (interviewId) {
      fetchInterviewDetails();
    }
  }, [interviewId, toast]);

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Interview completed
      try {
        await supabase
          .from('hr_interviews')
          .update({ status: 'completed' })
          .eq('id', interviewId);

        toast({
          title: "Interview Completed",
          description: "Your responses have been saved successfully.",
        });
        return true; // Signal completion
      } catch (error) {
        console.error('Error completing interview:', error);
        toast({
          title: "Error",
          description: "Failed to complete interview",
          variant: "destructive"
        });
        return false;
      }
    }
  };

  const handleResponseSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      const { error } = await supabase
        .from('hr_interview_questions')
        .update({ 
          audio_response_url: null,
          feedback: responses[currentQuestion.id]
        })
        .eq('id', currentQuestion.id);

      if (error) throw error;

      toast({
        title: "Response Saved",
        description: "Your answer has been recorded successfully.",
      });

      return handleNextQuestion();
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    currentQuestionIndex,
    questions,
    responses,
    setResponses,
    isLoading,
    interviewDetails,
    handleResponseSubmit,
    progress: (currentQuestionIndex / questions.length) * 100,
    currentQuestion: questions[currentQuestionIndex],
  };
}