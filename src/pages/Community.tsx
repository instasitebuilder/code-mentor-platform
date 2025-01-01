import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Users, MessageSquare, Trophy, Calendar, BookOpen, Target } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Study Groups",
    description: "Join or create study groups to learn and practice together",
    status: "Coming Soon",
  },
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    description: "Engage in technical discussions and share knowledge",
    status: "Coming Soon",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description: "Participate in coding competitions and challenges",
    status: "Coming Soon",
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Join online workshops, webinars, and meetups",
    status: "Coming Soon",
  },
  {
    icon: BookOpen,
    title: "Resource Sharing",
    description: "Share and discover learning resources",
    status: "Coming Soon",
  },
  {
    icon: Target,
    title: "Mentorship",
    description: "Connect with mentors or become one",
    status: "Coming Soon",
  },
];

const upcomingEvents = [
  {
    title: "DSA Workshop",
    date: "March 15, 2024",
    time: "2:00 PM EST",
    type: "Workshop",
  },
  {
    title: "Mock Interview Session",
    date: "March 18, 2024",
    time: "3:30 PM EST",
    type: "Practice",
  },
  {
    title: "Web Development Basics",
    date: "March 20, 2024",
    time: "1:00 PM EST",
    type: "Workshop",
  },
];

export function Community() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Join Our Coding Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with fellow developers, share knowledge, and grow together
          </p>
        </div>

        {/* Newsletter Signup */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Subscribe to our newsletter for community updates and events
                </p>
              </div>
              <div className="flex w-full md:w-auto gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-sm"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                  {feature.status}
                </span>
              </div>
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-2">
                  <feature.icon className="w-6 h-6 text-purple-500" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {event.type}
                    </span>
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Community;