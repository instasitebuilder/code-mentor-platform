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
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const setupInterview = async () => {
      try {
        // Get interview details
        const { data: interview, error: interviewError } = await supabase
          .from('hr_interviews')
          .select('*')
          .eq('id', id)
          .single();

        if (interviewError || !interview) throw interviewError;

        // Setup camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Generate first question
        await generateNextQuestion();
      } catch (error) {
        console.error('Error setting up interview:', error);
        toast({
          title: "Error",
          description: "Failed to setup interview session",
          variant: "destructive"
        });
        navigate('/hr-interview');
      } finally {
        setIsLoading(false);
      }
    };

    setupInterview();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, id, navigate]);

  const generateNextQuestion = async () => {
    // For now, using a simple array of questions. In production, this would use an AI service
    const questions = [
      "Tell me about yourself and your background.",
      "Why are you interested in this position?",
      "What are your greatest strengths?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?"
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);

    // Save question to database
    await supabase
      .from('hr_interview_questions')
      .insert({
        interview_id: id,
        question: randomQuestion
      });
  };

  const startRecording = () => {
    if (!mediaStream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(mediaStream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const file = new File([audioBlob], 'response.webm', { type: 'audio/webm' });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('interview_responses')
        .upload(`${id}/${Date.now()}.webm`, file);

      if (uploadError) {
        console.error('Error uploading response:', uploadError);
        return;
      }

      // Update question record with response URL
      await supabase
        .from('hr_interview_questions')
        .update({
          audio_response_url: uploadData.path
        })
        .eq('interview_id', id)
        .eq('question', currentQuestion);

      // Generate next question
      await generateNextQuestion();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const endInterview = async () => {
    try {
      // Update interview status
      await supabase
        .from('hr_interviews')
        .update({ status: 'completed' })
        .eq('id', id);

      // Generate and store feedback PDF (this would be implemented with a backend service)
      toast({
        title: "Interview Completed",
        description: "Your feedback will be available in the dashboard soon.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: "Error",
        description: "Failed to end interview session",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Interview Session
            </h2>

            <div className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Current Question:</h3>
                <p className="text-lg">{currentQuestion}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button onClick={endInterview} variant="outline">
                  End Interview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}