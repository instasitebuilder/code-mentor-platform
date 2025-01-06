import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminRoute } from "@/components/AdminRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Services from "./pages/Services";
import Topics from "./pages/Topics";
import TopicQuestions from "./pages/TopicQuestions";
import SolvePage from "./pages/SolvePage";
import PeerPractice from "./pages/PeerPractice";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import TeamCoding from "./pages/TeamCoding";
import DevOpsPractice from "./pages/DevOpsPractice";
import HRInterview from "./pages/HRInterview";
import HRInterviewSession from "./pages/HRInterviewSession";
import Admin from "./pages/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route 
                      path="/self-practice" 
                      element={
                        <ProtectedRoute>
                          <Topics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/topic/:id" 
                      element={
                        <ProtectedRoute>
                          <TopicQuestions />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/solve/:id" 
                      element={
                        <ProtectedRoute>
                          <SolvePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/peer-practice" 
                      element={
                        <ProtectedRoute>
                          <PeerPractice />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/peer-practice/:sessionId" 
                      element={
                        <ProtectedRoute>
                          <SolvePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/team-coding" 
                      element={
                        <ProtectedRoute>
                          <TeamCoding />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/community" 
                      element={
                        <ProtectedRoute>
                          <Community />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route 
                      path="/devops-practice" 
                      element={
                        <ProtectedRoute>
                          <DevOpsPractice />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/hr-interview" 
                      element={
                        <ProtectedRoute>
                          <HRInterview />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/hr-interview/:id" 
                      element={
                        <ProtectedRoute>
                          <HRInterviewSession />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      } 
                    />
                  </Routes>
                </main>
              </div>
              <Toaster />
              <Sonner />
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
