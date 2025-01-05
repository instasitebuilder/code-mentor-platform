import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AIInterviewer } from '@/components/AIInterviewer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHRInterview } from '@/hooks/useHRInterview';
import { useState, useRef } from 'react';

export default function HRInterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  // Start video feed
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

  // Start recording
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
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (currentQuestion) {
          setResponses(prev => ({
            ...prev,
            [currentQuestion.id]: audioUrl
          }));
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Start video when component mounts
  useState(() => {
    startVideo();
  }, []);

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
        {/* Video Feed */}
        <div className="fixed top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

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

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>

              {responses[currentQuestion?.id] && (
                <div className="mt-4">
                  <audio src={responses[currentQuestion?.id]} controls className="w-full" />
                </div>
              )}
            </div>

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