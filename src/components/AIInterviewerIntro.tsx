import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface AIInterviewerIntroProps {
  onIntroComplete?: () => void;
}

export function AIInterviewerIntro({ onIntroComplete }: AIInterviewerIntroProps) {
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        
        if (profile?.name) {
          setUserName(profile.name);
        }
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const readIntroduction = async () => {
      if (!userName) return;
      
      try {
        setIsReading(true);
        const introText = `Hello ${userName}! I'm Sarah, your AI interviewer today. I'll be asking you a series of questions to learn more about you.`;
        
        const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
        
        if (!ELEVEN_LABS_API_KEY) {
          throw new Error('ElevenLabs API key is not configured');
        }

        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_LABS_API_KEY,
          },
          body: JSON.stringify({
            text: introText,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('ElevenLabs API error:', errorData);
          throw new Error(`Failed to generate speech: ${response.statusText}`);
        }

        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        
        audio.onended = () => {
          setIsReading(false);
          onIntroComplete?.();
        };

        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          setIsReading(false);
          toast({
            title: "Error",
            description: "Failed to play the introduction audio. Please try again.",
            variant: "destructive"
          });
        };
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Audio play promise error:', error);
            setIsReading(false);
            toast({
              title: "Error",
              description: "Failed to start audio playback. Please try again.",
              variant: "destructive"
            });
          });
        }
      } catch (error) {
        console.error('Error reading introduction:', error);
        setIsReading(false);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to read the introduction. Please try again.",
          variant: "destructive"
        });
      }
    };

    readIntroduction();
  }, [userName, onIntroComplete, toast]);

  return (
    <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <Avatar className={`h-16 w-16 ${isReading ? 'animate-pulse' : ''}`}>
        <AvatarImage src="/ai-interviewer.png" alt="AI Interviewer - Sarah" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="text-white">
        <h3 className="text-lg font-semibold">Sarah - AI Interviewer</h3>
        <p className="text-sm opacity-90">{isReading ? 'Speaking...' : 'Ready for interview'}</p>
      </div>
    </Card>
  );
}