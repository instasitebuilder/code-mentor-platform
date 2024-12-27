import { User, Users, UserCheck, Building } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PracticeModeCard } from "@/components/PracticeModeCard";

const practiceModes = [
  {
    title: "Self Practice",
    description: "Practice coding problems at your own pace with detailed feedback.",
    icon: User,
    route: "/self-practice",
  },
  {
    title: "Peer Practice",
    description: "Practice with up to 5 peers and learn together.",
    icon: Users,
    route: "/peer-practice",
  },
  {
    title: "Mentor Practice",
    description: "Get guidance from experienced mentors while solving problems.",
    icon: UserCheck,
    route: "/mentor-practice",
  },
  {
    title: "Organization Practice",
    description: "Join your organization's coding practice sessions.",
    icon: Building,
    route: "/org-practice",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Welcome to CodePractice
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your practice mode to get started
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
            {practiceModes.map((mode) => (
              <PracticeModeCard key={mode.title} {...mode} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}