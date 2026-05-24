import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Star, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { getCompetitionById, getReviewResultByCompetitionId } from '../data/competitions';
import { appPaths } from '../data/paths';
import { useTheme } from '../context/ThemeContext';

export function ReviewResult() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { darkMode } = useTheme();
  const competition = getCompetitionById(id);
  const reviewResult = getReviewResultByCompetitionId(id);

  const cardBg = darkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-200';
  const heading = darkMode ? 'text-white' : 'text-[#333333]';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textBody = darkMode ? 'text-gray-300' : 'text-gray-700';

  if (!competition || !reviewResult) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className={`text-3xl font-bold mb-3 ${heading}`}>Review Result Not Found</h1>
          <p className={`mb-8 ${textMuted}`}>No review result is available for this competition yet.</p>
          <button
            onClick={() => navigate(appPaths.myCompetitions)}
            className="px-6 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors"
          >
            Back to My Competitions
          </button>
        </div>
      </div>
    );
  }

  const approved = reviewResult.status === 'approved';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="p-6 lg:p-12">
        <button
          onClick={() => navigate(appPaths.myCompetitions)}
          className={`flex items-center gap-2 mb-8 transition-colors hover:text-[#C8102E] ${textMuted}`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Competitions
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-8 mb-8 ${
              approved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
            } text-white`}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                {approved ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {approved ? 'Proposal Approved!' : 'Proposal Not Approved'}
                </h1>
                <p className="text-white/90 text-lg mb-4">{competition.title}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    {approved ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {approved ? 'Lolos Seleksi Universitas' : 'Tidak Lolos Seleksi Universitas'}
                  </p>
                  <p className="text-sm text-white/90">
                    {approved
                      ? 'Proposal tingkat universitas Anda telah disetujui. Anda dapat melanjutkan ke tahap Nasional.'
                      : 'Proposal Anda belum memenuhi persyaratan untuk melanjutkan ke tahap Nasional. Silakan tinjau feedback di bawah.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Overall Score */}
          <div className={`rounded-2xl p-8 border-2 mb-6 ${
            approved
              ? darkMode ? 'bg-[#1E293B] border-green-700 shadow-lg shadow-green-900/20' : 'bg-white border-green-300 shadow-lg shadow-green-100'
              : darkMode ? 'bg-[#1E293B] border-red-800 shadow-lg shadow-red-900/20' : 'bg-white border-red-300 shadow-lg shadow-red-100'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${heading}`}>Overall Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${approved ? 'text-green-500' : 'text-red-500'}`}>
                  {reviewResult.overallScore}
                  <span className={`text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>/{reviewResult.maxScore}</span>
                </div>
                <div className={`inline-block px-6 py-2 rounded-full font-bold text-white mb-3 ${approved ? 'bg-green-500' : 'bg-red-500'}`}>
                  {approved ? 'LOLOS SELEKSI' : 'TIDAK LOLOS'}
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(reviewResult.overallScore / 20)
                          ? 'text-yellow-500 fill-yellow-500'
                          : darkMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {reviewResult.scores.map((item) => (
                <div key={item.criteria}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${textBody}`}>{item.criteria}</span>
                    <span className={`font-bold ${heading}`}>{item.score}/{item.maxScore}</span>
                  </div>
                  <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-3 rounded-full transition-all ${
                        item.score >= 70 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className={`rounded-2xl p-8 border mb-6 ${cardBg}`}>
            <h2 className={`text-2xl font-bold mb-6 ${heading}`}>Detailed Feedback</h2>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className={`text-xl font-bold ${heading}`}>Strengths</h3>
              </div>
              <div className="space-y-3">
                {reviewResult.feedback.strengths.map((strength) => (
                  <div key={strength} className={`flex items-start gap-3 p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-800/40' : 'bg-green-50'}`}>
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <p className={textBody}>{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <h3 className={`text-xl font-bold ${heading}`}>Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {reviewResult.feedback.improvements.map((improvement) => (
                  <div key={improvement} className={`flex items-start gap-3 p-4 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-800/40' : 'bg-orange-50'}`}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p className={textBody}>{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviewer Notes */}
          <div className={`rounded-2xl p-8 border-2 mb-6 ${
            approved
              ? darkMode ? 'bg-[#1E293B] border-green-700/50' : 'bg-green-50/30 border-green-200'
              : darkMode ? 'bg-[#1E293B] border-red-800/50' : 'bg-red-50/30 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className={`w-6 h-6 ${approved ? 'text-green-500' : 'text-red-500'}`} />
              <h3 className={`text-xl font-bold ${heading}`}>Catatan Reviewer</h3>
            </div>
            <div className={`rounded-xl p-6 border-l-4 ${
              approved ? 'border-green-500' : 'border-red-500'
            } ${darkMode ? 'bg-gray-800/60' : 'bg-white'}`}>
              <p className={`leading-relaxed font-medium ${textBody}`}>"{reviewResult.reviewerComments}"</p>
            </div>
          </div>

          {/* Submission Details */}
          <div className={`rounded-2xl p-8 border mb-6 ${cardBg}`}>
            <h3 className={`text-xl font-bold mb-4 ${heading}`}>Submission Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className={`text-sm mb-1 ${textMuted}`}>Team Name</p>
                <p className={`font-semibold ${heading}`}>{reviewResult.teamName}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${textMuted}`}>Competition</p>
                <p className={`font-semibold ${heading}`}>{competition.title}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${textMuted}`}>Submitted Date</p>
                <p className={`font-semibold ${heading}`}>
                  {new Date(reviewResult.submittedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${textMuted}`}>Status</p>
                <p className={`font-semibold ${approved ? 'text-green-500' : 'text-red-500'}`}>
                  {approved ? 'Approved' : 'Not Approved'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {reviewResult.canProceedToNational && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(appPaths.competitionRegistration(competition.id))}
                className="flex-1 py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg"
              >
                Proceed to National Stage
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(appPaths.myCompetitions)}
              className={`flex-1 py-4 font-bold text-lg rounded-xl transition-colors ${
                darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-[#333333] hover:bg-gray-200'
              }`}
            >
              Back to My Competitions
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
