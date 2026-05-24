import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BroadcastManager, BroadcastObserver } from '../utils/broadcastPatterns';
import {
  Trophy, LayoutDashboard, FolderKanban, Users, FileCheck,
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Menu, X as CloseIcon, Search, MessageCircle, LogOut, Calendar, MapPin, DollarSign, AlertCircle, Sun, Moon, Sparkles, Award, ShieldAlert, Download, Image, Megaphone, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  adminCompetitionRows,
  adminSubmissionRows,
  participants as initialParticipants,
  syncCompetitions,
  syncSubmissions,
  syncParticipants,
  syncUserCompetitions,
  syncReviewResults,
  competitions as globalCompetitions,
  submissions as globalSubmissions,
  participants as globalParticipants,
  userCompetitions as globalUserCompetitions,
  reviewResults as globalReviewResults
} from '../data/competitions';
import { appPaths } from '../data/paths';

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
  inactive: 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400',
};

const presetPosters = [
  { name: 'UI/UX Design', url: '/competitions/uiux.jpg', bg: 'from-pink-500 to-rose-500' },
  { name: 'Hackathon', url: '/competitions/hackathon.jpg', bg: 'from-blue-500 to-indigo-600' },
  { name: 'Business Case', url: '/competitions/business.jpg', bg: 'from-amber-500 to-orange-600' },
  { name: 'Data Science', url: '/competitions/data.jpg', bg: 'from-green-500 to-emerald-600' },
  { name: 'Mobile Dev', url: '/competitions/mobile.jpg', bg: 'from-purple-500 to-violet-600' },
  { name: 'Graphic Design', url: '/competitions/graphic.jpg', bg: 'from-red-500 to-pink-600' },
  { name: 'CTF Security', url: '/competitions/ctf.jpg', bg: 'from-slate-700 to-slate-900' },
  { name: 'Digital Marketing', url: '/competitions/marketing.jpg', bg: 'from-yellow-500 to-orange-500' },
  { name: 'Web Dev', url: '/competitions/web.jpg', bg: 'from-sky-500 to-blue-500' },
];

