import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AIInterviewerIntro } from '@/components/AIInterviewerIntro';
import { AIInterviewer } from '@/components/AIInterviewer';
import { useHRInterview } from '@/hooks/useHRInterview';
import { supabase } from '@/integrations/supabase/client';

export default function HRInterview() {
  const navigate = useNavigate();
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [interviewId, setInterviewId] = useState<string>('');
  
  useEffect(() => {
    const createInterview = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('hr_interviews')
        .insert({
          user_id: user.id,
          company_name: 'Example Corp', // This could be made dynamic
          position: 'Software Engineer', // This could be made dynamic
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating interview:', error);
        return;
      }

      setInterviewId(data.id);
    };

    createInterview();
  }, [navigate]);

  const {
    currentQuestion,
    responses,
    setResponses,
    handleResponseSubmit,
    progress,
    isLoading,
  } = useHRInterview(interviewId);

  if (isLoading || !interviewId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-6">
        {!isIntroComplete ? (
          <AIInterviewerIntro onIntroComplete={() => setIsIntroComplete(true)} />
        ) : (
          <>
            <Progress value={progress} className="w-full" />
            
            <AIInterviewer 
              question={currentQuestion?.question || ''} 
              onQuestionRead={() => {}} 
            />

            <Card className="p-6">
              <textarea
                className="w-full h-32 p-2 border rounded"
                value={responses[currentQuestion?.id || ''] || ''}
                onChange={(e) => 
                  setResponses(prev => ({
                    ...prev,
                    [currentQuestion?.id || '']: e.target.value
                  }))
                }
                placeholder="Type your response here..."
              />
              
              <Button 
                className="mt-4"
                onClick={async () => {
                  const isComplete = await handleResponseSubmit();
                  if (isComplete) {
                    navigate('/dashboard');
                  }
                }}
              >
                Next Question
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}