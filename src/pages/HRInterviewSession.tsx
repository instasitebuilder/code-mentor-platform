import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHRInterview } from '@/hooks/useHRInterview';
import { AIInterviewerIntro } from '@/components/AIInterviewerIntro';
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard';
import { useToast } from '@/components/ui/use-toast';

export default function HRInterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [introCompleted, setIntroCompleted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    currentQuestionIndex,
    responses,
    setResponses,
    isLoading,
    interviewDetails,
    handleResponseSubmit,
    currentQuestion,
  } = useHRInterview(id!);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/hr-interview-questions.json');
        const data = await response.json();
        const processedQuestions = data.questions.map((q: any) => ({
          ...q,
          question: q.question
            .replace('{company_name}', interviewDetails?.company_name || '')
            .replace('{position}', interviewDetails?.position || '')
        }));
        setQuestions(processedQuestions);
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
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startVideo();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        if (currentQuestion) {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          try {
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              },
            });
            const data = await response.json();
            setTranscription(data.text);
            
            if (currentQuestion) {
              setResponses(prev => ({
                ...prev,
                [currentQuestion.id]: data.text
              }));
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="fixed top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 p-1"
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {!introCompleted ? (
            <AIInterviewerIntro onIntroComplete={() => setIntroCompleted(true)} />
          ) : (
            questions[currentQuestionIndex] && (
              <InterviewQuestionCard
                currentQuestion={questions[currentQuestionIndex].question}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                transcription={transcription}
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onNextQuestion={async () => {
                  const isComplete = await handleResponseSubmit();
                  if (isComplete) {
                    navigate('/dashboard');
                  }
                  setTranscription('');
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}