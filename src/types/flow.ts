export interface FlowNode {
  id: string;
  type?: string;
  data: {
    label: string;
    subTopics?: string[];
    completedSubTopics?: string[];
  };
  position: {
    x: number;
    y: number;
  };
  className?: string;
}