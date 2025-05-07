import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      <Navbar />

      <div className="flex">
        {isAuthenticated && <Sidebar />}

        <main className={`flex-1 p-4 ${isAuthenticated ? "md:ml-64" : ""}`}>
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
