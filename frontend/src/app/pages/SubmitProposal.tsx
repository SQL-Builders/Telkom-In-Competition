import { Navbar } from '../components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, X, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState, useMemo, useEffect } from 'react';
import { useCompetition } from '../hooks/useCompetitions';
import { competitionsApi } from '../api/competitionsApi';
import { appPaths } from '../data/paths';
import { useAuth } from '../context/AuthContext';

type FieldType = 'text' | 'textarea' | 'file' | 'select' | 'number' | 'date' | 'email' | 'url' | 'checkbox';

interface ProposalField {
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for select type
  allowedFormats?: string[]; // for file type
}


export function SubmitProposal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { competition, loading } = useCompetition(id);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  // Use only custom proposal fields from competition
  const proposalFields: ProposalField[] = [
    ...((competition as any)?.proposalFields || []),
  ];

  const handleFieldChange = (label: string, value: any) => {
    setFieldValues(prev => ({ ...prev, [label]: value }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competition || !user) return;
    setStatus('submitting');
    setErrorMsg('');
    try {
      let berkasId: number | undefined;
      const finalFormValues = { ...fieldValues };

      // Upload files first if there are any file fields
      const { apiClient } = await import('../api/client');
      for (const [key, value] of Object.entries(finalFormValues)) {
        if (value instanceof window.File) {
          const formData = new FormData();
          formData.append('file', value);
          const userName = user?.name || user?.nama_lengkap || 'User';
          formData.append('prefix', `Proposal_${competition.title}_${userName}`);
          const uploadRes = await apiClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          // Use the first file to populate id_berkas if not set yet
          if (!berkasId) {
            berkasId = uploadRes.data?.data?.id_data_berkas;
          }
          
          // Save the file path in form_data JSON
          finalFormValues[key] = uploadRes.data?.data?.file_path || uploadRes.data?.data?.url;
        }
      }

      // Submit registration
      await competitionsApi.register(competition.id, {
        ...(berkasId && { id_berkas: berkasId }),
        form_data: finalFormValues,
      });
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.response?.data?.message || 'Gagal submit proposal. Silakan coba lagi.');
      console.error('Submit proposal error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

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
                <h3 className="font-bold text-blue-900 mb-2">Submit Proposal — {competition.title}</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Proposal Anda akan direview oleh tim juri universitas setelah disubmit.
                </p>
                <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                  <li>Jika proposal <strong>disetujui</strong>, Anda dapat melanjutkan ke tahap selanjutnya</li>
                  <li>Jika proposal <strong>ditolak</strong>, Anda tidak dapat melanjutkan</li>
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
                Proposal Anda untuk <strong>{competition.title}</strong> berhasil disubmit.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-[#333333] mb-3">What's Next?</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ Proposal Anda akan direview oleh juri universitas</p>
                  <p>✓ Hasil review tersedia dalam 7-14 hari kerja</p>
                  <p>✓ Anda akan mendapat notifikasi email saat hasil keluar</p>
                  <p>✓ Cek "My Competitions" untuk melihat status submission Anda</p>
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
                  onClick={() => navigate(appPaths.competition(competition.id))}
                  className="px-8 py-3 bg-gray-100 text-[#333333] font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back to Competition
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#333333] mb-2">Submit Proposal</h1>
                <p className="text-gray-600">
                  Lengkapi form berikut untuk submit proposal — <strong>{competition.title}</strong>
                </p>
              </div>

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Dynamic form fields */}
              <div className="space-y-6 mb-8">
                {proposalFields.map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        value={(fieldValues[field.label] as string) || ''}
                        onChange={e => handleFieldChange(field.label, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                        placeholder={`Masukkan ${field.label.toLowerCase()}`}
                      />
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(fieldValues[field.label] as boolean) || false}
                          onChange={e => handleFieldChange(field.label, e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]"
                        />
                        <span className="text-gray-700">{field.label}</span>
                      </label>
                    ) : field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={(fieldValues[field.label] as string) || ''}
                        onChange={e => handleFieldChange(field.label, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      >
                        <option value="">Pilih {field.label}</option>
                        {(field.options || []).map((opt, j) => (
                          <option key={j} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'file' ? (
                      <div>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#C8102E] transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold text-[#C8102E]">Click to upload</span> or drag and drop
                              </p>
                              {field.allowedFormats && field.allowedFormats.length > 0 && (
                                <p className="text-xs text-gray-400 mb-2">
                                  Allowed: {field.allowedFormats.join(', ')}
                                </p>
                              )}
                              {fieldValues[field.label] && fieldValues[field.label] instanceof window.File && (
                                <p className="text-sm font-semibold text-green-600 truncate max-w-xs mt-2 text-center">
                                  Selected: {(fieldValues[field.label] as globalThis.File).name}
                                </p>
                              )}
                            </div>
                            <input
                              type="file"
                              accept={field.allowedFormats?.join(',')}
                              required={field.required && !fieldValues[field.label]}
                              onChange={e => e.target.files && e.target.files[0] && handleFieldChange(field.label, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        value={(fieldValues[field.label] as string) || ''}
                        onChange={e => handleFieldChange(field.label, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                        placeholder={`Masukkan ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>


              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Proposal...
                    </span>
                  ) : 'Submit Proposal'}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}