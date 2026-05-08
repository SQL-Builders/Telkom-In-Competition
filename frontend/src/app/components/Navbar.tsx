import { Search, BookMarked, User, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                  {/* <div className="w-10 h-10 bg-[#C8102E] rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div> */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img
                        src="/assets/telyuuu.png"
                        alt="logo"
                        className="w-full h-full object-cover"
                    />
                    </div>
                <span className="text-xl font-bold text-[#333333]">
                Telkom-In-<span className="text-[#C8102E]">Competition</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => navigate('/')} className="text-[#333333] hover:text-[#C8102E] transition-colors font-medium">
                Home
              </button>
              <button onClick={() => navigate('/explore')} className="text-[#333333] hover:text-[#C8102E] transition-colors font-medium">
                Explore Competitions
              </button>
              {isLoggedIn && (
                <>
                  <button onClick={() => navigate('/my-competitions')} className="text-[#333333] hover:text-[#C8102E] transition-colors font-medium">
                    My Competitions
                  </button>
                  <button onClick={() => navigate('/bookmarks')} className="text-[#333333] hover:text-[#C8102E] transition-colors font-medium flex items-center gap-2">
                    <BookMarked className="w-4 h-4" />
                    Bookmark
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">{user?.name}</span>
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
                  className="px-6 py-2.5 text-[#333333] font-semibold hover:bg-gray-50 rounded-lg transition-colors"
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
