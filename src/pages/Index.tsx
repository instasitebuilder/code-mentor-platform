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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome to CodePractice</h1>
            <p className="text-muted-foreground mt-2">
              Choose your practice mode to get started
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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