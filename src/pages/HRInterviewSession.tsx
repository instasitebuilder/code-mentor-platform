import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { AIInterviewer } from '@/components/AIInterviewer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  question: string;
  is_company_specific: boolean;
  audio_response_url: string | null;
  feedback: string | null;
  interview_id: string;
  created_at: string;
}

export default function HRInterviewSession() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [interviewDetails, setInterviewDetails] = useState<{
    company_name: string;
    position: string;
  } | null>(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const { data: interview, error: interviewError } = await supabase
          .from('hr_interviews')
          .select('*')
          .eq('id', id)
          .single();

        if (interviewError) throw interviewError;

        setInterviewDetails(interview);

        const { data: questionsData, error: questionsError } = await supabase
          .from('hr_interview_questions')
          .select('*')
          .eq('interview_id', id)
          .order('created_at');

        if (questionsError) throw questionsError;

        // Process questions to include company name and position
        const processedQuestions = questionsData.map(q => ({
          ...q,
          question: q.is_company_specific 
            ? q.question
                .replace('{company_name}', interview.company_name)
                .replace('{position}', interview.position)
            : q.question
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
        navigate('/hr-interview');
      }
    };

    if (id) {
      fetchInterviewDetails();
    }
  }, [id, navigate]);

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Interview completed
      try {
        await supabase
          .from('hr_interviews')
          .update({ status: 'completed' })
          .eq('id', id);

        toast({
          title: "Interview Completed",
          description: "Your responses have been saved successfully.",
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error completing interview:', error);
        toast({
          title: "Error",
          description: "Failed to complete interview",
          variant: "destructive"
        });
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
          audio_response_url: null, // This would be updated with actual audio URL
          feedback: responses[currentQuestion.id]
        })
        .eq('id', currentQuestion.id);

      if (error) throw error;

      toast({
        title: "Response Saved",
        description: "Your answer has been recorded successfully.",
      });

      handleNextQuestion();
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Interview with {interviewDetails?.company_name}
            </h1>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          <AIInterviewer 
            question={currentQuestion?.question || ''} 
          />

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              {currentQuestion?.question}
            </h2>

            <Textarea
              value={responses[currentQuestion?.id] || ''}
              onChange={(e) => setResponses(prev => ({
                ...prev,
                [currentQuestion?.id]: e.target.value
              }))}
              placeholder="Your response will be recorded here as you speak..."
              className="min-h-[200px]"
              readOnly
            />

            <div className="flex justify-end gap-4">
              <Button
                onClick={handleResponseSubmit}
                disabled={!responses[currentQuestion?.id]}
              >
                Submit Response
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}