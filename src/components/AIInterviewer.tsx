import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AIInterviewerProps {
  question: string;
  onQuestionRead?: () => void;
}

export function AIInterviewer({ question, onQuestionRead }: AIInterviewerProps) {
  const { toast } = useToast();
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const readQuestion = async () => {
      try {
        setIsReading(true);
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVEN_LABS_API_KEY || '',
          },
          body: JSON.stringify({
            text: question,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (!response.ok) throw new Error('Failed to generate speech');

        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        
        audio.onended = () => {
          setIsReading(false);
          onQuestionRead?.();
        };
        
        audio.play();
      } catch (error) {
        console.error('Error reading question:', error);
        toast({
          title: "Error",
          description: "Failed to read the question. Please try again.",
          variant: "destructive"
        });
        setIsReading(false);
      }
    };

    if (question) {
      readQuestion();
    }
  }, [question, onQuestionRead]);

  return (
    <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-500">
      <Avatar className={`h-16 w-16 ${isReading ? 'animate-pulse' : ''}`}>
        <AvatarImage src="/ai-interviewer.png" alt="AI Interviewer" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="text-white">
        <h3 className="text-lg font-semibold">AI Interviewer</h3>
        <p className="text-sm opacity-90">{isReading ? 'Speaking...' : 'Listening...'}</p>
      </div>
    </Card>
  );
}