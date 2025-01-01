import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockActivityData = [
  { name: 'Mon', problems: 4 },
  { name: 'Tue', problems: 3 },
  { name: 'Wed', problems: 7 },
  { name: 'Thu', problems: 5 },
  { name: 'Fri', problems: 6 },
  { name: 'Sat', problems: 8 },
  { name: 'Sun', problems: 9 },
];

export function ActivityChart() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="problems" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}