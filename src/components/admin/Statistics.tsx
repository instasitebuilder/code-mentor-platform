import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Video, Trophy } from 'lucide-react';

interface Stats {
  total_users: number;
  total_submissions: number;
  total_interviews: number;
  active_users_today: number;
}

export function Statistics() {
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_submissions: 0,
    total_interviews: 0,
    active_users_today: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total submissions
      const { count: totalSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true });

      // Fetch total interviews
      const { count: totalInterviews } = await supabase
        .from('hr_interviews')
        .select('*', { count: 'exact', head: true });

      // Fetch active users today
      const today = new Date().toISOString().split('T')[0];
      const { count: activeUsers } = await supabase
        .from('submissions')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', today);

      setStats({
        total_users: totalUsers || 0,
        total_submissions: totalSubmissions || 0,
        total_interviews: totalInterviews || 0,
        active_users_today: activeUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats_cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Submissions",
      value: stats.total_submissions,
      icon: BookOpen,
      description: "Total practice submissions",
    },
    {
      title: "Interviews",
      value: stats.total_interviews,
      icon: Video,
      description: "Total interviews taken",
    },
    {
      title: "Active Today",
      value: stats.active_users_today,
      icon: Trophy,
      description: "Users active today",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-200 dark:bg-gray-700" />
            <CardContent className="h-16 bg-gray-100 dark:bg-gray-800" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats_cards.map((stat, index) => (
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