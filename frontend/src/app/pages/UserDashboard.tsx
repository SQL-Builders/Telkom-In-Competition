import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { Trophy, Calendar, TrendingUp, Clock, ArrowRight, Flame } from 'lucide-react';
import { CompetitionCard } from '../components/CompetitionCard';

const stats = [
  {
    label: 'Active Competitions',
    value: '3',
    icon: Trophy,
    color: 'bg-blue-500',
    change: '+2 this month',
  },
  {
    label: 'Upcoming Deadlines',
    value: '5',
    icon: Calendar,
    color: 'bg-orange-500',
    change: 'Next: 3 days',
  },
  {
    label: 'Completed',
    value: '12',
    icon: TrendingUp,
    color: 'bg-green-500',
    change: '+4 this year',
  },
  {
    label: 'Total Hours',
    value: '156',
    icon: Clock,
    color: 'bg-purple-500',
    change: 'Avg: 13h/month',
  },
];

const recommendedCompetitions = [
  {
    id: 1,
    title: 'UI/UX Design Sprint 2026',
    description: 'Design innovative interfaces for mobile applications',
    category: 'UI/UX',
    deadline: '2026-05-15',
    level: 'National',
    participants: 847,
    image: '',
  },
  {
    id: 2,
    title: 'Web Development Challenge',
    description: 'Build a full-stack web application in 48 hours',
    category: 'IT',
    deadline: '2026-04-30',
    level: 'International',
    participants: 1203,
    image: '',
  },
  {
    id: 3,
    title: 'Data Analytics Competition',
    description: 'Analyze datasets and create actionable insights',
    category: 'Data Science',
    deadline: '2026-05-20',
    level: 'National',
    participants: 654,
    image: '',
  },
];

export function UserDashboard() {
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
                <h1 className="text-4xl font-bold mb-3">Welcome back, John! 👋</h1>
                <p className="text-white/90 text-lg mb-6">
                  You have 3 active competitions and 5 upcoming deadlines
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
            <button className="text-[#C8102E] font-semibold hover:underline flex items-center gap-2">
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
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Submitted: UI/UX Challenge</span>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Registered: Hackathon 2026</span>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Deadline: Business Case</span>
                <span className="text-xs text-gray-500 ml-auto">3 days left</span>
              </div>
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
