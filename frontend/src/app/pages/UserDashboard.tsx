import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { Trophy, Calendar, TrendingUp, Clock, ArrowRight, Flame } from 'lucide-react';
import { CompetitionCard } from '../components/CompetitionCard';
import { useNavigate } from 'react-router';
import { useCompetitions, useMyCompetitions, useRecommendedCompetitions } from '../hooks/useCompetitions';
import { appPaths } from '../data/paths';
import { useAuth } from '../context/AuthContext';

export function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date();
  const { data: competitions, loading: loadingAll } = useCompetitions();
  const { data: myCompetitions, loading: loadingMy } = useMyCompetitions();
  const { data: recommendedCompetitions, loading: loadingRec } = useRecommendedCompetitions();
  
  const loading = loadingAll || loadingMy || loadingRec;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  const upcomingCompetitions = competitions.filter(
    (competition) => new Date(competition.deadline).getTime() >= today.getTime(),
  );
  const activeCompetitions = myCompetitions.filter(
    (competition) => competition.status !== 'university-rejected',
  );
  const completedCompetitions = myCompetitions.filter(
    (competition) => competition.status === 'national-reviewed',
  );
  const stats = [
    {
      label: 'Active Competitions',
      value: activeCompetitions.length.toString(),
      icon: Trophy,
      color: 'bg-blue-500',
      change: `${myCompetitions.length} tracked`,
    },
    {
      label: 'Upcoming Deadlines',
      value: upcomingCompetitions.length.toString(),
      icon: Calendar,
      color: 'bg-orange-500',
      change: upcomingCompetitions[0]
        ? `Next: ${new Date(upcomingCompetitions[0].deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : 'No upcoming deadline',
    },
    {
      label: 'Completed',
      value: completedCompetitions.length.toString(),
      icon: TrendingUp,
      color: 'bg-green-500',
      change: 'National stage done',
    },
    {
      label: 'Total Hours',
      value: '156',
      icon: Clock,
      color: 'bg-purple-500',
      change: 'Avg: 13h/month',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 lg:p-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#C8102E] to-[#E91E3A] rounded-2xl p-8 text-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">Welcome back, {user?.name ?? 'Student'}!</h1>
                <p className="text-white/90 text-lg mb-6">
                  You have {activeCompetitions.length} active competitions and {upcomingCompetitions.length} upcoming deadlines
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(appPaths.explore)}
                  className="px-6 py-3 bg-white text-[#C8102E] font-bold rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Explore New Competitions
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#333333] mb-1">{stat.value}</div>
                <div className="text-gray-600 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.change}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Recommended Competitions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#333333] mb-2">Recommended For You</h2>
              <p className="text-gray-600">Based on your interests and skills</p>
            </div>
            <button
              onClick={() => navigate(appPaths.explore)}
              className="text-[#C8102E] font-semibold hover:underline flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} {...competition} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 cursor-pointer"
          >
            <h3 className="text-xl font-bold text-[#333333] mb-2">Recent Activity</h3>
            <p className="text-gray-600 mb-4">Track your latest submissions and updates</p>
            <div className="space-y-3">
              {myCompetitions.slice(0, 3).map((competition) => (
                <div key={competition.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#C8102E] rounded-full"></div>
                  <span className="text-sm text-gray-700">{competition.title}</span>
                  <span className="text-xs text-gray-500 ml-auto">{competition.status.replaceAll('-', ' ')}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white cursor-pointer"
          >
            <h3 className="text-xl font-bold mb-2">Achievement Unlocked! 🎉</h3>
            <p className="text-white/90 mb-6">You've completed 10+ competitions this year</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-lg">Competition Master</div>
                <div className="text-white/80 text-sm">Keep up the great work!</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
