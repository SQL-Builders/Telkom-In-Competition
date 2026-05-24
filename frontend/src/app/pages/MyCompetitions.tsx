import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle, AlertCircle, Eye, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import { myCompetitions, formatDaysLeft } from '../data/competitions';
import { appPaths } from '../data/paths';
import { useTheme } from '../context/ThemeContext';

const statusConfig = {
  'not-started': {
    label: 'Not Started',
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
  },
  'university-pending': {
    label: 'University Review',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  'university-approved': {
    label: 'University Approved',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  'university-rejected': {
    label: 'University Rejected',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
  },
  'national-submitted': {
    label: 'National Stage',
    color: 'bg-blue-100 text-blue-700',
    icon: CheckCircle,
  },
  'national-reviewed': {
    label: 'National Reviewed',
    color: 'bg-purple-100 text-purple-700',
    icon: Eye,
  },
};

export function MyCompetitions() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const cardBg = darkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-200';
  const headingColor = darkMode ? 'text-white' : 'text-[#333333]';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="p-6 lg:p-12">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-3 ${headingColor}`}>My Competitions</h1>
          <p className={`text-lg ${textMuted}`}>
            Track your progress and manage your competition entries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-2xl p-6 border ${cardBg}`}>
            <div className={`text-3xl font-bold mb-2 ${headingColor}`}>{myCompetitions.length}</div>
            <div className={textMuted}>Total Competitions</div>
          </div>
          <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
              {myCompetitions.filter(c => c.status === 'university-pending').length}
            </div>
            <div className={darkMode ? 'text-yellow-400' : 'text-yellow-700'}>Under Review</div>
          </div>
          <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'}`}>
            <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              {myCompetitions.filter(c => c.status === 'university-approved').length}
            </div>
            <div className={darkMode ? 'text-green-400' : 'text-green-700'}>Approved</div>
          </div>
          <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
            <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              {myCompetitions.filter(c => c.status === 'national-submitted' || c.status === 'national-reviewed').length}
            </div>
            <div className={darkMode ? 'text-blue-400' : 'text-blue-700'}>National Stage</div>
          </div>
        </div>

        {/* Competitions List */}
        <div className="space-y-4">
          {myCompetitions.map((competition) => {
            const status = statusConfig[competition.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            const daysLeft = Math.ceil((new Date(competition.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className={`rounded-2xl border p-6 hover:shadow-xl transition-all cursor-pointer ${cardBg}`}
                onClick={() => navigate(appPaths.competition(competition.id))}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#C8102E]/10 text-[#C8102E] rounded-lg text-sm font-semibold">
                        {competition.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {competition.stage}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold mb-3 ${headingColor}`}>
                      {competition.title}
                    </h3>

                    <div className={`flex flex-wrap gap-4 text-sm ${textMuted}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {new Date(competition.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      {competition.submittedDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Submitted: {new Date(competition.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                      {!competition.submittedDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className={daysLeft <= 7 ? 'text-red-600 font-semibold' : ''}>
                            {formatDaysLeft(competition.deadline)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {competition.status === 'not-started' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</span>
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{competition.progress}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className="bg-[#C8102E] h-2 rounded-full transition-all"
                            style={{ width: `${competition.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {competition.status === 'university-approved' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); navigate(appPaths.competitionReview(competition.id)); }}
                        className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Review
                      </motion.button>
                    )}
                    {competition.status === 'university-rejected' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); navigate(appPaths.competitionReview(competition.id)); }}
                        className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Review
                      </motion.button>
                    )}
                    {competition.status === 'not-started' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); navigate(appPaths.competitionProposal(competition.id)); }}
                        className="px-6 py-3 bg-[#C8102E] text-white font-semibold rounded-xl hover:bg-[#A00D25] transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Submit Proposal
                      </motion.button>
                    )}
                    {competition.status === 'university-approved' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); navigate(appPaths.competitionRegistration(competition.id)); }}
                        className="px-6 py-3 bg-[#C8102E] text-white font-semibold rounded-xl hover:bg-[#A00D25] transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Register National
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
