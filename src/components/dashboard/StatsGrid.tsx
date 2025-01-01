import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Code, Clock, Trophy } from 'lucide-react';

const statsCards = [
  {
    title: "Problems Solved",
    value: "125",
    icon: Code,
    description: "Total problems completed",
  },
  {
    title: "Practice Sessions",
    value: "48",
    icon: Clock,
    description: "Hours of practice",
  },
  {
    title: "Current Streak",
    value: "7",
    icon: Activity,
    description: "Days in a row",
  },
  {
    title: "Achievement Points",
    value: "850",
    icon: Trophy,
    description: "Points earned",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}