import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Code, Target } from 'lucide-react';

export function RecentActivity() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <Code className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="font-medium">Completed Array Challenge</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <Book className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="font-medium">Started Learning Path: DSA</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="font-medium">Achieved 7-Day Streak</p>
              <p className="text-sm text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}