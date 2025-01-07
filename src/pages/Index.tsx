import { useState, useEffect } from "react";
import { User, Users, UserCheck, Building, UserCog, Code, Star, Heart, ThumbsUp,BookOpen, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Sample data for feedbacks
const feedbacks = [
  {
    name: "John Doe",
    message: "Great platform for interview prep!",
    profileImage: "https://randomuser.me/api/portraits/men/10.jpg",
    icon: <Heart className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Jane Smith",
    message: "Helps me a lot with coding interviews!",
    profileImage: "https://randomuser.me/api/portraits/women/10.jpg",
    icon: <Star className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Alex Johnson",
    message: "Wonderful experience, would recommend to others.",
    profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
    icon: <ThumbsUp className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Emily Davis",
    message: "A fantastic resource for interview preparation!",
    profileImage: "https://randomuser.me/api/portraits/women/11.jpg",
    icon: <Heart className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Michael Brown",
    message: "Loved the coding challenges and feedback system!",
    profileImage: "https://randomuser.me/api/portraits/men/12.jpg",
    icon: <Star className="w-6 h-6 text-gradient" />,
  },
  {
    name: "Sarah Lee",
    message: "A great platform for improving coding skills.",
    profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
    icon: <ThumbsUp className="w-6 h-6 text-gradient" />,
  },
];

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
    description: "Join your organization's coding sessions to practice and collaborate.",
    icon: Building,
    route: "/team-coding",
    image: "https://savvytokyo.scdn3.secure.raxcdn.com/app/uploads/2023/10/LINE_ALBUM_1-Monday_231016_4.jpg",
  },
  {
    title: "AI-Assisted DevOps",
    description: "Practice DevOps concepts with the support of AI tools.",
    icon: Code,
    route: "/devops-practice",
    image: "https://www.amplework.com/wp-content/uploads/2022/07/DevOps-with-AI.png",
  },
  {
    title: "HR Round Simulation",
    description: "Prepare for HR interviews by practicing common questions and scenarios.",
    icon: UserCog,
    route: "/hr-interview",
    image: "https://media.gettyimages.com/id/1365436662/photo/successful-partnership.jpg?s=612x612&w=0&k=20&c=B1xspe9Q5WMsLc7Hc9clR8MWUL4bsK1MfUdDNVNR2Xg=",
  },
  {
    title: "Technical Round Simulation",
    description: "Sharpen your technical skills with simulated problem-solving sessions.",
    icon: Code,
    route: "/technical-round-simulation",
    image: "",
  },
];

function PracticeModeCard({ title, description, icon: Icon, route, image }) {
  return (
    <a
      href={route}
      className="group block p-6 bg-transparent dark:bg-transparent rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <div className="flex items-center gap-4">
        <Icon className="w-8 h-8 text-purple-600 group-hover:text-pink-600" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </a>
  );
}

export default function Index() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentText, setCurrentText] = useState("");
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0); // Track the current feedback index
  const textArray = [
    "Master Every Interview, Land Your Dream Job!"
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < textArray[0].length) {
        setCurrentText(textArray[0].substring(0, index + 1));
        index++;
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Loop through feedbacks every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) => (prevIndex + 3) % feedbacks.length); // Increment index by 3 and reset when it reaches end
    }, 3000); // Adjust the time for feedback transition
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 container py-12">
        {/* Feedback Section - Visible before "Get Started" is clicked */}
        
        {/* Main Content (Practice Modes) Section - Visible after "Get Started" is clicked */}
        {!showWelcome && (
          <div className="space-y-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
              {practiceModes.map((mode) => (
                <PracticeModeCard key={mode.title} {...mode} />
              ))}
            </div>
          </div>
        )}

        {/* Welcome Section - Visible only before "Get Started" is clicked */}
        {showWelcome && (
          <div className="flex flex-col md:flex-row items-center justify-between h-full space-y-6 md:space-y-0">
            <div className="md:w-1/2 text-left space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
                {currentText}
              </span>
              
            </h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. 
              </p>

              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
              >
                Get Started
              </button>
            </div>
            <div className="relative md:w-1/2">
              <img
                src="back.png"
                alt="Welcome"
                className="w-2/3 max-w-md rounded-lg shadow-lg animate-floating"
              />
            </div>
          </div>
        )}

        {/* Stats Section */}
        {showWelcome && (
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center bg-transparent p-6 rounded-lg shadow-md">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Users className="w-8 h-8 text-purple-600" /> {/* Icon for Trusted Users */}
                <h3 className="text-xl font-semibold text-purple-600 font-sans">Trusted Users</h3>
              </div>
              <p className="text-4xl text-gradient font-serif">1,240</p> {/* Font changed to serif */}
            </div>
            <div className="text-center bg-transparent p-6 rounded-lg shadow-md">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" /> {/* Icon for Available Materials */}
                <h3 className="text-xl font-semibold text-purple-600 font-sans">Available Materials</h3>
              </div>
              <p className="text-4xl text-gradient font-serif">158</p> {/* Font changed to serif */}
            </div>
            <div className="text-center bg-transparent p-6 rounded-lg shadow-md">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <FileText className="w-8 h-8 text-purple-600" /> {/* Icon for Text Questions */}
                <h3 className="text-xl font-semibold text-purple-600 font-sans">Text Questions</h3>
              </div>
              <p className="text-4xl text-gradient font-serif">120</p> {/* Font changed to serif */}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {showWelcome && (
          <div className="mt-12 space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {feedbacks.slice(currentFeedbackIndex, currentFeedbackIndex + 3).map((feedback, index) => (
                <div
                  key={index}
                  className="bg-transparent p-6 rounded-lg shadow-lg flex items-center space-x-4"
                >
                  <img
                    src={feedback.profileImage}
                    alt={feedback.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gradient">{feedback.message}</p>
                    <p className="text-lg font-semibold text-gradient">{feedback.name}</p>
                  </div>
                  <div className="ml-auto">{feedback.icon}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        
      </main>
      <Footer />

      <style>
        {`
          @keyframes floating {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-floating {
            animation: floating 4s ease-in-out infinite;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fadeIn 1s ease-in-out;
          }

          .text-gradient {
            background: linear-gradient(to right, #ff7c7c, #fbbf24, #8b5cf6);
            -webkit-background-clip: text;
            color: transparent;
          }
        `}
      </style>
    </div>
  );
}
