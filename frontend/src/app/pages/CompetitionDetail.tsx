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
import { useCompetition } from '../hooks/useCompetitions';
import { appPaths } from '../data/paths';
import { bookmarksApi } from '../api/bookmarksApi';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'telkom-in:bookmarks';

export function CompetitionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { competition, loading } = useCompetition(id);

  // Bookmark state — initialize from localStorage
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const stored: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return stored.includes(Number(id));
    } catch { return false; }
  });
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // If user is logged in, sync bookmark state from backend
  useEffect(() => {
    if (user && id) {
      bookmarksApi.checkBookmark(id).then(val => setIsBookmarked(val)).catch(() => {});
    }
  }, [user, id]);

  const handleBookmark = async () => {
    if (bookmarkLoading) return;
    const newVal = !isBookmarked;
    setIsBookmarked(newVal);

    // Update localStorage
    try {
      const stored: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const updated = newVal
        ? [...stored.filter(i => i !== Number(id)), Number(id)]
        : stored.filter(i => i !== Number(id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Update localStorage timestamp map
      const tsKey = 'telkom-in:bookmark-dates';
      const dates: Record<string, string> = JSON.parse(localStorage.getItem(tsKey) || '{}');
      if (newVal) dates[String(id)] = new Date().toISOString();
      else delete dates[String(id)];
      localStorage.setItem(tsKey, JSON.stringify(dates));
    } catch {}

    // Sync to backend if logged in
    if (user) {
      setBookmarkLoading(true);
      try {
        await bookmarksApi.toggleBookmark(Number(id));
      } catch (err) {
        console.error('Bookmark sync failed:', err);
        // Revert if backend fails
        setIsBookmarked(!newVal);
      } finally {
        setBookmarkLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

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

  const timeline: any[] = competition.timeline || [];
  const requirements: string[] = competition.requirements || [];
  const hadiah: string = (competition as any).hadiah || '';

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
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
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
            {/* Left column — main content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">About This Competition</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {competition.fullDescription || competition.description}
                </div>
              </section>

              {/* Timeline */}
              {timeline.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-[#333333] mb-4">Competition Timeline</h2>
                  <div className="space-y-4">
                    {timeline.map((item: any, index: number) => (
                      <div key={`${item.date}-${index}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.stage === 'University' ? 'bg-blue-500' : 'bg-[#C8102E]'
                            }`}
                          >
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          {item.stage && (
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                item.stage === 'University'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              }`}
                            >
                              {item.stage}
                            </span>
                          )}
                          <div className="font-semibold text-[#333333] mt-2">{item.event}</div>
                          {item.date && (
                            <div className="text-gray-600">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-[#333333] mb-4">Requirements</h2>
                  <div className="space-y-3">
                    {requirements.map((req: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Submit & Info card */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                {/* Top Prize */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-[#C8102E] mb-1">
                    {hadiah ? hadiah.split(',')[0].trim() : 'TBA'}
                  </div>
                  <div className="text-gray-600 text-sm">Top Prize</div>
                  {hadiah && <div className="text-gray-700 mt-1 text-sm">{hadiah}</div>}
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-900/30">
                  <div className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Competition Stages</div>
                  <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                    <div>1. Submit Proposal</div>
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
                  Submit Proposal
                </motion.button>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Organizer</div>
                    <div className="font-semibold text-[#333333]">{competition.organizer || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Deadline</div>
                    <div className="font-semibold text-[#333333]">
                      {new Date(competition.deadline).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Level</div>
                    <div className="font-semibold text-[#333333]">{competition.level}</div>
                  </div>
                  {(competition as any).biaya !== undefined && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Registration Fee</div>
                      <div className="font-semibold text-[#333333]">
                        {(competition as any).biaya === 0 
                          ? 'Free' 
                          : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format((competition as any).biaya)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Prizes */}
              {hadiah && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-yellow-200 dark:border-amber-900/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="font-bold text-[#333333]">Hadiah</h3>
                  </div>
                  <div className="space-y-2">
                    {hadiah.split(',').map((prize: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                        <span>{prize.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Group */}
              {competition.whatsappGroup && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border border-green-200 dark:border-green-900/30">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h3 className="font-bold text-[#333333]">Join Our Community</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Bergabung dengan grup WhatsApp untuk update, diskusi, dan networking dengan peserta lain.
                  </p>
                  <motion.a
                    href={competition.whatsappGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-green-500 dark:bg-green-600 text-white font-bold rounded-xl hover:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Join WhatsApp Group
                  </motion.a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
