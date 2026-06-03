import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Share2,
  Trophy,
  Users,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { getCompetitionById } from '../data/competitions';
import { appPaths } from '../data/paths';

export function CompetitionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const competition = getCompetitionById(id);

  const [isDark, setIsDark] = useState(
  document.documentElement.classList.contains('dark')
);

useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => observer.disconnect();
}, []);
  if (!competition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#333333] mb-3">Competition Not Found</h1>
          <p className="text-gray-600 mb-8">The competition data is not available.</p>
          <button
            onClick={() => navigate(appPaths.explore)}
            className="px-6 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(competition.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white">
        <div className="bg-gradient-to-r from-[#C8102E] to-[#E91E3A] text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                    {competition.category}
                  </span>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                    {competition.level}
                  </span>
                  <span
                    className={`px-4 py-1.5 backdrop-blur-sm rounded-lg font-semibold ${
                      daysLeft <= 7 ? 'bg-red-500 text-white' : 'bg-white/20'
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {competition.title}
                </h1>

                <p className="text-xl text-white/90 mb-6 max-w-3xl">
                  {competition.description}
                </p>

                <div className="flex flex-wrap gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Deadline:{' '}
                      {new Date(competition.deadline).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{competition.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{competition.location}</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">About This Competition</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {competition.fullDescription}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">Competition Timeline</h2>
                <div className="space-y-4">
                  {competition.timeline.map((item, index) => (
                    <div key={`${item.date}-${item.event}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.stage === 'University' ? 'bg-blue-500' : 'bg-[#C8102E]'
                          }`}
                        >
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        {index < competition.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            item.stage === 'University'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.stage}
                        </span>
                        <div className="font-semibold text-[#333333] mt-2">{item.event}</div>
                        <div className="text-gray-600">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">Requirements</h2>
                <div className="space-y-3">
                  {competition.requirements.map((requirement) => (
                    <div key={requirement} className="flex gap-3 items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div
                className={`rounded-2xl p-6 sticky top-24 shadow-sm border ${
                  isDark
                    ? 'bg-[#1E293B] text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                <div className="mb-6">
                  <div className="text-3xl font-bold text-[#C8102E] mb-2">
                    {competition.prizes[0].split(' ')[0]}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Top Prize</div>
                </div>

                <div
                  className={`rounded-xl p-4 mb-4 border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-blue-50 border-blue-200'
                     }`}
                  >
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-blue-200' : 'text-blue-900'
                    }`}
                  >  
                    Competition Stages
                  </div>                
                  <div
                    className={`text-xs space-y-1 ${
                      isDark ? 'text-blue-300' : 'text-blue-800'
                    }`}
                  >
                    <div>1. Submit University Proposal</div>
                    <div>2. University Review (7-14 days)</div>
                    <div>3. If approved, continue to National Stage</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(appPaths.competitionProposal(competition.id))}
                  className="w-full py-4 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg mb-4"
                >
                  Submit University Proposal
                </motion.button>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Organizer</div>
                    <div className="font-semibold text-[#333333] dark:text-white">{competition.organizer}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Registration Deadline</div>
                    <div className="font-semibold text-[#333333] dark:text-white">
                      {new Date(competition.registrationDeadline).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border shadow-sm ${
                  isDark
                    ? 'bg-[#1E293B] border-gray-700 text-white'
                    : 'bg-yellow-50 border-yellow-200 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-bold">
                    Prizes
                  </h3>
                </div>

                <div className="space-y-2">
                  {competition.prizes.map((prize) => (
                    <div
                      key={prize}
                      className={`flex items-center gap-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>{prize}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border shadow-sm ${
                  isDark
                    ? 'bg-[#1E293B] border-gray-700 text-white'
                    : 'bg-green-50 border-green-200 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-100">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3
                    className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Join Our Community
                  </h3>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Bergabung dengan grup WhatsApp untuk update, diskusi, dan networking dengan peserta lain.
                </p>
                <motion.a
                  href={competition.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join WhatsApp Group
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
