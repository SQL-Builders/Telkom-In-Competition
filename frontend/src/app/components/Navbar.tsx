import {Search,BookMarked,Trophy,User, LogOut, Moon,Sun, Bell} from 'lucide-react'; 
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { competitionsApi } from '../api/competitionsApi';

import { useState, useEffect } from 'react';

export function Navbar() {

  const navigate = useNavigate();

  const { isLoggedIn, user, logout } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function checkNotifications() {
      try {
        const regs = await competitionsApi.getMyRegistrations();
        if (regs && Array.isArray(regs)) {
          const readList = JSON.parse(localStorage.getItem('telkom-in:read-notifications') || '[]');
          
          const notifs = regs
            .filter((r: any) => {
              const status = r.registrationData?.status_pendaftaran || r.status || 'pending';
              return status === 'accepted' || status === 'approved' || status === 'rejected' || status === 'university-approved' || status === 'university-rejected';
            })
            .map((r: any) => {
              const compTitle = r.competition?.title || 'Kompetisi';
              const status = r.registrationData?.status_pendaftaran || r.status || 'pending';
              const isApproved = status === 'accepted' || status === 'approved' || status === 'university-approved';
              const stage = r.stage || r.registrationData?.stage || 'University';
              const id = r.competition?.id || r.registrationData?.id_lomba;
              
              const notifId = `${id}-${status}-${stage}`;
              
              return {
                id: notifId,
                compId: id,
                title: compTitle,
                stage,
                isApproved,
                read: readList.includes(notifId),
                date: r.registrationData?.updated_at || new Date().toISOString()
              };
            });
          setNotifications(notifs);
        }
      } catch (err) {
        console.error('Error fetching notifications in Navbar', err);
      }
    }

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleNotificationClick = (notif: any) => {
    const readList = JSON.parse(localStorage.getItem('telkom-in:read-notifications') || '[]');
    if (!readList.includes(notif.id)) {
      readList.push(notif.id);
      localStorage.setItem('telkom-in:read-notifications', JSON.stringify(readList));
    }
    
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setShowNotifications(false);
    navigate(`/competition/${notif.compId}/review-result`);
  };

  const handleMarkAllAsRead = () => {
    const readList = notifications.map(n => n.id);
    localStorage.setItem('telkom-in:read-notifications', JSON.stringify(readList));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ========================== DARK MODE ==========================
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const toggleDarkMode = () => {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {

      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');

    } else {

      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');

    }
  };

  const handleLogout = () => {

    logout();
    navigate('/');

  };

  return (

    <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
      darkMode
        ? 'bg-[#0F172A] border-gray-800'
        : 'bg-white border-gray-200'
    }`}>

      <div className="mx-auto px-6 lg:px-12">

        <div className="flex items-center justify-between h-20">

          <div className="flex items-center gap-12">

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >

             <div className="w-10 h-10 rounded-lg overflow-hidden">

                <img
                  src="/assets/telyuuu.png"
                  alt="logo"
                  className="w-full h-full object-cover"
                />

              </div>

              <span className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-[#333333]'
              }`}>

                Telkom-In-
                <span className="text-[#C8102E]">
                  Competition
                </span>

              </span>

            </div>

            <div className="hidden lg:flex items-center gap-8">

              <button
                onClick={() => navigate('/')}
                className={`hover:text-[#C8102E] transition-colors font-medium ${
                  darkMode ? 'text-white' : 'text-[#333333]'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => navigate('/explore')}
                className={`hover:text-[#C8102E] transition-colors font-medium ${
                  darkMode ? 'text-white' : 'text-[#333333]'
                }`}
              >
                Explore Competitions
              </button>

              {isLoggedIn && (
                <>
                  <button
                    onClick={() => navigate('/my-competitions')}
                    className={`hover:text-[#C8102E] transition-colors font-medium ${
                      darkMode ? 'text-white' : 'text-[#333333]'
                    }`}
                  >
                    My Competitions
                  </button>

                  <button
                    onClick={() => navigate('/bookmarks')}
                    className={`hover:text-[#C8102E] transition-colors font-medium flex items-center gap-2 ${
                      darkMode ? 'text-white' : 'text-[#333333]'
                    }`}
                  >

                    <BookMarked className="w-4 h-4" />

                    Bookmark

                  </button>
                </>
              )}

            </div>

          </div>

          <div className="flex items-center gap-4">

            {/* ========================== NOTIFICATION BELL ========================== */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative ${
                    darkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-xl border overflow-hidden z-50 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-[#1E293B] border-gray-700 text-white' 
                      : 'bg-white border-gray-100 text-[#333333]'
                  }`}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <span className="font-bold">Notifications</span>
                      {notifications.some(n => !n.read) && (
                        <button 
                          onClick={handleMarkAllAsRead} 
                          className="text-xs text-[#C8102E] font-semibold hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/50">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 text-sm cursor-pointer transition-colors flex items-start gap-3 ${
                              n.read 
                                ? (darkMode ? 'hover:bg-slate-800/55' : 'hover:bg-gray-50') 
                                : (darkMode ? 'bg-slate-800/40 hover:bg-slate-800/60' : 'bg-red-50/30 hover:bg-red-50/50')
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                              n.read ? 'bg-transparent' : 'bg-[#C8102E]'
                            }`} />
                            <div className="flex-1">
                              <p className={`font-semibold ${n.read ? 'text-gray-400' : ''}`}>
                                Proposal {n.isApproved ? 'Lolos' : 'Tidak Lolos'}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                Proposal untuk {n.title} ({n.stage} Stage) telah selesai dinilai.
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================== DARK MODE BUTTON ========================== */}
            <button
              onClick={toggleDarkMode}

              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >

              {darkMode ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}

            </button>

            {isLoggedIn ? (
              <>
                <div className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>

                  <User className={`w-5 h-5 ${
                    darkMode ? 'text-white' : 'text-gray-600'
                  }`} />

                  <span className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>

                    {user?.name}

                  </span>

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
                    darkMode
                      ? 'text-white hover:bg-gray-800'
                      : 'text-[#333333] hover:bg-gray-50'
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