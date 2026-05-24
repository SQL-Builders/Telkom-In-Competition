import { ReactNode } from 'react';
import { Trophy, LayoutDashboard, Compass, FolderKanban, Bookmark, User, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { appPaths } from '../data/paths';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', path: appPaths.dashboard, icon: LayoutDashboard },
  { name: 'Explore Competitions', path: appPaths.explore, icon: Compass },
  { name: 'My Competitions', path: appPaths.myCompetitions, icon: FolderKanban },
  { name: 'Bookmarks', path: appPaths.bookmarks, icon: Bookmark },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { darkMode } = useTheme();

  const sidebarBg = darkMode ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-200';
  const navItemInactive = darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`fixed left-0 top-0 h-full w-64 border-r hidden lg:block ${sidebarBg}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate(appPaths.home)}>
            <div className="w-10 h-10 bg-[#C8102E] rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
              Telkom-In-<span className="text-[#C8102E]">Comp</span>
            </span>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-[#C8102E] text-white shadow-lg' : navItemInactive
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => navigate(appPaths.home)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${navItemInactive}`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
          <button
            onClick={() => { logout(); navigate(appPaths.home); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-50 flex items-center justify-between px-6 ${sidebarBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C8102E] rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
            Telkom-In-<span className="text-[#C8102E]">Comp</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={darkMode ? 'text-white' : 'text-gray-800'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className={`lg:hidden fixed inset-0 z-40 pt-20 px-6 ${darkMode ? 'bg-[#0F172A]' : 'bg-white'}`}
          >
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-[#C8102E] text-white' : navItemInactive
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
