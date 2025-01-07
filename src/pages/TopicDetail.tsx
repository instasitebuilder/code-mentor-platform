import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubtopicList } from '@/components/technical/SubtopicList';
import { QuestionPanel } from '@/components/technical/QuestionPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subtopic {
  id: string;
  title: string;
}

export default function TopicDetail() {
  const { topicId } = useParams();
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubtopics();
  }, [topicId]);

  const fetchSubtopics = async () => {
    try {
      const { data, error } = await supabase
        .from('technical_topics')
        .select('*')
        .eq('parent_id', topicId);

      if (error) throw error;
      setSubtopics(data || []);
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      toast({
        title: "Error",
        description: "Failed to load subtopics",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        <SubtopicList
          subtopics={subtopics}
          selectedSubtopic={selectedSubtopic}
          onSelect={setSelectedSubtopic}
        />
        <Card>
          <CardContent className="p-6">
            {selectedSubtopic ? (
              <QuestionPanel subtopicId={selectedSubtopic} />
            ) : (
              <p className="text-muted-foreground">Select a subtopic to start practicing</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}