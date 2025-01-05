import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AIInterviewer } from '@/components/AIInterviewer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHRInterview } from '@/hooks/useHRInterview';

export default function HRInterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    currentQuestionIndex,
    questions,
    responses,
    setResponses,
    isLoading,
    interviewDetails,
    handleResponseSubmit,
    progress,
    currentQuestion,
  } = useHRInterview(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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
                onClick={async () => {
                  const isComplete = await handleResponseSubmit();
                  if (isComplete) {
                    navigate('/dashboard');
                  }
                }}
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