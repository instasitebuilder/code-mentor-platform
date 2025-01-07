import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubtopicListProps {
  subtopics: Array<{
    id: string;
    title: string;
  }>;
  selectedSubtopic: string | null;
  onSelect: (id: string) => void;
}

export function SubtopicList({ subtopics, selectedSubtopic, onSelect }: SubtopicListProps) {
  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <div className="p-4 space-y-2">
        {subtopics.map((subtopic) => (
          <Button
            key={subtopic.id}
            variant={selectedSubtopic === subtopic.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelect(subtopic.id)}
          >
            {subtopic.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}