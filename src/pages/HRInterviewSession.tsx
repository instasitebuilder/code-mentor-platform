import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHRInterview } from '@/hooks/useHRInterview';
import { AIInterviewerIntro } from '@/components/AIInterviewerIntro';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VideoPreview } from '@/components/interview/VideoPreview';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { QuestionFlow } from '@/components/interview/QuestionFlow';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

const MAX_TIME_SECONDS = 600; // 10 minutes

export default function HRInterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [introCompleted, setIntroCompleted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const {
    responses,
    setResponses,
    isLoading,
    interviewDetails,
    handleResponseSubmit,
  } = useHRInterview(id!);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/hr-interview-questions.json');
        const data = await response.json();
        
        const firstQuestion = data.questions[0];
        const remainingQuestions = data.questions.slice(1);
        const shuffledQuestions = remainingQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = [firstQuestion, ...shuffledQuestions.slice(0, 4)];
        
        setQuestions(selectedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Failed to load interview questions",
          variant: "destructive"
        });
      }
    };

    if (interviewDetails) {
      fetchQuestions();
    }
  }, [interviewDetails, toast]);

  useEffect(() => {
    if (timeSpent >= MAX_TIME_SECONDS) {
      handleTimeUp();
    }
  }, [timeSpent]);

  const handleTimeUp = async () => {
    try {
      await supabase
        .from('hr_interviews')
        .update({ 
          timer_completed: true,
          time_spent_seconds: timeSpent,
          status: 'completed'
        })
        .eq('id', id);

      toast({
        title: "Time's up!",
        description: "Your interview session has ended.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const handleSubmitResponse = async (response: string) => {
    if (questions[currentQuestionIndex]) {
      setResponses(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: response
      }));
    }
  };

  const handleQuestionComplete = async () => {
    const isComplete = await handleResponseSubmit();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (isComplete) {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="container mx-auto max-w-6xl">
        <InterviewHeader onTimeUpdate={setTimeSpent} />
        <VideoPreview className="fixed top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-primary" />

        <div className="max-w-4xl mx-auto space-y-8">
          {!introCompleted ? (
            <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Welcome to Your Interview</h2>
              </div>
              <AIInterviewerIntro onIntroComplete={() => setIntroCompleted(true)} />
            </Card>
          ) : (
            questions[currentQuestionIndex] && (
              <QuestionFlow
                question={questions[currentQuestionIndex].question}
                onSubmitResponse={handleSubmitResponse}
                onQuestionComplete={handleQuestionComplete}
                isLastQuestion={currentQuestionIndex === questions.length - 1}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}