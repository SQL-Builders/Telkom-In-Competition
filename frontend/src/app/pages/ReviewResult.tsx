import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Star, XCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { getCompetitionById, getReviewResultByCompetitionId } from '../data/competitions';
import { useCompetition } from '../hooks/useCompetitions';
import { competitionsApi } from '../api/competitionsApi';
import { appPaths } from '../data/paths';

export function ReviewResult() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use hook to fetch competition from database/API, fallback to mock helper
  const { competition: dbCompetition, loading: compLoading } = useCompetition(id);
  const staticCompetition = getCompetitionById(id);
  const competition = dbCompetition || staticCompetition;

  const [registration, setRegistration] = useState<any>(null);
  const [regLoading, setRegLoading] = useState(true);

  useEffect(() => {
    async function fetchRegistration() {
      if (!id) return;
      try {
        setRegLoading(true);
        const regs = await competitionsApi.getMyRegistrations();
        if (regs && Array.isArray(regs)) {
          // Find registration matching this competition ID
          const found = regs.find((r: any) => {
            const compId = r.competition?.id || r.registrationData?.id_lomba;
            return Number(compId) === Number(id);
          });
          setRegistration(found || null);
        }
      } catch (err) {
        console.error('Failed to fetch registration for ReviewResult', err);
      } finally {
        setRegLoading(false);
      }
    }
    fetchRegistration();
  }, [id]);

  const dbReview = registration?.registrationData?.form_data?._review_data;
  const cleanReview = dbReview 
    ? (dbReview.overallScore !== undefined ? { University: dbReview } : dbReview)
    : null;

  const availableStages = cleanReview 
    ? (Object.keys(cleanReview).filter(key => cleanReview[key] && typeof cleanReview[key] === 'object') as ('University' | 'National' | 'International')[])
    : [];

  const [activeStage, setActiveStage] = useState<'University' | 'National' | 'International'>('University');

  useEffect(() => {
    if (availableStages.length > 0) {
      if (availableStages.includes('International')) setActiveStage('International');
      else if (availableStages.includes('National')) setActiveStage('National');
      else setActiveStage('University');
    }
  }, [availableStages.length]);

  const staticReviewResult = getReviewResultByCompetitionId(id);

  if (compLoading || regLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
        </div>
      </div>
    );
  }

  let reviewResult = null;
  let statusStr = '';
  
  if (registration) {
    statusStr = registration.registrationData?.status_pendaftaran || registration.status || 'pending';
  }

  const isApproved = statusStr === 'accepted' || statusStr === 'approved' || statusStr === 'university-approved' || statusStr === 'national-reviewed';
  const isRejected = statusStr === 'rejected' || statusStr === 'university-rejected';

  if (registration && (isApproved || isRejected)) {
    if (cleanReview && cleanReview[activeStage]) {
      const activeStageReview = cleanReview[activeStage];
      const isStageApproved = (activeStage === 'University' && (registration.stage === 'National' || registration.stage === 'International' || isApproved)) ||
                              (activeStage === 'National' && (registration.stage === 'International' || isApproved)) ||
                              (activeStage === 'International' && isApproved) ||
                              (activeStageReview.overallScore >= 70);

      reviewResult = {
        competitionId: Number(id),
        teamName: registration.registrationData?.nama_tim || registration.team || 'My Team',
        submittedDate: registration.submittedDate || new Date().toISOString(),
        reviewedDate: activeStageReview.reviewedAt || registration.registrationData?.updated_at || new Date().toISOString(),
        status: isStageApproved ? 'approved' : 'rejected',
        overallScore: activeStageReview.overallScore || 0,
        maxScore: activeStageReview.maxScore || 100,
        feedback: activeStageReview.feedback || { strengths: [], improvements: [] },
        scores: activeStageReview.scores || [],
        reviewerComments: activeStageReview.reviewerComments || '',
        canProceedToNational: isStageApproved && activeStage === 'University',
      };
    } else {
      // Fallback: original mock review result if not reviewed by admin yet
      reviewResult = {
        competitionId: Number(id),
        teamName: registration.registrationData?.nama_tim || registration.team || 'My Team',
        submittedDate: registration.submittedDate || new Date().toISOString(),
        reviewedDate: registration.registrationData?.updated_at || new Date().toISOString(),
        status: isApproved ? 'approved' : 'rejected',
        overallScore: isApproved ? 85 : 62,
        maxScore: 100,
        feedback: isApproved ? {
          strengths: [
            'Problem statement is clear and well-defined',
            'The proposed solution is innovative and practical',
            'Strong presentation of ideas and methodology',
          ],
          improvements: [
            'Refine the implementation timeline',
            'Provide more details on resource requirements',
          ]
        } : {
          strengths: [
            'Good core concept and user understanding',
          ],
          improvements: [
            'Insufficient technical depth and details on implementation',
            'Unrealistic project timeline',
            'Need to clarify key feature benefits',
          ]
        },
        scores: isApproved ? [
          { criteria: 'Innovation & Originality', score: 90, maxScore: 100 },
          { criteria: 'Problem Understanding', score: 88, maxScore: 100 },
          { criteria: 'Solution Feasibility', score: 82, maxScore: 100 },
          { criteria: 'Presentation Quality', score: 85, maxScore: 100 },
          { criteria: 'Team Composition', score: 80, maxScore: 100 },
        ] : [
          { criteria: 'Innovation & Originality', score: 70, maxScore: 100 },
          { criteria: 'Problem Understanding', score: 55, maxScore: 100 },
          { criteria: 'Solution Feasibility', score: 50, maxScore: 100 },
          { criteria: 'Presentation Quality', score: 68, maxScore: 100 },
          { criteria: 'Team Composition', score: 67, maxScore: 100 },
        ],
        reviewerComments: isApproved
          ? 'Excellent work! The proposal is well-written, demonstrates a strong understanding of the user needs, and details a clear implementation strategy. Approved to proceed to the National stage.'
          : 'The proposal lacks detailed implementation steps and clear validation metrics. Please review the feedback and improve these areas for future applications.',
        canProceedToNational: isApproved,
      };
    }
  }

  // If we still don't have reviewResult but have staticReviewResult (e.g. static view)
  if (!reviewResult) {
    reviewResult = staticReviewResult;
  }

  // If status is pending or under_review, show Review in Progress UI
  if (registration && (statusStr === 'pending' || statusStr === 'under_review' || statusStr === 'university-pending' || statusStr === 'national-submitted')) {
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
          
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-[#333333] mb-3">Review in Progress</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Proposal Anda untuk kompetisi <strong>{competition?.title || 'ini'}</strong> sedang direview oleh tim juri universitas. Hasil review akan diumumkan setelah proses penilaian selesai.
            </p>
            <button
              onClick={() => navigate(appPaths.myCompetitions)}
              className="px-6 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors w-full sm:w-auto"
            >
              Kembali ke My Competitions
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {availableStages.length > 1 && (
            <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-fit">
              {availableStages.map((stg) => (
                <button
                  key={stg}
                  onClick={() => setActiveStage(stg)}
                  className={`px-5 py-2.5 rounded-lg font-bold transition-all text-sm ${
                    activeStage === stg
                      ? 'bg-[#C8102E] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {stg} Stage Review
                </button>
              ))}
            </div>
          )}

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
