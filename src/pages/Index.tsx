import { User, Users, Building } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PracticeModeCard } from "@/components/PracticeModeCard";

const practiceModes = [
  {
    title: "Solo Coding",
    description: "Enhance your coding skills independently with comprehensive feedback.",
    icon: User,
    route: "/self-practice",
    image: "https://www.yarddiant.com/images/how-to-practice-coding-every-day.jpg",
    instructions: [],
  },
  {
    title: "Collaborative Coding",
    description: "Work alongside peers to solve problems and learn collectively.",
    icon: Users,
    route: "/peer-practice",
    image: "https://www.codio.com/hubfs/Blog_EN_PICS/August%202021%20Blog%20-%20Collaborative%20Coding%20in%20Codio.png#keepProtocol",
    instructions: [],
  },
  {
    title: "Team Coding",
    description: "Register your organization and manage team coding sessions. Upload CSV with team members to get started.",
    icon: Building,
    route: "/team-coding",
    image: "https://savvytokyo.scdn3.secure.raxcdn.com/app/uploads/2023/10/LINE_ALBUM_1-Monday_231016_4.jpg",
    instructions: [
      "Upload a CSV file with columns: name, email, date, time",
      "Each team member will receive a unique 6-digit code",
      "Members can access sessions using their unique code",
      "View and manage all registered organizations",
      "Download team member data and session reports"
    ],
  },
  {
    title: "DEvOPS  AI",
    description: "WDEVVOPS AI",
    icon: Users,
    route: "/DEVOPS",
    image: "https://www.codio.com/hubfs/Blog_EN_PICS/August%202021%20Blog%20-%20Collaborative%20Coding%20in%20Codio.png#keepProtocol",
    instructions: [],
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="space-y-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
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
