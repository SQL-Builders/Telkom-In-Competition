import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { Upload, File, X, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { getCompetitionById } from '../data/competitions';
import { appPaths } from '../data/paths';

export function UniversityProposal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const competition = getCompetitionById(id);
  const [files, setFiles] = useState<Array<{ name: string; size: number; type: string }>>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    teamName: '',
    teamMembers: '',
    institution: 'Telkom University',
    contactEmail: '',
    phoneNumber: '',
    projectTitle: '',
    projectDescription: '',
    problemStatement: '',
    proposedSolution: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('uploading');

    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!competition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#333333] mb-3">Competition Not Found</h1>
          <p className="text-gray-600 mb-8">The proposal form is not available for this competition.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 lg:p-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Competition
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Tahap Universitas - Proposal Submission</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Ini adalah tahap seleksi tingkat Telkom University. Proposal Anda akan direview oleh tim juri universitas.
                </p>
                <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                  <li>Jika proposal <strong>disetujui</strong>, Anda dapat melanjutkan ke tahap Nasional</li>
                  <li>Jika proposal <strong>ditolak</strong>, Anda tidak dapat melanjutkan ke tahap Nasional</li>
                  <li>Hasil review akan tersedia dalam 7-14 hari kerja</li>
                </ul>
              </div>
            </div>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-12 text-center border border-gray-200"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#333333] mb-4">Proposal Submitted!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Your university-level proposal has been successfully submitted for review.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-[#333333] mb-3">What's Next?</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ Your proposal will be reviewed by university judges</p>
                  <p>✓ Review results will be available in 7-14 business days</p>
                  <p>✓ You'll receive an email notification when results are ready</p>
                  <p>✓ Check "My Competitions" to track your submission status</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(appPaths.myCompetitions)}
                  className="px-8 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors"
                >
                  Go to My Competitions
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => competition && navigate(appPaths.competition(competition.id))}
                  className="px-8 py-3 bg-gray-100 text-[#333333] font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back to Competition
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#333333] mb-2">Submit University Proposal</h1>
                <p className="text-gray-600">
                  Complete the form below to submit your proposal for {competition?.title ?? 'this competition'}
                </p>
              </div>

              {/* Team Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#333333] mb-4">Team Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      placeholder="Enter team name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      placeholder="team@telkomuniversity.ac.id"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Members <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                    rows={3}
                    placeholder="List all team members (max 3 members)"
                  />
                </div>
              </div>

              {/* Project Proposal */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#333333] mb-4">Project Proposal</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      placeholder="Enter your project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Problem Statement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      rows={4}
                      placeholder="Describe the problem you are trying to solve"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Proposed Solution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.proposedSolution}
                      onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      rows={6}
                      placeholder="Explain your proposed solution in detail"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      rows={5}
                      placeholder="Provide a comprehensive description of your project"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#333333] mb-4">Supporting Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#C8102E] transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Upload proposal document (PDF, max 10MB)
                  </p>
                  <label className="cursor-pointer">
                    <span className="px-6 py-3 bg-[#C8102E] text-white font-semibold rounded-xl hover:bg-[#A00D25] transition-colors inline-block">
                      Choose Files
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Accepted: PDF, DOC, DOCX</p>
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-[#C8102E]" />
                          <div>
                            <p className="font-medium text-gray-700">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'uploading'}
                  className="w-full py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'uploading' ? 'Submitting Proposal...' : 'Submit University Proposal'}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
