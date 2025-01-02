import { User, Users, Building, UserCog, Code } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const practiceModes = [
  {
    title: "Solo Coding",
    description: "Enhance your coding skills independently with comprehensive feedback.",
    icon: User,
    route: "/self-practice",
    image: "https://www.yarddiant.com/images/how-to-practice-coding-every-day.jpg",
  },
  {
    title: "Collaborative Coding",
    description: "Work alongside peers to solve problems and learn collectively.",
    icon: Users,
    route: "/peer-practice",
    image: "https://www.codio.com/hubfs/Blog_EN_PICS/August%202021%20Blog%20-%20Collaborative%20Coding%20in%20Codio.png#keepProtocol",
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
    ]
  },
  {
    title: "AI-Assisted DevOps",
    description: "Practice DevOps concepts with the support of AI tools.",
    icon: Code,
    route: "/ai-assisted-devops",
    image: "https://www.amplework.com/wp-content/uploads/2022/07/DevOps-with-AI.png",
  },
  {
    title: "HR Round Simulation",
    description: "Prepare for HR interviews by practicing common questions and scenarios.",
    icon: UserCog,
    route: "/hr-round-simulation",
    image: "https://media.gettyimages.com/id/1365436662/photo/successful-partnership.jpg?s=612x612&w=0&k=20&c=B1xspe9Q5WMsLc7Hc9clR8MWUL4bsK1MfUdDNVNR2Xg=",
  },
];

function PracticeModeCard({ title, description, icon: Icon, route, image, instructions }) {
  return (
    <a
      href={route}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <div className="flex items-center gap-4 mb-4">
        <Icon className="w-8 h-8 text-purple-600 group-hover:text-pink-600" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      {instructions && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Instructions:
          </h4>
          <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
    </a>
  );
}

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