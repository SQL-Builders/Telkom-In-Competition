import { Search, BookMarked, Trophy, User, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
      darkMode ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center gap-12">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src="/assets/telyuuu.png" alt="logo" className="w-full h-full object-cover" />
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
                Telkom-In-<span className="text-[#C8102E]">Competition</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className={`hover:text-[#C8102E] transition-colors font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/explore')}
                className={`hover:text-[#C8102E] transition-colors font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}
              >
                Explore Competitions
              </button>

              {isLoggedIn && (
                <>
                  <button
                    onClick={() => navigate('/my-competitions')}
                    className={`hover:text-[#C8102E] transition-colors font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}
                  >
                    My Competitions
                  </button>
                  <button
                    onClick={() => navigate('/bookmarks')}
                    className={`hover:text-[#C8102E] transition-colors font-medium flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#333333]'}`}
                  >
                    <BookMarked className="w-4 h-4" />
                    Bookmark
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark / Light toggle */}
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-100 text-gray-700'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <>
                <div className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <User className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{user?.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                  className={`px-6 py-2.5 font-semibold rounded-lg transition-colors ${
                    darkMode ? 'text-white hover:bg-gray-800' : 'text-[#333333] hover:bg-gray-50'
                  }`}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/register')}
                  className="px-6 py-2.5 bg-[#C8102E] text-white font-semibold rounded-lg hover:bg-[#A00D25] transition-colors shadow-sm"
                >
                  Register
                </motion.button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}