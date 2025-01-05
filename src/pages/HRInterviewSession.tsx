import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AIInterviewer } from '@/components/AIInterviewer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHRInterview } from '@/hooks/useHRInterview';
import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function HRInterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
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

          // Convert speech to text using a service
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
            
            // Update responses with transcription
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

  // Stop recording
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
        {/* Video Feed */}
        <div className="fixed top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 p-1">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Interview with {interviewDetails?.company_name}
            </h1>
            <Progress value={progress} className="w-full bg-gray-700" />
            <p className="text-sm text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          <AIInterviewer 
            question={currentQuestion?.question || ''} 
            onQuestionRead={() => {
              // Enable recording after question is read
              startRecording();
            }}
          />

          <Card className="p-6 space-y-4 bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Question {currentQuestionIndex + 1}: {currentQuestion?.question}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} transition-all duration-300`}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>

              {transcription && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-300">Your Response:</label>
                  <Textarea
                    value={transcription}
                    readOnly
                    className="w-full mt-2 bg-gray-700 text-white border-purple-500 rounded-lg"
                    rows={4}
                  />
                </div>
              )}

              {responses[currentQuestion?.id] && !transcription && (
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
                  setTranscription('');
                }}
                disabled={!responses[currentQuestion?.id]}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
              >
                {currentQuestionIndex === questions.length - 1 ? "Complete Interview" : "Next Question"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}