const chartDataRegistrations = [
  { month: 'Jan', registrations: 120, submissions: 45 },
  { month: 'Feb', registrations: 240, submissions: 98 },
  { month: 'Mar', registrations: 390, submissions: 154 },
  { month: 'Apr', registrations: 680, submissions: 280 },
  { month: 'May', registrations: 1247, submissions: 572 },
  { month: 'Jun', registrations: 1450, submissions: 710 },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State management (read from global arrays sync-compatible)
  const [competitions, setCompetitions] = useState(adminCompetitionRows);
  const [submissions, setSubmissions] = useState(adminSubmissionRows);
  const [participants, setParticipants] = useState(initialParticipants);
  
  // Modal states
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<any>(null);
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  
  // Search and advanced filter states
  const [competitionSearch, setCompetitionSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [selectedCompetitionFilter, setSelectedCompetitionFilter] = useState('All');
  const [selectedSubStatusFilter, setSelectedSubStatusFilter] = useState('All');
  const [participantSearch, setParticipantSearch] = useState('');
  
  // Chart toggle metric state
  const [chartMetric, setChartMetric] = useState<'registrations' | 'submissions'>('registrations');
  
  // System-wide persistent announcements state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementUrgency, setAnnouncementUrgency] = useState<'info' | 'warning' | 'critical'>('info');
  const [broadcastsList, setBroadcastsList] = useState<any[]>([]);

  // OBSERVER PATTERN: Subscribe dashboard admin ke BroadcastManager Singleton
  useEffect(() => {
    const manager = BroadcastManager.getInstance();
    const observer: BroadcastObserver = {
      onBroadcastReceived: (list) => {
        setBroadcastsList(list);
      }
    };
    const unsubscribe = manager.subscribe(observer);
    return () => {
      unsubscribe();
    };
  }, []);

  // Grading & Evaluation states
  const [gradingScores, setGradingScores] = useState({
    innovation: 85,
    understanding: 80,
    feasibility: 80,
    presentation: 85,
    team: 80,
  });
  const [gradingFeedback, setGradingFeedback] = useState({
    strengths: 'Strong concept with robust architectural model.\nGood team distribution.',
    improvements: 'Clarify target segment scale.\nFlesh out hardware dependencies.',
    reviewerComments: 'Solid submission. Satisfies the primary requirements of the university pre-selection phase.',
  });

  // Form state
  const [competitionForm, setCompetitionForm] = useState({
    name: '',
    category: '',
    level: '',
    deadline: '',
    prizes: '',
    location: '',
    whatsappGroup: '',
    description: '',
    status: 'draft',
    image: '',
    featured: false,
    recommended: false,
  });

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
      category: '',
      level: '',
      deadline: '',
      prizes: '',
      location: '',
      whatsappGroup: '',
      description: '',
      status: 'draft',
      image: '/competitions/uiux.jpg',
      featured: false,
      recommended: false,
    });
    setShowCompetitionModal(true);
  };

  const handleEditCompetition = (comp: any) => {
    setEditingCompetition(comp);
    setCompetitionForm({
      ...comp,
      image: comp.image || '/competitions/uiux.jpg',
      featured: comp.featured || false,
      recommended: comp.recommended || false,
    });
    setShowCompetitionModal(true);
  };

  const handleSaveCompetition = () => {
    let updatedCompetitions: any[] = [];
    if (editingCompetition) {
      updatedCompetitions = competitions.map(c => 
        c.id === editingCompetition.id ? { 
          ...competitionForm, 
          id: c.id, 
          participants: c.participants 
        } : c
      );
    } else {
      const newComp = {
        ...competitionForm,
        id: competitions.length > 0 ? Math.max(...competitions.map(c => c.id)) + 1 : 1,
        participants: 0,
      };
      updatedCompetitions = [...competitions, newComp];
    }

    setCompetitions(updatedCompetitions);

    // Sync to global reactive array & localStorage
    const newGlobalCompetitions = updatedCompetitions.map(row => {
      const existing = globalCompetitions.find(gc => gc.id === row.id);
      return {
        id: row.id,
        title: row.name,
        shortTitle: row.name,
        description: row.description,
        fullDescription: row.description,
        category: row.category,
        deadline: row.deadline,
        registrationDeadline: row.deadline,
        level: (row.level || 'National') as any,
        participants: row.participants,
        image: row.image || existing?.image || '/competitions/uiux.jpg',
        organizer: existing?.organizer || 'Telkom University',
        location: row.location,
        whatsappGroup: row.whatsappGroup,
        prizes: existing?.prizes || [row.prizes || '$1,000 First Prize'],
        status: (row.status || 'draft') as any,
        featured: row.featured || false,
        recommended: row.recommended || false,
        heroGradient: existing?.heroGradient || 'from-[#C8102E] via-[#E91E3A] to-[#FF4757]',
        highlightColor: existing?.highlightColor || 'from-purple-500 to-pink-500',
        timeline: existing?.timeline || [
          { date: row.deadline, event: 'Registration Deadline', stage: 'University' },
        ],
        requirements: existing?.requirements || ['Must be a student'],
      };
    });
    
    syncCompetitions(newGlobalCompetitions);
    setShowCompetitionModal(false);
  };

  const handleToggleCuration = (id: number, field: 'featured' | 'recommended') => {
    const updated = competitions.map(c => 
      c.id === id ? { ...c, [field]: !c[field as keyof typeof c] } : c
    );
    setCompetitions(updated);
    
    const newGlobal = globalCompetitions.map(gc => {
      if (gc.id === id) {
        return { ...gc, [field]: !gc[field as keyof typeof gc] };
      }
      return gc;
    });
    syncCompetitions(newGlobal);
  };

  const handleDeleteCompetition = (id: number) => {
    setDeleteTarget({ type: 'competition', id });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'competition') {
        const updated = competitions.filter(c => c.id !== deleteTarget.id);
        setCompetitions(updated);
        const newGlobal = globalCompetitions.filter(gc => gc.id !== deleteTarget.id);
        syncCompetitions(newGlobal);
      } else if (deleteTarget.type === 'submission') {
        const updated = submissions.filter(s => s.id !== deleteTarget.id);
        setSubmissions(updated);
        syncSubmissions(updated);
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Graded Proposal Review Submission
  const handleReviewSubmission = (status: 'approved' | 'rejected') => {
    if (!viewingSubmission) return;

    // 1. Update submissions status
    const updatedSubmissions = submissions.map(s => 
      s.id === viewingSubmission.id ? { ...s, status } : s
    );
    setSubmissions(updatedSubmissions);
    syncSubmissions(updatedSubmissions);

    // 2. Generate review result data structures
    const finalScore = Math.round(
      (gradingScores.innovation +
        gradingScores.understanding +
        gradingScores.feasibility +
        gradingScores.presentation +
        gradingScores.team) / 5
    );

    const newReviewResult = {
      competitionId: viewingSubmission.competitionId,
      teamName: viewingSubmission.team,
      submittedDate: viewingSubmission.submittedDate,
      reviewedDate: new Date().toISOString().split('T')[0],
      status,
      overallScore: finalScore,
      maxScore: 100,
      feedback: {
        strengths: gradingFeedback.strengths.split('\n').filter(Boolean),
        improvements: gradingFeedback.improvements.split('\n').filter(Boolean),
      },
      scores: [
        { criteria: 'Innovation & Originality', score: gradingScores.innovation, maxScore: 100 },
        { criteria: 'Problem Understanding', score: gradingScores.understanding, maxScore: 100 },
        { criteria: 'Solution Feasibility', score: gradingScores.feasibility, maxScore: 100 },
        { criteria: 'Presentation Quality', score: gradingScores.presentation, maxScore: 100 },
        { criteria: 'Team Composition', score: gradingScores.team, maxScore: 100 },
      ],
      reviewerComments: gradingFeedback.reviewerComments,
      canProceedToNational: status === 'approved',
    };

    const exists = globalReviewResults.some(r => r.competitionId === viewingSubmission.competitionId);
    let updatedResults = [];
    if (exists) {
      updatedResults = globalReviewResults.map(r => r.competitionId === viewingSubmission.competitionId ? newReviewResult : r);
    } else {
      updatedResults = [...globalReviewResults, newReviewResult];
    }
    syncReviewResults(updatedResults);

    // 3. Update student user competition details status and progress
    const updatedUserCompetitions = globalUserCompetitions.map(uc => {
      if (uc.id === viewingSubmission.competitionId) {
        return {
          ...uc,
          status: (status === 'approved' ? 'university-approved' : 'university-rejected') as any,
          reviewedDate: new Date().toISOString().split('T')[0],
          progress: 100,
        };
      }
      return uc;
    });
    syncUserCompetitions(updatedUserCompetitions);

    setShowSubmissionModal(false);
  };

  const handleToggleParticipantStatus = (id: number) => {
    const updated = participants.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    );
    setParticipants(updated);
    syncParticipants(updated);
  };

  const handleExportParticipantsCSV = () => {
    let csvContent = 'ID,Name,Email,University,Competitions,Status\n';
    participants.forEach(p => {
      const name = p.name.includes(',') ? `"${p.name}"` : p.name;
      const email = p.email;
      const university = p.university.includes(',') ? `"${p.university}"` : p.university;
      csvContent += `${p.id},${name},${email},${university},${p.competitions},${p.status}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'telkom_in_competition_participants.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendBroadcast = () => {
    if (!announcementText.trim()) return;
    
    // SINGLETON PATTERN & SUBJECT: Tambahkan pengumuman baru melalui manager tunggal
    BroadcastManager.getInstance().addBroadcast(announcementText, announcementUrgency);
    
    setAnnouncementText('');
    setShowBroadcastModal(false);
  };

  const handleViewSubmission = (sub: any) => {
    setViewingSubmission(sub);
    const review = globalReviewResults.find(r => r.competitionId === sub.competitionId);
    if (review) {
      const innovationScore = review.scores.find(s => s.criteria.includes('Innovation'))?.score || 85;
      const understandingScore = review.scores.find(s => s.criteria.includes('Understanding'))?.score || 80;
      const feasibilityScore = review.scores.find(s => s.criteria.includes('Feasibility'))?.score || 80;
      const presentationScore = review.scores.find(s => s.criteria.includes('Presentation'))?.score || 85;
      const teamScore = review.scores.find(s => s.criteria.includes('Team'))?.score || 80;

      setGradingScores({
        innovation: innovationScore,
        understanding: understandingScore,
        feasibility: feasibilityScore,
        presentation: presentationScore,
        team: teamScore,
      });

      setGradingFeedback({
        strengths: review.feedback.strengths.join('\n'),
        improvements: review.feedback.improvements.join('\n'),
        reviewerComments: review.reviewerComments,
      });
    } else {
      setGradingScores({
        innovation: 85,
        understanding: 80,
        feasibility: 80,
        presentation: 85,
        team: 80,
      });
      setGradingFeedback({
        strengths: 'Strong concept with robust architectural model.\nGood team distribution.',
        improvements: 'Clarify target segment scale.\nFlesh out hardware dependencies.',
        reviewerComments: 'Solid submission. Satisfies the primary requirements of the university pre-selection phase.',
      });
    }

    setShowSubmissionModal(true);
  };

  // Filter functions
  const filteredCompetitions = competitions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(competitionSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(competitionSearch.toLowerCase());
    const matchesCategoryFilter = selectedCategoryFilter === 'All' || c.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategoryFilter;
  });

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.team.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      s.competition.toLowerCase().includes(submissionSearch.toLowerCase());
    const matchesCompFilter = selectedCompetitionFilter === 'All' || s.competition === selectedCompetitionFilter;
    const matchesStatusFilter = selectedSubStatusFilter === 'All' || s.status.toLowerCase() === selectedSubStatusFilter.toLowerCase();
    return matchesSearch && matchesCompFilter && matchesStatusFilter;
  });

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(participantSearch.toLowerCase())
  );

  const categories = ['All', 'Design', 'IT', 'Business', 'Data Science'];
  const uniqueSubmissionCompetitions = Array.from(new Set(submissions.map(s => s.competition)));

  const handleSidebarClick = (path: string) => {
    setActiveTab(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19]' : 'bg-gray-50'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`fixed left-0 top-0 h-full w-64 text-white hidden lg:block z-40 transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-r border-slate-800' : 'bg-[#222222]'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate(appPaths.home)}>
            <div
              className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/5"
            >
              <img
                src="/assets/telyuuu.png"
                alt="Logo"
                className="w-full h-full object-contain p-1 animate-[spin_8s_linear_infinite]"
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
                  onClick={() => handleSidebarClick(item.path)}
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
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 text-white z-50 flex items-center justify-between px-6 transition-colors duration-300 ${darkMode ? 'bg-[#0F172A] border-b border-slate-800' : 'bg-[#222222]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5">
            <img src="/assets/telyuuu.png" alt="Logo" className="w-full h-full object-contain" />
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
              className={`fixed top-0 bottom-0 left-0 w-64 p-6 flex flex-col z-50 ${darkMode ? 'bg-[#0F172A]' : 'bg-[#222222]'}`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src="/assets/telyuuu.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-sm font-bold text-white">Admin Panel</div>
              </div>

              <nav className="space-y-2 flex-1">
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSidebarClick(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white hover:bg-white/5"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  logout();
                  navigate(appPaths.home);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors mt-auto"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-12">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-4xl font-bold mb-2 transition-colors ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
                Admin Dashboard
              </h1>
              <p className={`text-lg transition-colors ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Manage competitions, participants, and submissions
              </p>
            </div>
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border ${darkMode ? 'bg-[#151F32] border-slate-800 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}`}>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live System Dashboard</span>
            </div>
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
                    : 'bg-white border-gray-100 text-[#333333]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                  <span className={`w-3 h-3 rounded-full ${stat.color} shadow-sm`}></span>
                </div>
                <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</div>
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  stat.change.includes('+') 
                    ? 'text-green-500' 
                    : stat.change === 'urgent' 
                      ? 'text-red-500 animate-pulse' 
                      : 'text-amber-500'
                }`}>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recharts Analytics Curve */}
              <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-100'
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
                      <Sparkles className="w-5 h-5 text-red-500" />
                      Campus Competition Metrics
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      Real-time statistical trend analysis
                    </p>
                  </div>
                  <div className="flex bg-gray-100 dark:bg-[#1D2B44] p-1 rounded-xl">
                    <button
                      onClick={() => setChartMetric('registrations')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        chartMetric === 'registrations'
                          ? 'bg-[#C8102E] text-white shadow-sm'
                          : darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Active Registrations
                    </button>
                    <button
                      onClick={() => setChartMetric('submissions')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        chartMetric === 'submissions'
                          ? 'bg-[#C8102E] text-white shadow-sm'
                          : darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Submissions Received
                    </button>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDataRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8102E" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#C8102E" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155/30' : '#E2E8F0'} vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke={darkMode ? '#94A3B8' : '#64748B'} 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke={darkMode ? '#94A3B8' : '#64748B'} 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                          border: `1px solid ${darkMode ? '#475569' : '#E2E8F0'}`,
                          borderRadius: '12px',
                          color: darkMode ? '#FFFFFF' : '#333333',
                          fontSize: '12px',
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={chartMetric} 
                        stroke="#C8102E" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#metricGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className={`lg:col-span-2 rounded-2xl border p-6 transition-all duration-300 ${
                  darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-100'
                }`}>
                  <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
                    Recent Activity & Submissions
                  </h2>
                  <div className="space-y-4">
                    {submissions.slice(0, 5).map((sub) => (
                      <div 
                        key={sub.id} 
                        onClick={() => handleViewSubmission(sub)}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                          darkMode 
                            ? 'bg-[#1D2B44]/50 border-slate-800/80 hover:bg-[#1D2B44] hover:border-slate-700' 
                            : 'bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            sub.status === 'pending' 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : sub.status === 'approved' 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-red-500/10 text-red-500'
                          }`}>
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              Team: {sub.team}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              {sub.competition}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {new Date(sub.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            sub.status === 'pending' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : sub.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Column */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#C8102E] to-[#E91E3A] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      Quick Actions
                    </h2>
                    <p className="text-white/80 text-sm mb-6">Manage system settings and actions immediately.</p>
                    
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateCompetition}
                        className="w-full px-4 py-3 bg-white text-[#C8102E] font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3 shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Create Competition</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('submissions')}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors flex items-center gap-3 text-white font-bold"
                      >
                        <FileCheck className="w-5 h-5" />
                        <span>Review Submissions ({submissions.filter(s => s.status === 'pending').length})</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className={`rounded-2xl border p-6 ${
                    darkMode ? 'bg-[#151F32] border-slate-800 text-white' : 'bg-white border-gray-100 text-gray-700'
                  }`}>
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-red-500">
                      <ShieldAlert className="w-5 h-5" />
                      Security & Access
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'} leading-relaxed`}>
                      This is the administrator portal of Telkom University. All edits, review outcomes, and deletions are active and logged under the administrative supervisor session.
                    </p>
                  </div>
                </div>
              </div>

              {/* Megaphone System Broadcast Card */}
              <div className={`rounded-2xl border p-6 transition-all duration-300 ${
                darkMode ? 'bg-[#151F32] border-slate-800 text-white' : 'bg-white border-gray-100 text-[#333333]'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#C8102E] animate-bounce" />
                    System Broadcasts & Announcements
                  </h3>
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="text-xs font-bold text-[#C8102E] hover:text-[#A00D25] flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Broadcast
                  </button>
                </div>
                <div className="space-y-3">
                  {broadcastsList.slice(0, 3).map((b) => (
                    <div 
                      key={b.id} 
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${
                        b.urgency === 'critical'
                          ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
                          : b.urgency === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 bg-current animate-pulse"></div>
                      <div className="flex-1">
                        <div className="font-semibold">{b.text}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{b.date} • Urgency: {b.urgency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitions' && (
            <div className={`rounded-2xl border transition-all duration-300 ${
              darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search competitions..."
                      value={competitionSearch}
                      onChange={(e) => setCompetitionSearch(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                        darkMode 
                          ? 'bg-[#1D2B44] border-slate-700 text-white placeholder:text-slate-500' 
                          : 'bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400'
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

                {/* Category Pills Filters */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/40">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        selectedCategoryFilter === cat
                          ? 'bg-[#C8102E] text-white shadow-sm shadow-[#C8102E]/20'
                          : darkMode
                            ? 'bg-[#1D2B44] text-slate-300 hover:bg-[#253755]'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-[#1D2B44]/50' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Category</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Level</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Participants</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Deadline</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Curation</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {filteredCompetitions.map((comp) => (
                      <tr key={comp.id} className={darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'}>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}>{comp.name}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{comp.category}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{comp.level}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{comp.participants}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                          {new Date(comp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold">
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => handleToggleCuration(comp.id, 'featured')}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase transition-all max-w-max border ${
                                comp.featured
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                                  : darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200' : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-gray-600'
                              }`}
                            >
                              ★ Featured: {comp.featured ? 'Yes' : 'No'}
                            </button>
                            <button
                              onClick={() => handleToggleCuration(comp.id, 'recommended')}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase transition-all max-w-max border ${
                                comp.recommended
                                  ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20'
                                  : darkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200' : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-gray-600'
                              }`}
                            >
                              ♥ Recom: {comp.recommended ? 'Yes' : 'No'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[comp.status]}`}>
                            {comp.status.charAt(0).toUpperCase() + comp.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(appPaths.competition(comp.id))}
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditCompetition(comp)}
                              className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompetition(comp.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
            <div className={`rounded-2xl border transition-all duration-300 ${
              darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>All Submissions</h2>
                  <div className="flex-1 relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search submissions..."
                      value={submissionSearch}
                      onChange={(e) => setSubmissionSearch(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                        darkMode 
                          ? 'bg-[#1D2B44] border-slate-700 text-white' 
                          : 'bg-gray-50 border border-gray-200 text-gray-800'
                      }`}
                    />
                  </div>
                </div>

                {/* Submissions advanced filter dropdown & status selectors */}
                <div className="flex flex-col lg:flex-row gap-4 pt-2 border-t border-gray-100 dark:border-slate-800/40">
                  <div className="flex-1">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      Filter by Competition
                    </label>
                    <select
                      value={selectedCompetitionFilter}
                      onChange={(e) => setSelectedCompetitionFilter(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                        darkMode ? 'bg-[#1D2B44] text-white border-slate-700' : 'bg-gray-50 border border-gray-200 text-gray-800'
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
                    <div className="flex bg-gray-100 dark:bg-[#1D2B44] p-1 rounded-xl border border-gray-200 dark:border-slate-800">
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
                  <thead className={darkMode ? 'bg-[#1D2B44]/50' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Team Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Competition</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Submitted</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className={darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'}>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}>{sub.team}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{sub.competition}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                          {new Date(sub.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[sub.status]}`}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewSubmission(sub)}
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="View & Evaluate"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {sub.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => { setViewingSubmission(sub); handleReviewSubmission('approved'); }}
                                  className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                  title="Approve Instantly"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => { setViewingSubmission(sub); handleReviewSubmission('rejected'); }}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Reject Instantly"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className={`rounded-2xl border transition-all duration-300 ${
              darkMode ? 'bg-[#151F32] border-slate-800' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#333333]'}`}>All Participants</h2>
                <div className="flex flex-1 items-center gap-3 max-w-xl w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search participants..."
                      value={participantSearch}
                      onChange={(e) => setParticipantSearch(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] ${
                        darkMode 
                          ? 'bg-[#1D2B44] border-slate-700 text-white' 
                          : 'bg-gray-50 border border-gray-200 text-gray-800'
                      }`}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportParticipantsCSV}
                    className="px-5 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md shadow-green-600/15"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-[#1D2B44]/50' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>University</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Competitions</th>
                      <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-200'}`}>
                    {filteredParticipants.map((participant) => (
                      <tr key={participant.id} className={darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'}>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-[#333333]'}`}>{participant.name}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{participant.email}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{participant.university}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{participant.competitions}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleParticipantStatus(participant.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all duration-200 shadow-sm ${
                              participant.status === 'active'
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                                : 'bg-gray-500/10 text-gray-500 border border-gray-500/20 hover:bg-gray-500/20'
                            }`}
                          >
                            {participant.status}
                          </button>
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

      {/* Broadcast Announcement Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-md w-full border shadow-2xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-[#151F32] border-slate-800 text-white' : 'bg-white border-gray-100'
              }`}
            >
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Megaphone className="w-6 h-6 text-red-500" />
                Launch System Announcement
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Announcement Text
                  </label>
                  <textarea
                    rows={3}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Broadcast text to all campus channels..."
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none focus:border-[#C8102E] ${
                      darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Urgency Category
                  </label>
                  <select
                    value={announcementUrgency}
                    onChange={(e) => setAnnouncementUrgency(e.target.value as any)}
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${
                      darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="critical">Critical Urgency (Red)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className={`flex-1 py-3 border font-bold rounded-xl transition-colors ${
                    darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBroadcast}
                  className="flex-1 py-3 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors"
                >
                  Launch Alert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Competition Modal */}
      <AnimatePresence>
        {showCompetitionModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl transition-colors duration-300 ${
                darkMode ? 'bg-[#151F32] border-slate-800 text-white' : 'bg-white border-gray-100 text-[#333333]'
              }`}
            >
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${
                darkMode ? 'bg-[#151F32]/95 border-slate-800' : 'bg-white border-gray-200'
              }`}>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-red-500" />
                  {editingCompetition ? 'Edit Competition' : 'Create New Competition'}
                </h2>
                <button
                  onClick={() => setShowCompetitionModal(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Competition Name *
                  </label>
                  <input
                    type="text"
                    value={competitionForm.name}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                      darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder="e.g., UI/UX Design Competition 2026"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <select
                      value={competitionForm.category}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, category: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                        darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <option value="">Select category</option>
                      <option value="Design">Design</option>
                      <option value="IT">IT</option>
                      <option value="Business">Business</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Level *
                    </label>
                    <select
                      value={competitionForm.level}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, level: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                        darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <option value="">Select level</option>
                      <option value="University">University</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                {/* Poster Picker Component */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-[#1D2B44]/25 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Competition Poster Banner *
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div className="sm:col-span-2">
                      <input
                        type="url"
                        value={competitionForm.image}
                        onChange={(e) => setCompetitionForm({ ...competitionForm, image: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors text-xs mb-2 ${
                          darkMode ? 'bg-[#151F32] border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-200'
                        }`}
                        placeholder="Enter custom banner image URL or pick one below..."
                      />
                      <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        Provide any hosted web image path, or select from preselected assets below.
                      </p>
                    </div>
                    
                    <div className={`h-24 rounded-lg overflow-hidden border relative flex items-center justify-center ${
                      darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-100'
                    }`}>
                      {competitionForm.image ? (
                        <img
                          src={competitionForm.image}
                          alt="Poster Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center p-2 text-gray-400">
                          <Image className="w-5 h-5 mx-auto mb-0.5" />
                          <span className="text-[10px]">No Poster</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preset Poster Grids */}
                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 p-1.5 bg-gray-200/50 dark:bg-slate-900/40 rounded-lg">
                    {presetPosters.map(poster => (
                      <button
                        key={poster.url}
                        type="button"
                        onClick={() => setCompetitionForm({ ...competitionForm, image: poster.url })}
                        className={`group flex flex-col items-center p-1 rounded transition-all border ${
                          competitionForm.image === poster.url
                            ? 'border-[#C8102E] bg-white dark:bg-slate-800 shadow-sm'
                            : 'border-transparent hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-full aspect-[4/3] rounded overflow-hidden bg-gradient-to-br ${poster.bg} mb-0.5 flex items-center justify-center text-[6px] font-extrabold text-white text-center p-0.5 shadow-inner`}>
                          {poster.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <Calendar className="w-4 h-4 text-red-500" />
                      Deadline *
                    </label>
                    <input
                      type="date"
                      value={competitionForm.deadline}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, deadline: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                        darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <DollarSign className="w-4 h-4 text-red-500" />
                      Prize Pool *
                    </label>
                    <input
                      type="text"
                      value={competitionForm.prizes}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, prizes: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                        darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="e.g., $10,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <MapPin className="w-4 h-4 text-red-500" />
                      Location *
                    </label>
                    <input
                      type="text"
                      value={competitionForm.location}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, location: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                        darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="e.g., Online, Jakarta, Bandung"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <MessageCircle className="w-4 h-4 text-red-500" />
                      WhatsApp Group Link *
                    </label>
                    <input
                      type="url"
                      value={competitionForm.whatsappGroup}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, whatsappGroup: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                        darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                      }`}
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                </div>

                {/* Featured / Recommended Switches */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-900/40 border dark:border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">★ Featured Curation</div>
                      <div className="text-[10px] text-gray-500">Show in Landing Carousel</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompetitionForm({ ...competitionForm, featured: !competitionForm.featured })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${competitionForm.featured ? 'bg-amber-500' : 'bg-gray-400'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${competitionForm.featured ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">♥ Recommended</div>
                      <div className="text-[10px] text-gray-500">Show in recommendation lists</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompetitionForm({ ...competitionForm, recommended: !competitionForm.recommended })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${competitionForm.recommended ? 'bg-purple-500' : 'bg-gray-400'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${competitionForm.recommended ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Description *
                  </label>
                  <textarea
                    value={competitionForm.description}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, description: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                      darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder="Describe the competition..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Status *
                  </label>
                  <select
                    value={competitionForm.status}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, status: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-[#C8102E] transition-colors ${
                      darkMode ? 'bg-[#1D2B44] border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className={`p-6 border-t flex gap-3 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCompetitionModal(false)}
                  className={`flex-1 py-3 border-2 font-bold rounded-xl transition-colors ${
                    darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
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

      {/* Submission Detail Modal with Grading Feedback */}
      <AnimatePresence>
        {showSubmissionModal && viewingSubmission && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl transition-colors duration-300 ${
                darkMode ? 'bg-[#151F32] border-slate-800 text-white' : 'bg-white border-gray-100 text-[#333333]'
              }`}
            >
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${
                darkMode ? 'bg-[#151F32]/95 border-slate-800' : 'bg-white border-gray-200'
              }`}>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Award className="w-6 h-6 text-red-500" />
                  Submission Details & Evaluation
                </h2>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Team Name</label>
                    <p className="text-lg font-bold">{viewingSubmission.team}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Competition</label>
                    <p className="text-base font-semibold">{viewingSubmission.competition}</p>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Team Members</label>
                  <p className="text-sm">{viewingSubmission.members}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Submitted Date</label>
                    <p className="text-sm">
                      {new Date(viewingSubmission.submittedDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Current Status</label>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[viewingSubmission.status]}`}>
                      {viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Proposal Abstract</label>
                  <p className={`text-sm leading-relaxed p-4 rounded-xl border ${
                    darkMode ? 'bg-[#1D2B44]/40 border-slate-800' : 'bg-gray-50 border-gray-100'
                  }`}>
                    {viewingSubmission.proposal}
                  </p>
                </div>

                {/* Proposal Evaluation / Grading inputs (Shown for pending submissions) */}
                {viewingSubmission.status === 'pending' && (
                  <div className={`mt-6 p-6 rounded-xl border ${
                    darkMode ? 'bg-[#1D2B44]/40 border-slate-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <Award className="w-5 h-5 text-red-500" />
                      Grading & Evaluation
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Innovation & Originality (0 - 100): {gradingScores.innovation}
                        </label>
                        <input 
                          type="range" min="0" max="100" 
                          value={gradingScores.innovation}
                          onChange={(e) => setGradingScores({...gradingScores, innovation: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Problem Understanding (0 - 100): {gradingScores.understanding}
                        </label>
                        <input 
                          type="range" min="0" max="100" 
                          value={gradingScores.understanding}
                          onChange={(e) => setGradingScores({...gradingScores, understanding: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Solution Feasibility (0 - 100): {gradingScores.feasibility}
                        </label>
                        <input 
                          type="range" min="0" max="100" 
                          value={gradingScores.feasibility}
                          onChange={(e) => setGradingScores({...gradingScores, feasibility: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Presentation Quality (0 - 100): {gradingScores.presentation}
                        </label>
                        <input 
                          type="range" min="0" max="100" 
                          value={gradingScores.presentation}
                          onChange={(e) => setGradingScores({...gradingScores, presentation: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Team Composition (0 - 100): {gradingScores.team}
                        </label>
                        <input 
                          type="range" min="0" max="100" 
                          value={gradingScores.team}
                          onChange={(e) => setGradingScores({...gradingScores, team: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                      </div>

                      <div className="pt-2">
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Strengths (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={gradingFeedback.strengths}
                          onChange={(e) => setGradingFeedback({...gradingFeedback, strengths: e.target.value})}
                          placeholder="e.g., Clear target market&#10;Highly scalable solution"
                          className={`w-full p-3 rounded-lg border text-sm ${
                            darkMode ? 'bg-[#151F32] border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Areas for Improvement (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={gradingFeedback.improvements}
                          onChange={(e) => setGradingFeedback({...gradingFeedback, improvements: e.target.value})}
                          placeholder="e.g., Timeline needs more buffer&#10;Flesh out financial projections"
                          className={`w-full p-3 rounded-lg border text-sm ${
                            darkMode ? 'bg-[#151F32] border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          Reviewer Comments
                        </label>
                        <textarea
                          rows={3}
                          value={gradingFeedback.reviewerComments}
                          onChange={(e) => setGradingFeedback({...gradingFeedback, reviewerComments: e.target.value})}
                          placeholder="Overall comments and feedback for the team..."
                          className={`w-full p-3 rounded-lg border text-sm ${
                            darkMode ? 'bg-[#151F32] border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-6 border-t flex gap-3 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                {viewingSubmission.status === 'pending' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReviewSubmission('rejected')}
                      className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/10"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject with Feedback
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReviewSubmission('approved')}
                      className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-500/10"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve with Feedback
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSubmissionModal(false)}
                    className={`w-full py-3 font-bold rounded-xl transition-colors ${
                      darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Close
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl max-w-md w-full border shadow-2xl p-6 transition-colors duration-300 ${
                darkMode ? 'bg-[#151F32] border-slate-800 text-white' : 'bg-white border-gray-100'
              }`}
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Confirm Delete</h2>
              <p className={`text-center mb-6 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 py-3 border-2 font-bold rounded-xl transition-colors ${
                    darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
