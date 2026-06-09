import { Navbar } from '../components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, CheckCircle, AlertCircle, Eye, Upload, FileText, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useMemo } from 'react';
import { useMyCompetitions } from '../hooks/useCompetitions';
import { appPaths } from '../data/paths';
import { formatDaysLeft } from '../data/competitions';

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
  const { data: myCompetitions, loading } = useMyCompetitions();
  const [viewingRegistration, setViewingRegistration] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 lg:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#333333] mb-3">My Competitions</h1>
          <p className="text-lg text-gray-600">
            Track your progress and manage your competition entries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-3xl font-bold text-[#333333] mb-2">{myCompetitions.length}</div>
            <div className="text-gray-600">Total Competitions</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700 mb-2">
              {myCompetitions.filter(c => c.status === 'university-pending').length}
            </div>
            <div className="text-yellow-700">Under Review</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-2">
              {myCompetitions.filter(c => c.status === 'university-approved').length}
            </div>
            <div className="text-green-700">Approved</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {myCompetitions.filter(c => c.status === 'national-submitted' || c.status === 'national-reviewed').length}
            </div>
            <div className="text-blue-700">National Stage</div>
          </div>
        </div>

        {/* Competitions List */}
        <div className="space-y-4">
          {myCompetitions.map((registration) => {
            const status = statusConfig[registration.status as keyof typeof statusConfig] || statusConfig['not-started'];
            const StatusIcon = status.icon;
            const comp = registration.competition;
            if (!comp) return null; // Safe guard
            
            const daysLeft = Math.ceil((new Date(comp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(appPaths.competition(comp.id))}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#C8102E]/10 text-[#C8102E] rounded-lg text-sm font-semibold">
                        {comp.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {registration.stage}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#333333] mb-3">
                      {comp.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {new Date(comp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      {registration.submittedDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Submitted: {new Date(registration.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                      {!registration.submittedDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className={daysLeft <= 7 ? 'text-red-600 font-semibold' : ''}>
                            {formatDaysLeft(comp.deadline)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {registration.status === 'not-started' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">Progress</span>
                          <span className="text-sm font-semibold text-gray-700">{registration.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#C8102E] h-2 rounded-full transition-all"
                            style={{ width: `${registration.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    {registration.status !== 'not-started' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingRegistration(registration);
                        }}
                        className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Submission
                      </motion.button>
                    )}

                    {registration.status === 'university-approved' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(appPaths.competitionReview(comp.id));
                        }}
                        className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Review
                      </motion.button>
                    )}
                    {registration.status === 'university-rejected' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(appPaths.competitionReview(comp.id));
                        }}
                        className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Review
                      </motion.button>
                    )}
                    {registration.status === 'not-started' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(appPaths.competitionProposal(comp.id));
                        }}
                        className="px-6 py-3 bg-[#C8102E] text-white font-semibold rounded-xl hover:bg-[#A00D25] transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Submit Proposal
                      </motion.button>
                    )}
                    {registration.status === 'university-approved' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(appPaths.competitionRegistration(comp.id));
                        }}
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
      {/* Submission Detail Modal */}
      <AnimatePresence>
        {viewingRegistration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-[#333333]">Submission Details</h2>
                <button
                  onClick={() => setViewingRegistration(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Competition</label>
                  <p className="text-lg text-[#333333]">
                    {viewingRegistration.competition?.title || viewingRegistration.competition?.nama_lomba || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <p className="text-gray-700 font-semibold">
                    {statusConfig[viewingRegistration.status as keyof typeof statusConfig]?.label || viewingRegistration.status}
                  </p>
                </div>

                {viewingRegistration.registrationData?.form_data && Object.keys(viewingRegistration.registrationData.form_data).length > 0 ? (
                  <div className="space-y-4 pt-2 border-t border-gray-100 mt-2">
                    <h3 className="font-bold text-[#333333] mb-2">Submitted Data</h3>
                    {Object.entries(viewingRegistration.registrationData.form_data).map(([key, value]) => {
                      const isUrl = typeof value === 'string' && value.startsWith('http');
                      return (
                        <div key={key}>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">{key}</label>
                          {isUrl ? (
                            <a href={value as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#C8102E] hover:underline bg-red-50 px-3 py-2 rounded-lg font-medium">
                              <FileText className="w-4 h-4" />
                              View / Download Document
                            </a>
                          ) : (
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg break-words">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mt-4">No custom form data found for this submission.</p>
                )}
                
                {viewingRegistration.registrationData?.data_berkas && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Legacy Attached Document</label>
                    <a href={viewingRegistration.registrationData.data_berkas.file_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#C8102E] hover:underline bg-red-50 px-3 py-2 rounded-lg font-medium">
                      <FileText className="w-4 h-4" />
                      {viewingRegistration.registrationData.data_berkas.nama_berkas || 'Download File'}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
