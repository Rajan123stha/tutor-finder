import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  MessageSquare,
  ShieldCheck,
  BookmarkCheck,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  text,
  active,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  // If no user, don't show sidebar
  if (!user) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed mt-6">
      <div className="flex flex-col h-full p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">TutorConnectPro</h2>
          <p className="text-sm text-gray-500 mt-1">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem
            to="/dashboard"
            icon={<Home size={20} />}
            text="Dashboard"
            active={pathname === "/dashboard"}
          />

          <SidebarItem
            to="/profile"
            icon={<User size={20} />}
            text="My Profile"
            active={pathname === "/profile"}
          />

          {user.role === "student" && (
            <>
              <SidebarItem
                to="/tutors"
                icon={<Users size={20} />}
                text="Find Tutors"
                active={pathname.startsWith("/tutors")}
              />
              <SidebarItem
                to="/requests"
                icon={<BookOpen size={20} />}
                text="My Requests"
                active={pathname === "/requests"}
              />
              <SidebarItem
                to="/bookings"
                icon={<Calendar size={20} />}
                text="My Bookings"
                active={pathname === "/bookings"}
              />
            </>
          )}

          {user.role === "tutor" && (
            <>
              <SidebarItem
                to="/requests/tutor"
                icon={<BookOpen size={20} />}
                text="Tuition Requests"
                active={pathname === "/requests/tutor"}
              />
              <SidebarItem
                to="/bookings"
                icon={<Calendar size={20} />}
                text="Active Bookings"
                active={pathname === "/bookings"}
              />
            </>
          )}

          {user.role === "admin" && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                  Admin Controls
                </p>
              </div>
              <SidebarItem
                to="/admin/users"
                icon={<Users size={20} />}
                text="Users Management"
                active={pathname === "/admin/users"}
              />
              <SidebarItem
                to="/admin/requests"
                icon={<BookmarkCheck size={20} />}
                text="Request Management"
                active={pathname === "/admin/requests"}
              />
            </>
          )}
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
