import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AIInterviewer } from '@/components/AIInterviewer';

interface QuestionFlowProps {
  question: string;
  onSubmitResponse: (response: string) => Promise<void>;
  onQuestionComplete: () => void;
  isLastQuestion: boolean;
}

export function QuestionFlow({ 
  question, 
  onSubmitResponse, 
  onQuestionComplete,
  isLastQuestion 
}: QuestionFlowProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const { toast } = useToast();
  const [questionRead, setQuestionRead] = useState(false);

  useEffect(() => {
    if (questionRead && !isRecording) {
      startRecording();
    }
  }, [questionRead]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        
        try {
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: formData,
          });
          
          const data = await response.json();
          setTranscription(data.text);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          toast({
            title: "Error",
            description: "Failed to transcribe your response",
            variant: "destructive",
          });
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      toast({
        title: "Error",
        description: "Failed to start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (transcription) {
      await onSubmitResponse(transcription);
      onQuestionComplete();
      setTranscription('');
      setQuestionRead(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Interview Question</h2>
      </div>
      
      <AIInterviewer 
        question={question} 
        onQuestionRead={() => setQuestionRead(true)}
      />

      {transcription && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-medium mb-2">Your Response:</p>
            <p>{transcription}</p>
          </div>
          
          <Button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLastQuestion ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Complete Interview
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit & Continue
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}