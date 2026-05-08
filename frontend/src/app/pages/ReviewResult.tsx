import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, ArrowLeft, FileText, Star, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

export function ReviewResult() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in real app, fetch based on competition id
  // Change status to 'rejected' to see the rejected view
  const isApproved = id === '1'; // Competition ID 1 is approved, others rejected

  const reviewResult = isApproved ? {
    competitionTitle: 'International UI/UX Design Competition 2026',
    teamName: 'Design Masters',
    submittedDate: '2026-05-10',
    reviewedDate: '2026-05-17',
    status: 'approved' as const,
    overallScore: 85,
    maxScore: 100,
    feedback: {
      strengths: [
        'Clear problem statement with strong user research backing',
        'Innovative solution approach with practical implementation',
        'Well-structured proposal with comprehensive documentation',
        'Strong team composition with complementary skills',
      ],
      improvements: [
        'Include more detailed timeline for project phases',
        'Add budget breakdown for resources needed',
        'Consider edge cases in the proposed solution',
      ],
    },
    scores: [
      { criteria: 'Innovation & Originality', score: 90, maxScore: 100 },
      { criteria: 'Problem Understanding', score: 88, maxScore: 100 },
      { criteria: 'Solution Feasibility', score: 82, maxScore: 100 },
      { criteria: 'Presentation Quality', score: 85, maxScore: 100 },
      { criteria: 'Team Composition', score: 80, maxScore: 100 },
    ],
    reviewerComments: 'Excellent proposal with strong potential. The team has demonstrated clear understanding of the problem domain and proposed an innovative solution. Looking forward to seeing the implementation in the national stage.',
    canProceedToNational: true,
  } : {
    competitionTitle: 'Data Science & AI Competition',
    teamName: 'Data Wizards',
    submittedDate: '2026-05-18',
    reviewedDate: '2026-05-20',
    status: 'rejected' as const,
    overallScore: 62,
    maxScore: 100,
    feedback: {
      strengths: [
        'Good initial concept and understanding of data science principles',
        'Team shows enthusiasm and willingness to learn',
      ],
      improvements: [
        'Proposal lacks sufficient technical depth and methodology details',
        'Missing clear data sources and validation strategy',
        'Timeline is unrealistic for the proposed scope',
        'Limited demonstration of team expertise in AI/ML',
        'Insufficient problem analysis and impact assessment',
      ],
    },
    scores: [
      { criteria: 'Innovation & Originality', score: 70, maxScore: 100 },
      { criteria: 'Problem Understanding', score: 55, maxScore: 100 },
      { criteria: 'Solution Feasibility', score: 50, maxScore: 100 },
      { criteria: 'Presentation Quality', score: 68, maxScore: 100 },
      { criteria: 'Team Composition', score: 67, maxScore: 100 },
    ],
    reviewerComments: 'While the team shows potential and good intentions, the proposal does not meet the minimum requirements for advancing to the national stage. The technical methodology is insufficiently detailed, and the feasibility assessment lacks depth. We encourage the team to strengthen their technical knowledge and reapply in future competitions with a more robust proposal.',
    canProceedToNational: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 lg:p-12">
        <button
          onClick={() => navigate('/my-competitions')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Competitions
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Status Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-8 mb-8 ${
              reviewResult.status === 'approved'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            } text-white`}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                {reviewResult.status === 'approved' ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {reviewResult.status === 'approved' ? 'Proposal Approved!' : 'Proposal Not Approved'}
                </h1>
                <p className="text-white/90 text-lg mb-4">
                  {reviewResult.competitionTitle}
                </p>
                {reviewResult.status === 'approved' ? (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      🎉 Selamat! Lolos Seleksi Universitas
                    </p>
                    <p className="text-sm text-white/90">
                      Proposal tingkat universitas Anda telah disetujui. Anda dapat melanjutkan ke tahap Nasional.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Tidak Lolos Seleksi Universitas
                    </p>
                    <p className="text-sm text-white/90">
                      Mohon maaf, proposal Anda belum memenuhi persyaratan untuk melanjutkan ke tahap Nasional. Silakan tinjau feedback di bawah untuk pengembangan di masa depan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Overall Score */}
          <div className={`bg-white rounded-2xl p-8 border-2 mb-6 ${
            reviewResult.status === 'approved'
              ? 'border-green-300 shadow-lg shadow-green-100'
              : 'border-red-300 shadow-lg shadow-red-100'
          }`}>
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Overall Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${
                  reviewResult.status === 'approved' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reviewResult.overallScore}
                  <span className="text-3xl text-gray-400">/{reviewResult.maxScore}</span>
                </div>
                <div className={`inline-block px-6 py-2 rounded-full font-bold text-white mb-3 ${
                  reviewResult.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {reviewResult.status === 'approved' ? '✓ LOLOS SELEKSI' : '✗ TIDAK LOLOS'}
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

            {/* Detailed Scores */}
            <div className="space-y-4">
              {reviewResult.scores.map((item, index) => (
                <div key={index}>
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
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Detailed Feedback</h2>

            {/* Strengths */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-[#333333]">Strengths</h3>
              </div>
              <div className="space-y-3">
                {reviewResult.feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-[#333333]">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {reviewResult.feedback.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviewer Comments */}
          <div className={`bg-white rounded-2xl p-8 border-2 mb-6 ${
            reviewResult.status === 'approved'
              ? 'border-green-200 bg-green-50/30'
              : 'border-red-200 bg-red-50/30'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className={`w-6 h-6 ${
                reviewResult.status === 'approved' ? 'text-green-600' : 'text-red-600'
              }`} />
              <h3 className="text-xl font-bold text-[#333333]">Catatan Reviewer</h3>
            </div>
            <div className={`rounded-xl p-6 border-l-4 ${
              reviewResult.status === 'approved'
                ? 'bg-white border-green-500'
                : 'bg-white border-red-500'
            }`}>
              <p className="text-gray-700 leading-relaxed font-medium">"{reviewResult.reviewerComments}"</p>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-[#333333] mb-4">Submission Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Team Name</p>
                <p className="font-semibold text-gray-900">{reviewResult.teamName}</p>
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
                <p className="text-sm text-gray-600 mb-1">Reviewed Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(reviewResult.reviewedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`font-semibold ${
                  reviewResult.status === 'approved' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reviewResult.status === 'approved' ? 'Approved' : 'Not Approved'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {reviewResult.canProceedToNational && reviewResult.status === 'approved' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/competition/${id}/register`)}
                className="flex-1 py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg"
              >
                Proceed to National Stage
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/my-competitions')}
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
