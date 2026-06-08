import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Star, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { getCompetitionById, getReviewResultByCompetitionId } from '../data/competitions';
import { appPaths } from '../data/paths';

export function ReviewResult() {
  const navigate = useNavigate();
  const { id } = useParams();
  const competition = getCompetitionById(id);
  const reviewResult = getReviewResultByCompetitionId(id);

  if (!competition || !reviewResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#333333] mb-3">Review Result Not Found</h1>
          <p className="text-gray-600 mb-8">No review result is available for this competition yet.</p>
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 lg:p-12">
        <button
          onClick={() => navigate(appPaths.myCompetitions)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Competitions
        </button>

        <div className="max-w-4xl mx-auto">
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

          <div
            className={`bg-white rounded-2xl p-8 border-2 mb-6 ${
              approved ? 'border-green-300 shadow-lg shadow-green-100' : 'border-red-300 shadow-lg shadow-red-100'
            }`}
          >
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Overall Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${approved ? 'text-green-600' : 'text-red-600'}`}>
                  {reviewResult.overallScore}
                  <span className="text-3xl text-gray-400">/{reviewResult.maxScore}</span>
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
                          : 'text-gray-300'
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
                    <span className="font-semibold text-gray-700">{item.criteria}</span>
                    <span className="font-bold text-[#333333]">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
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

          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Detailed Feedback</h2>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-[#333333]">Strengths</h3>
              </div>
              <div className="space-y-3">
                {reviewResult.feedback.strengths.map((strength) => (
                  <div key={strength} className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-[#333333]">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {reviewResult.feedback.improvements.map((improvement) => (
                  <div key={improvement} className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl p-8 border-2 mb-6 ${approved ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className={`w-6 h-6 ${approved ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className="text-xl font-bold text-[#333333]">Catatan Reviewer</h3>
            </div>
            <div className={`rounded-xl p-6 border-l-4 bg-white ${approved ? 'border-green-500' : 'border-red-500'}`}>
              <p className="text-gray-700 leading-relaxed font-medium">"{reviewResult.reviewerComments}"</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-[#333333] mb-4">Submission Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Team Name</p>
                <p className="font-semibold text-gray-900">{reviewResult.teamName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Competition</p>
                <p className="font-semibold text-gray-900">{competition.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(reviewResult.submittedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`font-semibold ${approved ? 'text-green-600' : 'text-red-600'}`}>
                  {approved ? 'Approved' : 'Not Approved'}
                </p>
              </div>
            </div>
          </div>

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
              className="flex-1 py-4 bg-gray-100 text-[#333333] font-bold text-lg rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to My Competitions
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
