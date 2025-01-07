import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome to DevOps Learning</h1>
      <p className="mt-4 text-lg">Your journey to mastering DevOps starts here.</p>
      <div className="mt-8">
        <Link to="/login" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/signup" className="ml-4 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
          Sign Up
        </Link>
      </div>
      <style>
        {`
          .gradient-text {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
