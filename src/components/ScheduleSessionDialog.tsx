import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ScheduleSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string | null;
}

export function ScheduleSessionDialog({ open, onOpenChange, groupId }: ScheduleSessionDialogProps) {
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [questions, setQuestions] = useState(["", "", ""]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !groupId || !startDateTime || !endDateTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const sessionCode = Math.floor(100000 + Math.random() * 900000).toString();
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      
      const { error } = await supabase
        .from('peer_sessions')
        .insert([
          {
            group_id: groupId,
            date: startDate.toISOString().split('T')[0],
            start_time: startDate.toTimeString().split(' ')[0],
            end_time: endDate.toTimeString().split(' ')[0],
            questions,
            session_code: sessionCode,
            created_by: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Session scheduled successfully",
        description: `Session code: ${sessionCode}`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast({
        title: "Error scheduling session",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Practice Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date & Time</Label>
            <Input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>End Date & Time</Label>
            <Input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              min={startDateTime}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Questions</Label>
            {questions.map((question, index) => (
              <Input
                key={index}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                required
              />
            ))}
          </div>
          <Button type="submit" className="w-full">Schedule Session</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}