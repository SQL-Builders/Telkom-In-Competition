import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, LayoutDashboard, FolderKanban, Users, FileCheck,
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Menu, X as CloseIcon, Search, MessageCircle, LogOut, Calendar, MapPin, DollarSign, AlertCircle, FileText, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { appPaths } from '../data/paths';
import { competitionsApi } from '../api/competitionsApi';
import { apiClient } from '../api/client';

const adminNavigation = [
  { name: 'Dashboard', path: 'overview', icon: LayoutDashboard },
  { name: 'Manage Competitions', path: 'competitions', icon: FolderKanban },
  { name: 'Participants', path: 'participants', icon: Users },
  { name: 'Submissions', path: 'submissions', icon: FileCheck },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  completed: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400',
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State management
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [compRes, regRes, catRes] = await Promise.all([
          competitionsApi.getAll(),
          competitionsApi.getAllRegistrations(),
          competitionsApi.getCategories(),
        ]) as any[];
        const comps = (compRes as any)?.competitions || (compRes as any)?.data || [];
        const regs = Array.isArray(regRes) ? regRes : [];
        setCompetitions(comps);
        setSubmissions(regs);
        setParticipants(regs); // same source — registrations contain participant info
        setCategories(catRes || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Modal states
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showEditSubmissionModal, setShowEditSubmissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState(null);
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);
  const [editingSubmission, setEditingSubmission] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number } | null>(null);
  const [submissionForm, setSubmissionForm] = useState({
    id_lomba: '' as string | number,
    status_pendaftaran: 'pending',
    stage: 'University',
    nomor_pendaftaran: '',
    overallScore: 0,
    reviewerComments: '',
    strengths: [] as string[],
    improvements: [] as string[],
    scores: [] as Array<{ criteria: string; score: number; maxScore: number }>,
    newStrength: '',
    newImprovement: '',
  });
  
  // Search states
  const [competitionSearch, setCompetitionSearch] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedCompetitionFilter, setSelectedCompetitionFilter] = useState('All');
  const [selectedSubStatusFilter, setSelectedSubStatusFilter] = useState('All');
  
  // Form state
  const [competitionForm, setCompetitionForm] = useState({
    name: '',
    organizer: '',
    id_kategori: '' as string | number,
    level: '',
    deadline: '',
    prizes: '',
    biaya: 0,
    location: '',
    whatsappGroup: '',
    description: '',
    status: 'active',
    featured: false,
    recommended: false
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [formTimeline, setFormTimeline] = useState<{date: string; event: string; stage: string}[]>([]);
  const [formRequirements, setFormRequirements] = useState<string[]>([]);
  const [formProposalFields, setFormProposalFields] = useState<{label: string; type: string; required: boolean; allowedFormats?: string[]}[]>([]);

  // Calculate stats
  const stats = [
    { label: 'Total Competitions', value: competitions.length.toString(), change: '+3 this month', color: 'bg-blue-500' },
    { label: 'Active Participants', value: participants.filter(p => p.status === 'active').length.toString(), change: '+156 this week', color: 'bg-green-500' },
    { label: 'Pending Reviews', value: submissions.filter(s => s.status === 'pending').length.toString(), change: submissions.filter(s => s.status === 'pending').length > 5 ? 'urgent' : 'normal', color: 'bg-orange-500' },
    { label: 'Completed', value: competitions.filter(c => c.status === 'completed').length.toString(), change: '+8 this month', color: 'bg-purple-500' },
  ];

  // Competition CRUD
  const handleCreateCompetition = () => {
    setEditingCompetition(null);
    setCompetitionForm({
      name: '',
      organizer: '',
      id_kategori: '',
      level: '',
      deadline: '',
      prizes: '',
      location: '',
      whatsappGroup: '',
      description: '',
      biaya: 0,
      status: 'active',
      featured: false,
      recommended: false
    });
    setPosterFile(null);
    setPosterPreview(null);
    setFormTimeline([]);
    setFormRequirements([]);
    setFormProposalFields([]);
    setShowCompetitionModal(true);
  };

  const handleEditCompetition = (comp: any) => {
    setEditingCompetition(comp);
    setCompetitionForm({
      name: comp.title || comp.name || '',
      organizer: comp.organizer || '',
      id_kategori: comp.id_kategori || '',
      level: comp.level || '',
      deadline: comp.deadline ? comp.deadline.split('T')[0] : '',
      prizes: comp.hadiah || (Array.isArray(comp.prizes) && comp.prizes.length > 0 ? comp.prizes.join(', ') : '') || '',
      location: comp.location || '',
      whatsappGroup: comp.whatsappGroup || '',
      description: comp.description || '',
      biaya: comp.biaya || 0,
      status: comp.status || 'active',
      featured: comp.featured || false,
      recommended: comp.recommended || false,
    });
    setFormTimeline(Array.isArray(comp.timeline) ? comp.timeline.map((t: any) => ({ date: t.date || '', event: t.event || '', stage: t.stage || 'University' })) : []);
    setFormRequirements(Array.isArray(comp.requirements) ? comp.requirements : []);
    setFormProposalFields(Array.isArray(comp.proposalFields) ? comp.proposalFields : []);
    setPosterFile(null);
    setPosterPreview(comp.image || null);
    setShowCompetitionModal(true);
  };
// Note: In a real application, you would also want to handle form validation and error handling for the competition form.
  const handleSaveCompetition = async () => {
    try {
      let poster_url: string | undefined = undefined;
      if (posterFile) {
        const formData = new FormData();
        formData.append('file', posterFile);
        formData.append('prefix', `Poster_${competitionForm.name || 'Competition'}`);
        const uploadRes = await apiClient.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Backend uploadService returns data_berkas record with file_path (public URL)
        poster_url = uploadRes.data?.data?.file_path || uploadRes.data?.data?.url;
      }

      const payload: any = {
        nama_lomba: competitionForm.name || 'Untitled Competition',
        penyelenggara: competitionForm.organizer || 'Telkom University',
        deskripsi: competitionForm.description || '',
        hadiah: competitionForm.prizes || null,
        biaya: competitionForm.biaya || 0,
        deadline: competitionForm.deadline ? new Date(competitionForm.deadline).toISOString() : new Date().toISOString(),
        tgl_mulai: competitionForm.deadline ? new Date(competitionForm.deadline).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tgl_selesai: competitionForm.deadline ? new Date(competitionForm.deadline).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        level: competitionForm.level || 'University',
        location: competitionForm.location || 'Online',
        whatsapp_group: competitionForm.whatsappGroup || null,
        status: competitionForm.status,
        featured: competitionForm.featured,
        recommended: competitionForm.recommended,
        requirements: formRequirements.filter(r => r.trim()),
        timeline: formTimeline.filter(t => t.event.trim() && t.date),
        proposalFields: formProposalFields,
        ...(poster_url && { poster_url })
      };

      // Only send id_kategori if it's a valid number
      if (competitionForm.id_kategori && competitionForm.id_kategori !== '') {
        payload.id_kategori = Number(competitionForm.id_kategori);
      }

      if (editingCompetition) {
        await competitionsApi.update((editingCompetition as any).id, payload);
      } else {
        await competitionsApi.create(payload);
      }
      setShowCompetitionModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to save competition:', err);
      alert('Failed to save competition. Check console for details.');
    }
  };

  const handleDeleteCompetition = (id: number) => {
    setDeleteTarget({ type: 'competition', id });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        if (deleteTarget.type === 'competition') {
          await competitionsApi.delete(deleteTarget.id);
          setCompetitions(competitions.filter(c => c.id !== deleteTarget.id));
        } else if (deleteTarget.type === 'submission') {
          await competitionsApi.deleteRegistration(deleteTarget.id);
          setSubmissions(submissions.filter(s => s.id !== deleteTarget.id));
        }
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete');
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Submission actions
  const handleViewSubmission = (sub: any) => {
    setViewingSubmission(sub);
    setShowSubmissionModal(true);
  };

  const handleEditSubmission = (sub: any) => {
    setEditingSubmission(sub);
    const dbReview = sub.registrationData?.form_data?._review_data || {};
    const cleanReview = dbReview.overallScore !== undefined ? { University: dbReview } : dbReview;
    const currentStage = sub.registrationData?.stage || sub.stage || 'University';
    const stageReview = cleanReview[currentStage] || {};

    setSubmissionForm({
      id_lomba: sub.registrationData?.id_lomba || sub.id_lomba || '',
      status_pendaftaran: sub.registrationData?.status_pendaftaran || sub.status || 'pending',
      stage: currentStage,
      nomor_pendaftaran: sub.registrationData?.nomor_pendaftaran || sub.nomor_pendaftaran || '',
      overallScore: stageReview.overallScore || 0,
      reviewerComments: stageReview.reviewerComments || '',
      strengths: stageReview.feedback?.strengths || [],
      improvements: stageReview.feedback?.improvements || [],
      scores: stageReview.scores && stageReview.scores.length > 0 ? stageReview.scores : [
        { criteria: 'Innovation & Originality', score: 0, maxScore: 100 },
        { criteria: 'Problem Understanding', score: 0, maxScore: 100 },
        { criteria: 'Solution Feasibility', score: 0, maxScore: 100 },
        { criteria: 'Presentation Quality', score: 0, maxScore: 100 },
        { criteria: 'Team Composition', score: 0, maxScore: 100 },
      ],
      newStrength: '',
      newImprovement: '',
    });
    setShowEditSubmissionModal(true);
  };

  const handleScoreChange = (index: number, val: string) => {
    const newScores = [...submissionForm.scores];
    const numVal = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    newScores[index] = { ...newScores[index], score: numVal };
    
    // Calculate overall score (average of all criteria scores)
    const sum = newScores.reduce((acc, s) => acc + s.score, 0);
    const avg = Math.round(sum / newScores.length);
    
    setSubmissionForm({
      ...submissionForm,
      scores: newScores,
      overallScore: avg,
    });
  };

  const addStrength = () => {
    if (!submissionForm.newStrength.trim()) return;
    setSubmissionForm({
      ...submissionForm,
      strengths: [...submissionForm.strengths, submissionForm.newStrength.trim()],
      newStrength: '',
    });
  };

  const removeStrength = (idx: number) => {
    setSubmissionForm({
      ...submissionForm,
      strengths: submissionForm.strengths.filter((_, i) => i !== idx),
    });
  };

  const addImprovement = () => {
    if (!submissionForm.newImprovement.trim()) return;
    setSubmissionForm({
      ...submissionForm,
      improvements: [...submissionForm.improvements, submissionForm.newImprovement.trim()],
      newImprovement: '',
    });
  };

  const removeImprovement = (idx: number) => {
    setSubmissionForm({
      ...submissionForm,
      improvements: submissionForm.improvements.filter((_, i) => i !== idx),
    });
  };

  const handleSaveSubmission = async () => {
    if (!editingSubmission) return;
    const subId = editingSubmission.id || editingSubmission.registrationData?.id_pendaftaran;
    
    // Minimum score validation: Score must be at least 70 to be approved
    const isApprovedStatus = ['accepted', 'approved', 'university-approved', 'national-reviewed'].includes(submissionForm.status_pendaftaran);
    const scoreVal = Number(submissionForm.overallScore);
    if (isApprovedStatus && scoreVal < 70) {
      alert("Error: Status 'Lolos / Setuju' memerlukan nilai rata-rata minimal 70. Nilai saat ini adalah " + scoreVal + "/100.");
      return;
    }

    try {
      const reviewPayload = {
        overallScore: scoreVal,
        maxScore: 100,
        reviewerComments: submissionForm.reviewerComments,
        feedback: {
          strengths: submissionForm.strengths,
          improvements: submissionForm.improvements,
        },
        scores: submissionForm.scores,
        reviewedAt: new Date().toISOString(),
      };

      const existingReview = editingSubmission.registrationData?.form_data?._review_data || {};
      const cleanReview = existingReview.overallScore !== undefined ? { University: existingReview } : existingReview;
      
      const mergedReview = {
        ...cleanReview,
        [submissionForm.stage]: reviewPayload
      };

      const updates: Promise<any>[] = [
        competitionsApi.updateRegistrationStatus(subId, submissionForm.status_pendaftaran),
        competitionsApi.updateRegistrantStage(subId, submissionForm.stage),
        competitionsApi.updateRegistrationReview(subId, mergedReview),
      ];
      await Promise.all(updates);

      // Update local state
      const updater = (s: any) => {
        if (s.id === editingSubmission.id || s.registrationData?.id_pendaftaran === subId) {
          const regData = s.registrationData || {};
          return {
            ...s,
            status: submissionForm.status_pendaftaran,
            stage: submissionForm.stage,
            registrationData: {
              ...regData,
              status_pendaftaran: submissionForm.status_pendaftaran,
              stage: submissionForm.stage,
              form_data: {
                ...(regData.form_data || {}),
                _review_data: mergedReview
              }
            }
          };
        }
        return s;
      };
      setSubmissions(prev => prev.map(updater));
      setParticipants(prev => prev.map(updater));
      setShowEditSubmissionModal(false);
      setEditingSubmission(null);
    } catch (err) {
      console.error("Error saving submission:", err);
      alert("Failed to save submission. Check console for details.");
    }
  };

  const handleUpdateSubmissionStatusQuick = async (id: number, status: string) => {
    try {
      const isApproved = status === 'accepted' || status === 'approved' || status === 'university-approved' || status === 'national-reviewed';
      
      // Get current stage of the submission
      const sub = submissions.find(s => s.id === id || s.registrationData?.id_pendaftaran === id);
      const currentStage = sub?.registrationData?.stage || sub?.stage || 'University';
      let nextStage = currentStage;
      if (isApproved) {
        if (currentStage === 'University') nextStage = 'National';
        else if (currentStage === 'National') nextStage = 'International';
      }

      const reviewPayload = {
        overallScore: isApproved ? 85 : 62,
        maxScore: 100,
        reviewerComments: isApproved
          ? `Excellent work! The proposal is well-written, demonstrates a strong understanding of the user needs, and details a clear implementation strategy. Approved to proceed to the ${nextStage} stage.`
          : 'The proposal lacks detailed implementation steps and clear validation metrics. Please review the feedback and improve these areas for future applications.',
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
        reviewedAt: new Date().toISOString(),
      };

      const existingReview = sub?.registrationData?.form_data?._review_data || {};
      const cleanReview = existingReview.overallScore !== undefined ? { University: existingReview } : existingReview;
      const mergedReview = {
        ...cleanReview,
        [currentStage]: reviewPayload
      };

      await Promise.all([
        competitionsApi.updateRegistrationStatus(id, status),
        competitionsApi.updateRegistrantStage(id, nextStage),
        competitionsApi.updateRegistrationReview(id, mergedReview)
      ]);

      const updater = (s: any) => {
        if (s.id === id || s.registrationData?.id_pendaftaran === id) {
          const regData = s.registrationData || {};
          return {
            ...s,
            status,
            stage: nextStage,
            registrationData: {
              ...regData,
              status_pendaftaran: status,
              stage: nextStage,
              form_data: {
                ...(regData.form_data || {}),
                _review_data: mergedReview
              }
            }
          };
        }
        return s;
      };

      setSubmissions(prev => prev.map(updater));
      setParticipants(prev => prev.map(updater));
      if (viewingSubmission && (viewingSubmission.id === id || viewingSubmission.registrationData?.id_pendaftaran === id)) {
        setViewingSubmission({
          ...viewingSubmission,
          status,
          stage: nextStage,
          registrationData: {
            ...(viewingSubmission.registrationData || {}),
            status_pendaftaran: status,
            stage: nextStage,
            form_data: {
              ...(viewingSubmission.registrationData?.form_data || {}),
              _review_data: mergedReview
            }
          }
        });
      }
    } catch (err) {
      console.error('Error updating status', err);
      alert("Failed to update status.");
    }
  };

  const handleApproveSubmission = (id: number) => handleUpdateSubmissionStatusQuick(id, 'accepted');
  const handleRejectSubmission = (id: number) => handleUpdateSubmissionStatusQuick(id, 'rejected');

  const handleDeleteSubmission = (id: number) => {
    setDeleteTarget({ type: 'submission', id } as any);
    setShowDeleteModal(true);
  };

  // Filter functions
  const filteredCompetitions = competitions.filter(c => {
    const compName = c.title || c.name || '';
    const compCat = c.category || '';
    return compName.toLowerCase().includes(competitionSearch.toLowerCase()) ||
           compCat.toLowerCase().includes(competitionSearch.toLowerCase());
  });

  const filteredSubmissions = submissions.filter(s => {
    const teamName = s.team || s.registrationData?.user_pengguna?.name || s.registrationData?.nama_tim || '';
    const compName = typeof s.competition === 'string' ? s.competition : (s.competition?.title || s.competition?.name || s.registrationData?.data_lomba?.nama_lomba || '');
    const status = s.registrationData?.status_pendaftaran || s.status || 'pending';

    const matchesSearch = teamName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
                          compName.toLowerCase().includes(submissionSearch.toLowerCase());
                          
    const matchesCompFilter = selectedCompetitionFilter === 'All' || compName === selectedCompetitionFilter;

    let matchesStatusFilter = false;
    if (selectedSubStatusFilter === 'All') {
      matchesStatusFilter = true;
    } else if (selectedSubStatusFilter === 'Pending') {
      matchesStatusFilter = status.toLowerCase() === 'pending' || status.toLowerCase() === 'under_review';
    } else if (selectedSubStatusFilter === 'Approved') {
      matchesStatusFilter = status.toLowerCase() === 'accepted' || status.toLowerCase() === 'approved' || status.toLowerCase() === 'university-approved';
    } else if (selectedSubStatusFilter === 'Rejected') {
      matchesStatusFilter = status.toLowerCase() === 'rejected' || status.toLowerCase() === 'university-rejected';
    }

    return matchesSearch && matchesCompFilter && matchesStatusFilter;
  });

  const uniqueSubmissionCompetitions = Array.from(
    new Set(
      submissions.map(s => {
        return s.registrationData?.data_lomba?.nama_lomba || 
               (typeof s.competition === 'string' ? s.competition : (s.competition?.title || s.competition?.name || ''));
      }).filter(Boolean)
    )
  ) as string[];

  const filteredParticipants = participants.filter(p => {
    const pName = p.team || p.name || '';
    const pEmail = p.email || '';
    const pComp = p.competition || '';
    return pName.toLowerCase().includes(participantSearch.toLowerCase()) ||
           pEmail.toLowerCase().includes(participantSearch.toLowerCase()) ||
           pComp.toLowerCase().includes(participantSearch.toLowerCase());
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19] dark-theme-active' : 'bg-gray-50'}`}>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 16, 46, 0); }
          50% { box-shadow: 0 0 0 8px rgba(200, 16, 46, 0.2); }
        }

        /* Dark Mode Specific Overrides for Modals & Inputs */
        .dark-theme-active .bg-white {
          background-color: #151F32 !important;
          color: #ffffff !important;
        }
        .dark-theme-active .border-gray-200 {
          border-color: #1e293b !important;
        }
        .dark-theme-active .border-gray-100 {
          border-color: #1e293b !important;
        }
        .dark-theme-active .text-gray-700 {
          color: #cbd5e1 !important;
        }
        .dark-theme-active .text-gray-600 {
          color: #94a3b8 !important;
        }
        .dark-theme-active .text-gray-500 {
          color: #64748b !important;
        }
        .dark-theme-active .text-gray-800 {
          color: #f1f5f9 !important;
        }
        .dark-theme-active .text-[#333333] {
          color: #ffffff !important;
        }
        .dark-theme-active input, 
        .dark-theme-active select, 
        .dark-theme-active textarea {
          background-color: #1d2b44 !important;
          border-color: #1e293b !important;
          color: #ffffff !important;
        }
        .dark-theme-active input::placeholder, 
        .dark-theme-active textarea::placeholder {
          color: #64748b !important;
        }
        .dark-theme-active select option {
          background-color: #151F32 !important;
          color: #ffffff !important;
        }
        .dark-theme-active .bg-gray-50 {
          background-color: #1d2b44 !important;
        }
        .dark-theme-active .bg-gray-100 {
          background-color: #1e293b !important;
          color: #cbd5e1 !important;
        }
        
        /* Interactive/Hover Elements Overrides */
        .dark-theme-active .hover\:bg-gray-50:hover {
          background-color: #1e293b !important;
        }
        .dark-theme-active .hover\:bg-gray-100:hover {
          background-color: #1d2b44 !important;
        }
        .dark-theme-active .hover\:bg-red-50:hover {
          background-color: rgba(220, 38, 38, 0.15) !important;
        }
        .dark-theme-active .hover\:bg-green-50:hover {
          background-color: rgba(22, 163, 74, 0.15) !important;
        }
        .dark-theme-active .hover\:bg-blue-50:hover {
          background-color: rgba(37, 99, 235, 0.15) !important;
        }
        
        /* Links & Special Badge Overrides */
        .dark-theme-active .bg-red-50 {
          background-color: rgba(200, 16, 46, 0.15) !important;
          color: #f87171 !important;
        }
        
        /* File input upload button styling */
        .dark-theme-active input[type="file"]::file-selector-button {
          background-color: #151F32 !important;
          color: #ffffff !important;
          border-color: #1e293b !important;
        }
      `}</style>
      {/* Sidebar - Desktop */}
      <aside className={`fixed left-0 top-0 h-full w-64 text-white hidden lg:block z-40 transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-r border-slate-800' : 'bg-[#333333]'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate(appPaths.home)}>
             <div
              className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/5"
              style={{ 
                animation: 'glowPulse 3s ease-in-out infinite'
              }}
            >
              <img
                src="/assets/telyuuu.png"
                alt="Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <div className="text-sm font-bold">Telkom-In-Comp</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => setActiveTab(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.path
                      ? 'bg-[#C8102E] text-white shadow-md shadow-[#C8102E]/25'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
                <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-red-500' : 'bg-gray-600'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                logout();
                navigate(appPaths.home);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 text-white z-50 flex items-center justify-between px-6 transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-b border-slate-800' : 'bg-[#333333]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5">
            <img src="/assets/telyuuu.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="text-sm font-bold">Admin Panel</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-white/5">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className={`fixed top-0 bottom-0 left-0 w-64 p-6 flex flex-col z-50 ${darkMode ? 'bg-[#0F172A]' : 'bg-[#333333]'}`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div 
                  className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white/5"
                  style={{ animation: 'glowPulse 3s ease-in-out infinite' }}
                >
                  <img src="/assets/telyuuu.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
                </div>
                <div className="text-sm font-bold text-white">Admin Panel</div>
              </div>

              <nav className="space-y-2 flex-1">
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        setActiveTab(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white hover:bg-white/5"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Theme Toggle & Logout */}
              <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
                    <span className="font-medium text-sm">{darkMode ? 'Light' : 'Dark'} Mode</span>
                  </div>
                  <div className={`w-8 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-red-500' : 'bg-gray-600'}`}>
                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </motion.button>

                <button
                  onClick={() => {
                    logout();
                    navigate(appPaths.home);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 transition-colors ${darkMode ? 'text-white' : 'text-[#333333]'}`}>Admin Dashboard</h1>
            <p className={`text-lg transition-colors ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Manage competitions, participants, and submissions</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md ${
                  darkMode 
                    ? 'bg-[#151F32] border-slate-800 text-white' 
                    : 'bg-white border-gray-200 text-[#333333]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                  <span className={`w-3 h-3 rounded-full ${stat.color} shadow-sm`}></span>
                </div>
                <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</div>
                <div className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-green-500' : stat.change === 'urgent' ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`rounded-2xl border p-6 transition-all duration-300 ${darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#333333]'}`}>Recent Activity</h2>
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-[#1D2B44]/40 text-slate-300' : 'bg-gray-50 text-gray-700'}`}>
                      <div className="w-2 h-2 bg-[#C8102E] rounded-full"></div>
                      <span className="text-sm flex-1">
                        New submission from {sub.team || sub.registrationData?.user_pengguna?.name || 'Mahasiswa'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[sub.status]}`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#C8102E] to-[#E91E3A] rounded-2xl p-6 text-white">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateCompetition}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center gap-3"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New Competition</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('submissions')}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center gap-3"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Review Submissions ({submissions.filter(s => s.status === 'pending').length})</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitions' && (
            <div className={`rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className={`p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex-1 relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search competitions..."
                    value={competitionSearch}
                    onChange={(e) => setCompetitionSearch(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                      darkMode ? 'bg-[#1D2B44] border-slate-800 text-white placeholder:text-slate-400' : 'bg-gray-50 border-gray-200 text-[#333333]'
                    }`}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateCompetition}
                  className="px-6 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-[#1D2B44]/20' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Competition Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Category</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Level</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Participants</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Deadline</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {filteredCompetitions.map((comp) => (
                      <tr key={comp.id} className={`transition-colors ${darkMode ? 'hover:bg-[#1D2B44]/20 border-b border-slate-800/50' : 'hover:bg-gray-50'}`}>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}>{comp.title || comp.name}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{comp.category}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{comp.level}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{comp.participants}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                          {new Date(comp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const isExpired = comp.deadline && new Date(comp.deadline) < new Date();
                            const displayStatus = isExpired && comp.status === 'active' ? 'closed' : comp.status;
                            const colorMap: Record<string, string> = { ...statusColors, closed: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' };
                            return (
                              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${colorMap[displayStatus] || 'bg-gray-100 text-gray-700'}`}>
                                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(appPaths.competition(comp.id))}
                              className={`p-2 text-blue-500 rounded-lg transition-colors ${darkMode ? 'hover:bg-blue-950/40' : 'hover:bg-blue-50'}`}
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditCompetition(comp)}
                              className={`p-2 text-green-500 rounded-lg transition-colors ${darkMode ? 'hover:bg-green-950/40' : 'hover:bg-green-50'}`}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompetition(comp.id)}
                              className={`p-2 text-red-500 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-950/40' : 'hover:bg-red-50'}`}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className={`rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className={`p-6 border-b flex flex-col gap-4 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>All Submissions</h2>
                  <div className="flex-1 relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search submissions..."
                      value={submissionSearch}
                      onChange={(e) => setSubmissionSearch(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                        darkMode ? 'bg-[#1D2B44] border-slate-800 text-white placeholder:text-slate-400' : 'bg-gray-50 border-gray-200 text-[#333333]'
                      }`}
                    />
                  </div>
                </div>

                {/* Submissions advanced filter dropdown & status selectors */}
                <div className={`flex flex-col lg:flex-row gap-4 pt-2 border-t ${darkMode ? 'border-slate-800/40' : 'border-gray-100'}`}>
                  <div className="flex-1">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      Filter by Competition
                    </label>
                    <select
                      value={selectedCompetitionFilter}
                      onChange={(e) => setSelectedCompetitionFilter(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                        darkMode ? 'bg-[#1D2B44] text-white border-slate-850' : 'bg-gray-50 border border-gray-200 text-[#333333]'
                      }`}
                    >
                      <option value="All">All Competitions</option>
                      {uniqueSubmissionCompetitions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      Filter by Status
                    </label>
                    <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-[#1D2B44] border-slate-800' : 'bg-gray-100 border-gray-200'}`}>
                      {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                          key={status}
                          onClick={() => setSelectedSubStatusFilter(status)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            selectedSubStatusFilter === status
                              ? 'bg-[#C8102E] text-white shadow-sm'
                              : darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-[#1D2B44]/20' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Pendaftar</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Competition</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>No. Pendaftaran</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Tanggal Daftar</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Stage</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {filteredSubmissions.map((sub) => {
                      const name = sub.registrationData?.user_pengguna?.name || sub.team || 'N/A';
                      const compName = sub.registrationData?.data_lomba?.nama_lomba || 
                        (typeof sub.competition === 'string' ? sub.competition : (sub.competition?.title || 'N/A'));
                      const noPendaftaran = sub.registrationData?.nomor_pendaftaran || sub.nomor_pendaftaran || '-';
                      const tglDaftar = sub.registrationData?.tgl_daftar || sub.submittedDate;
                      const status = sub.registrationData?.status_pendaftaran || sub.status || 'pending';
                      const stage = sub.registrationData?.stage || sub.stage || 'University';
                      const statusColor: Record<string, string> = {
                        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
                        accepted: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
                        rejected: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
                        under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                        'university-approved': 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
                        'university-rejected': 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
                      };
                      return (
                        <tr key={sub.id} className={`transition-colors ${darkMode ? 'hover:bg-[#1D2B44]/20 border-b border-slate-800/50' : 'hover:bg-gray-50'}`}>
                          <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}>{name}</td>
                          <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{compName}</td>
                          <td className={`px-6 py-4 text-sm font-mono ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{noPendaftaran}</td>
                          <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                            {tglDaftar ? new Date(tglDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColor[status] || 'bg-gray-100 text-gray-700'}`}>
                              {status.replace(/-/g, ' ')}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{stage}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleViewSubmission(sub)}
                                className={`p-2 text-blue-500 rounded-lg transition-colors ${darkMode ? 'hover:bg-blue-950/40' : 'hover:bg-blue-50'}`}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditSubmission(sub)}
                                className={`p-2 text-green-500 rounded-lg transition-colors ${darkMode ? 'hover:bg-green-950/40' : 'hover:bg-green-50'}`}
                                title="Edit Submission"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className={`p-2 text-red-500 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-950/40' : 'hover:bg-red-50'}`}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === 'participants' && (
            <div className={`rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className={`p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>All Participants ({filteredParticipants.length})</h2>
                <div className="flex-1 relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or competition..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                      darkMode ? 'bg-[#1D2B44] border-slate-800 text-white placeholder:text-slate-400' : 'bg-gray-50 border-gray-200 text-[#333333]'
                    }`}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-[#1D2B44]/20' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Nama Peserta</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Kompetisi</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Tanggal Daftar</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Stage</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {filteredParticipants.length === 0 ? (
                      <tr><td colSpan={6} className={`px-6 py-12 text-center ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Belum ada peserta terdaftar</td></tr>
                    ) : filteredParticipants.map((p) => (
                      <tr key={p.id} className={`transition-colors ${darkMode ? 'hover:bg-[#1D2B44]/20 border-b border-slate-800/50' : 'hover:bg-gray-50'}`}>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}>{p.team || p.name || '-'}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{p.email || '-'}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{p.competition || '-'}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                          {p.submittedDate ? new Date(p.submittedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{p.stage || 'University'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[p.status] || 'bg-gray-100 text-gray-700'}`}>
                            {p.status || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Competition Modal */}
      <AnimatePresence>
        {showCompetitionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-[#333333]">
                  {editingCompetition ? 'Edit Competition' : 'Create New Competition'}
                </h2>
                <button
                  onClick={() => setShowCompetitionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Competition Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Competition Name *</label>
                  <input type="text" value={competitionForm.name}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="e.g., UI/UX Design Competition 2026" />
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Penyelenggara / Organizer *</label>
                  <input type="text" value={competitionForm.organizer}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, organizer: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="e.g., Telkom University, Kemendikbud" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category - from API */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select value={competitionForm.id_kategori}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, id_kategori: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]">
                      <option value="">Select category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id_kategori} value={cat.id_kategori}>{cat.nama_kategori}</option>
                      ))}
                    </select>
                  </div>
                  {/* Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Level *</label>
                    <select value={competitionForm.level}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, level: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]">
                      <option value="">Select level</option>
                      <option value="University">University</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />Deadline *
                    </label>
                    <input type="date" value={competitionForm.deadline}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, deadline: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]" />
                  </div>
                  {/* Prize */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />Prize Pool
                    </label>
                    <input type="text" value={competitionForm.prizes}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, prizes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                      placeholder="e.g., Rp 10.000.000" />
                  </div>
                  {/* Fee */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />Registration Fee
                    </label>
                    <input type="number" value={competitionForm.biaya || ''}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, biaya: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                      placeholder="e.g., 50000 (Kosongkan jika Gratis)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />Location
                  </label>
                  <input type="text" value={competitionForm.location}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="e.g., Online, Jakarta" />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />WhatsApp Group Link
                  </label>
                  <input type="url" value={competitionForm.whatsappGroup}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, whatsappGroup: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="https://chat.whatsapp.com/..." />
                </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea value={competitionForm.description}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, description: e.target.value })}
                    rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="Describe the competition..." />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select value={competitionForm.status}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Flags: Featured & Recommended */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox"
                      checked={!!competitionForm.featured}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]" />
                    <div>
                      <span className="block font-semibold text-gray-700 text-sm">Featured</span>
                      <span className="block text-xs text-gray-500">Tampilkan di slider halaman utama</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox"
                      checked={!!competitionForm.recommended}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, recommended: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]" />
                    <div>
                      <span className="block font-semibold text-gray-700 text-sm">Recommended</span>
                      <span className="block text-xs text-gray-500">Tandai dengan label rekomendasi</span>
                    </div>
                  </label>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                  <div className="space-y-2">
                    {formRequirements.map((req, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={req}
                          onChange={(e) => { const r = [...formRequirements]; r[i] = e.target.value; setFormRequirements(r); }}
                          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] text-sm"
                          placeholder="e.g., Mahasiswa aktif semester 1-8" />
                        <button onClick={() => setFormRequirements(formRequirements.filter((_, idx) => idx !== i))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => setFormRequirements([...formRequirements, ''])}
                      className="flex items-center gap-2 text-sm text-[#C8102E] font-semibold hover:underline">
                      <Plus className="w-4 h-4" /> Add Requirement
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Competition Timeline</label>
                  <div className="space-y-2">
                    {formTimeline.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center flex-wrap">
                        <input type="date" value={item.date}
                          onChange={(e) => { const t = [...formTimeline]; t[i] = { ...t[i], date: e.target.value }; setFormTimeline(t); }}
                          className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] text-sm" />
                        <input type="text" value={item.event}
                          onChange={(e) => { const t = [...formTimeline]; t[i] = { ...t[i], event: e.target.value }; setFormTimeline(t); }}
                          className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] text-sm"
                          placeholder="e.g., Pembukaan Pendaftaran" />
                        <select value={item.stage || 'University'}
                          onChange={(e) => { const t = [...formTimeline]; t[i] = { ...t[i], stage: e.target.value }; setFormTimeline(t); }}
                          className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] text-sm">
                          <option value="University">University</option>
                          <option value="National">National</option>
                          <option value="International">International</option>
                        </select>
                        <button onClick={() => setFormTimeline(formTimeline.filter((_, idx) => idx !== i))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => setFormTimeline([...formTimeline, { date: '', event: '', stage: 'University' }])}
                      className="flex items-center gap-2 text-sm text-[#C8102E] font-semibold hover:underline">
                      <Plus className="w-4 h-4" /> Add Timeline Event
                    </button>
                  </div>
                </div>

                {/* Proposal Form Builder */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Proposal Form Builder</label>
                  <p className="text-xs text-gray-500 mb-2">Custom fields yang akan muncul di form Submit Proposal peserta</p>
                  <div className="space-y-2">
                    {formProposalFields.map((field, i) => (
                      <div key={i} className="flex gap-2 items-center flex-wrap bg-gray-50 rounded-xl p-3">
                        <input type="text" value={field.label}
                          onChange={(e) => { const f = [...formProposalFields]; f[i] = { ...f[i], label: e.target.value }; setFormProposalFields(f); }}
                          className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] text-sm bg-white"
                          placeholder="Label field (e.g., Nama Tim, Upload Proposal)" />
                        <select value={field.type}
                          onChange={(e) => { const f = [...formProposalFields]; f[i] = { ...f[i], type: e.target.value }; setFormProposalFields(f); }}
                          className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E] text-sm bg-white">
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="file">File Upload</option>
                          <option value="select">Select/Dropdown</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="email">Email</option>
                          <option value="url">URL</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <label className="flex items-center gap-1 text-sm text-gray-600">
                          <input type="checkbox" checked={field.required}
                            onChange={(e) => { const f = [...formProposalFields]; f[i] = { ...f[i], required: e.target.checked }; setFormProposalFields(f); }}
                            className="rounded" />
                          Required
                        </label>
                        <button onClick={() => setFormProposalFields(formProposalFields.filter((_, idx) => idx !== i))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          
                        {/* File formats input when type is file */}
                        {field.type === 'file' && (
                          <div className="w-full mt-2">
                            <input type="text"
                              value={(field.allowedFormats || []).join(', ')}
                              onChange={(e) => { 
                                const f = [...formProposalFields]; 
                                // split by comma, trim whitespace
                                f[i] = { 
                                  ...f[i], 
                                  allowedFormats: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                                }; 
                                setFormProposalFields(f); 
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8102E] text-sm bg-white"
                              placeholder="Allowed formats (e.g., .pdf, .zip, .png, .jpg)" />
                          </div>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setFormProposalFields([...formProposalFields, { label: '', type: 'text', required: false }])}
                      className="flex items-center gap-2 text-sm text-[#C8102E] font-semibold hover:underline">
                      <Plus className="w-4 h-4" /> Add Form Field
                    </button>
                  </div>
                </div>

                {/* Poster Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Competition Poster (PNG, JPG, JPEG — Maks. 2MB)</label>
                  {posterPreview && !posterFile && (
                    <img src={posterPreview} alt="Current poster" className="w-full h-40 object-cover rounded-xl mb-2 border border-gray-200" />
                  )}
                  <input type="file" accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const f = e.target.files[0];
                        if (f.size > 2 * 1024 * 1024) {
                          alert('Ukuran file terlalu besar! Maksimal 2MB.');
                          e.target.value = ''; // Reset input
                          return;
                        }
                        setPosterFile(f);
                        setPosterPreview(URL.createObjectURL(f));
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]" />
                  {posterFile && (
                    <p className="mt-2 text-sm text-green-600 font-medium">✓ Selected: {posterFile.name}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCompetitionModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveCompetition}
                  className="flex-1 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors"
                >
                  {editingCompetition ? 'Update' : 'Create'} Competition
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {showSubmissionModal && viewingSubmission && (
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
                  onClick={() => setShowSubmissionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Team Name</label>
                  <p className="text-lg text-[#333333]">{viewingSubmission.team || viewingSubmission.registrationData?.user_pengguna?.name || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Competition</label>
                  <p className="text-lg text-[#333333]">
                    {typeof viewingSubmission.competition === 'string' 
                      ? viewingSubmission.competition 
                      : (viewingSubmission.competition?.title || viewingSubmission.competition?.name || 'N/A')}
                  </p>
                </div>

                {/* Custom Form Data (Dynamic Fields) */}
                {viewingSubmission.registrationData?.form_data && Object.keys(viewingSubmission.registrationData.form_data).length > 0 ? (
                  <div className="space-y-4 pt-2 border-t border-gray-100 mt-2">
                    <h3 className="font-bold text-[#333333] mb-2">Form Data (Proposal)</h3>
                    {Object.entries(viewingSubmission.registrationData.form_data).map(([key, value]) => {
                      const isUrl = typeof value === 'string' && value.startsWith('http');
                      return (
                        <div key={key}>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">{key}</label>
                          {isUrl ? (
                            <a href={value as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#C8102E] hover:underline bg-red-50 px-3 py-2 rounded-lg font-medium">
                              <FileText className="w-4 h-4" />
                              Lihat/Unduh Dokumen
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
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Team Members</label>
                      <p className="text-gray-700">{viewingSubmission.members}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Proposal (Legacy)</label>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                        {viewingSubmission.proposal}
                      </p>
                    </div>
                  </>
                )}

                {/* Legacy Attached Document from data_berkas */}
                {viewingSubmission.registrationData?.data_berkas && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Attached Document (data_berkas)</label>
                    <a href={viewingSubmission.registrationData.data_berkas.file_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#C8102E] hover:underline bg-red-50 px-3 py-2 rounded-lg font-medium">
                      <FileText className="w-4 h-4" />
                      {viewingSubmission.registrationData.data_berkas.nama_berkas || 'Download File'}
                    </a>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${statusColors[viewingSubmission.status]}`}>
                    {viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}
                  </span>
                </div>
              </div>

              {viewingSubmission.status === 'pending' && (
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRejectSubmission(viewingSubmission.id)}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApproveSubmission(viewingSubmission.id)}
                    className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-[#333333] text-center mb-2">Confirm Delete</h2>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Submission Modal */}
      <AnimatePresence>
        {showEditSubmissionModal && editingSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-[#333333]">Edit Submission & Review</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {editingSubmission.registrationData?.user_pengguna?.name || editingSubmission.team || 'Peserta'}
                  </p>
                </div>
                <button onClick={() => setShowEditSubmissionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Info read-only */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Pendaftaran</span>
                    <span className="font-mono font-semibold text-[#333333]">
                      {editingSubmission.registrationData?.nomor_pendaftaran || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Competition</span>
                    <span className="font-semibold text-[#333333]">
                      {editingSubmission.registrationData?.data_lomba?.nama_lomba || 
                       (typeof editingSubmission.competition === 'string' ? editingSubmission.competition : editingSubmission.competition?.title) || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal Daftar</span>
                    <span className="text-[#333333]">
                      {editingSubmission.registrationData?.tgl_daftar 
                        ? new Date(editingSubmission.registrationData.tgl_daftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '-'}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status Pendaftaran</label>
                  <select
                    value={submissionForm.status_pendaftaran}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, status_pendaftaran: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stage</label>
                  <select
                    value={submissionForm.stage}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, stage: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                  >
                    <option value="University">University</option>
                    <option value="National">National</option>
                    <option value="International">International</option>
                  </select>
                </div>

                {/* Lembar Penilaian Proposal */}
                {submissionForm.status_pendaftaran !== 'pending' && (
                  <div className="border-t border-gray-200 pt-5 space-y-4">
                    <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#C8102E]" />
                      Lembar Penilaian Proposal
                    </h3>

                    {/* Overall Score display */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500 font-medium">Nilai Akhir (Rata-rata)</span>
                        <p className="text-xs text-gray-400">Dihitung otomatis dari kriteria di bawah</p>
                      </div>
                      <div className="text-3xl font-extrabold text-[#C8102E]">
                        {submissionForm.overallScore} <span className="text-lg text-gray-400 font-normal">/100</span>
                      </div>
                    </div>

                    {/* Criteria Scores grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {submissionForm.scores.map((scoreObj, idx) => (
                        <div key={scoreObj.criteria}>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            {scoreObj.criteria}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={scoreObj.score}
                              onChange={(e) => handleScoreChange(idx, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8102E] text-sm font-semibold"
                            />
                            <span className="text-gray-400 text-xs font-medium">/100</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reviewer Comments */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Catatan Reviewer</label>
                      <textarea
                        rows={3}
                        value={submissionForm.reviewerComments}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, reviewerComments: e.target.value })}
                        placeholder="Tulis umpan balik menyeluruh untuk proposal ini..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C8102E] text-sm"
                      />
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-600">Kelebihan (Strengths)</label>
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                          {submissionForm.strengths.length === 0 ? (
                            <p className="text-[11px] text-gray-400 italic">Belum ada kelebihan ditambahkan.</p>
                          ) : (
                            submissionForm.strengths.map((str, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
                                <span className="truncate flex-1">{str}</span>
                                <button type="button" onClick={() => removeStrength(idx)} className="text-red-500 hover:text-red-700">
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Tambah kelebihan..."
                            value={submissionForm.newStrength}
                            onChange={(e) => setSubmissionForm({ ...submissionForm, newStrength: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
                            className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={addStrength}
                            className="px-3 py-1.5 bg-gray-800 text-white font-bold rounded-lg text-xs hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Improvements */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-600">Perlu Ditingkatkan (Improvements)</label>
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                          {submissionForm.improvements.length === 0 ? (
                            <p className="text-[11px] text-gray-400 italic">Belum ada saran perbaikan.</p>
                          ) : (
                            submissionForm.improvements.map((imp, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
                                <span className="truncate flex-1">{imp}</span>
                                <button type="button" onClick={() => removeImprovement(idx)} className="text-red-500 hover:text-red-700">
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Tambah perbaikan..."
                            value={submissionForm.newImprovement}
                            onChange={(e) => setSubmissionForm({ ...submissionForm, newImprovement: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImprovement())}
                            className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={addImprovement}
                            className="px-3 py-1.5 bg-gray-800 text-white font-bold rounded-lg text-xs hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditSubmissionModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSaveSubmission}
                  className="flex-1 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25]"
                >
                  Simpan Perubahan
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
