import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, CheckSquare, Target, MessageCircle, User, Bell, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: Users, label: "Team To-Do", path: "/dashboard/team" },
  { icon: CheckSquare, label: "My To-Do", path: "/dashboard/my-todos" },
  { icon: Target, label: "Goals", path: "/dashboard/goals" },
  { icon: MessageCircle, label: "Messages", path: "/dashboard/messages" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-secondary flex-col py-6 px-4 border-r border-border fixed h-full">
        <Link to="/" className="font-heading text-xl font-bold text-foreground px-3 mb-8">
          🌸 PinkNest
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-warm-sm"
                    : "text-foreground/70 hover:bg-accent/50"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-accent/50 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-secondary z-50 p-6 md:hidden"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading text-xl font-bold text-foreground">🌸 PinkNest</span>
                <button onClick={() => setSidebarOpen(false)} className="text-foreground/60">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "gradient-primary text-primary-foreground"
                          : "text-foreground/70 hover:bg-accent/50"
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md shadow-warm-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-foreground"
          >
            <Menu size={22} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {getUserInitials()}
              </div>
              <span className="text-sm font-semibold text-foreground hidden sm:inline">{user?.name || "User"}</span>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-5xl mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
