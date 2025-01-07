import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: string;
  question: string;
  difficulty: string;
}

export function QuestionPanel({ subtopicId }: { subtopicId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [subtopicId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('technical_questions')
        .select('*')
        .eq('topic_id', subtopicId);

      if (error) throw error;
      setQuestions(data || []);
      if (data?.[0]) setCurrentQuestion(data[0]);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !user) return;

    setIsSubmitting(true);
    try {
      // Evaluate answer using Groq
      const { data: evaluation, error: evaluationError } = await supabase.functions.invoke('evaluate-technical-answer', {
        body: {
          question: currentQuestion.question,
          answer,
          userId: user.id,
          questionId: currentQuestion.id,
        },
      });

      if (evaluationError) throw evaluationError;

      // Save response
      const { error: responseError } = await supabase
        .from('technical_responses')
        .insert({
          user_id: user.id,
          question_id: currentQuestion.id,
          response: answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
        });

      if (responseError) throw responseError;

      toast({
        title: "Success",
        description: "Your answer has been evaluated",
      });

      // Move to next question
      const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
      if (currentIndex < questions.length - 1) {
        setCurrentQuestion(questions[currentIndex + 1]);
        setAnswer('');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return <p>No questions available for this subtopic.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
        <p className="text-sm text-muted-foreground">
          Difficulty: {currentQuestion.difficulty}
        </p>
      </div>
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="min-h-[200px]"
      />
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !answer.trim()}
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </div>
  );
}