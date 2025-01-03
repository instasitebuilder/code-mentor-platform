import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, DollarSign, Info, LogIn, HelpCircle, Plus, Minus, Grid, Bell, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import CompanyLogo from '@/assets/logo.jpg';

const navigationItems = [
  { 
    title: 'Home', 
    icon: Home, 
    url: '/' 
  },
  { 
    title: 'Dashboard', 
    icon: Grid, 
    url: '/dashboard' 
  },
  
  { 
    title: 'Community', 
    icon: Users, 
    url: '/community' 
  },
  { 
    title: 'Pricing', 
    icon: DollarSign, 
    url: '/pricing' 
  },
  { 
    title: 'About', 
    icon: Info, 
    url: '/about' 
  },
  { 
    title: 'Account Settings', 
    icon: Settings, 
    url: '/settings' 
  },
];


export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarContent className="flex flex-col flex-grow">
        {/* Company Logo and Name */}
        <div className="flex items-center p-4 space-x-3">
          <img src={CompanyLogo} alt="Company Logo" className="w-12 h-12 rounded-full" />
          <span className="text-xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-400 to-purple-500">
            CODEVITE
          </span>
        </div>

        <hr className="border-gray-300 dark:border-gray-700 my-2" />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)} className="flex items-center space-x-2">
                    <item.icon className="text-gray-500 dark:text-gray-300" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer to push footer items to the bottom */}
        <div className="flex-grow" />
      </SidebarContent>

      {/* Footer Actions */}
      <div className="px-4 py-2 border-t border-gray-300 dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={openModal} className="flex items-center space-x-2">
              <HelpCircle className="text-gray-500 dark:text-gray-300" />
              <span>Need Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user ? (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="flex items-center space-x-2">
                <LogIn className="text-gray-500 dark:text-gray-300" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate('/login')} className="flex items-center space-x-2">
                <LogIn className="text-gray-500 dark:text-gray-300" />
                <span>Login</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </div>

      {/* Help Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {predefinedQuestions.map((qa, index) => (
                <li key={index}>
                  <button
                    onClick={() => setExpandedQuestion(index === expandedQuestion ? null : index)}
                    className="flex items-center justify-between w-full text-left text-lg font-semibold p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span>{qa.question}</span>
                    {index === expandedQuestion ? (
                      <Minus className="text-gray-500 dark:text-gray-300" />
                    ) : (
                      <Plus className="text-gray-500 dark:text-gray-300" />
                    )}
                  </button>
                  {index === expandedQuestion && (
                    <div className="mt-2 text-gray-600 dark:text-gray-300">{qa.answer}</div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                onClick={() => navigate('/contact')}
                className="text-blue-500 hover:underline"
              >
                Contact Us
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Sidebar>
  );
}

const predefinedQuestions = [
  { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page and following the instructions.' },
  { question: 'How can I contact support?', answer: 'You can contact support by visiting our "Contact Us" page or sending an email to support@companyname.com.' },
];
