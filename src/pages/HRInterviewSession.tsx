import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function HRInterviewSession() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const aiVoice = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInterviewDetails = async () => {
      try {
        const { data: interview, error: interviewError } = await supabase
          .from('hr_interviews')
          .select('*')
          .eq('id', id)
          .single();

        if (interviewError || !interview) throw interviewError;

        // Get 10 questions
        const { data: fetchedQuestions, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('interview_id', id)
          .limit(10);

        if (questionError || !fetchedQuestions) throw questionError;
        setQuestions(fetchedQuestions.map((q: any) => q.question));
      } catch (error) {
        console.error('Error fetching interview details:', error);
        toast({
          title: "Error",
          description: "Failed to setup interview session.",
          variant: "destructive",
        });
        navigate('/hr-interview');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id, navigate, toast, user]);

  const startRecording = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast({
        title: "Unsupported Feature",
        description: "Speech recognition is not supported on this browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscribedText(transcript);
    };

    recognition.start();
    setIsRecording(true);

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const stopRecording = () => {
    if (isRecording) {
      window.SpeechRecognition?.stop();
      setIsRecording(false);
    }
  };

  const handleNextQuestion = async () => {
    try {
      await supabase
        .from('hr_responses')
        .insert({
          interview_id: id,
          question: questions[currentQuestionIndex],
          response: transcribedText,
        });

      setTranscribedText('');
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save response.",
        variant: "destructive",
      });
    }
  };

  const speakQuestion = (question: string) => {
    if (!aiVoice.current) {
      aiVoice.current = new SpeechSynthesisUtterance();
      aiVoice.current.lang = 'en-US';
      aiVoice.current.pitch = 1;
      aiVoice.current.rate = 1;
    }
    aiVoice.current.text = question;
    speechSynthesis.speak(aiVoice.current);
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      speakQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Thank you for completing the interview!</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">AI Interview Assistant</h2>

            <div className="flex justify-center mb-4">
              <img
                src="/ai-avatar.png" // Replace with a real AI avatar image URL
                alt="AI Assistant"
                className="w-24 h-24 rounded-full"
              />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Question {currentQuestionIndex + 1}/{questions.length}:
            </h3>
            <p className="text-xl">{questions[currentQuestionIndex]}</p>

            <textarea
              value={transcribedText}
              readOnly
              className="w-full mt-4 p-4 bg-gray-200 rounded-lg text-black"
              rows={5}
            />

            <div className="flex gap-4 mt-6">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              <Button onClick={handleNextQuestion} disabled={!transcribedText}>
                Next Question
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
