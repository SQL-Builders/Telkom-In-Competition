import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, LayoutDashboard, FolderKanban, Users, FileCheck,
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Menu, X as CloseIcon, Search, MessageCircle, LogOut, Calendar, MapPin, DollarSign, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { adminCompetitionRows, adminSubmissionRows, participants as initialParticipants } from '../data/competitions';
import { appPaths } from '../data/paths';

const adminNavigation = [
  { name: 'Dashboard', path: 'overview', icon: LayoutDashboard },
  { name: 'Manage Competitions', path: 'competitions', icon: FolderKanban },
  { name: 'Participants', path: 'participants', icon: Users },
  { name: 'Submissions', path: 'submissions', icon: FileCheck },
];

const statusColors = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  draft: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-orange-100 text-orange-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-700',
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State management
  const [competitions, setCompetitions] = useState(adminCompetitionRows);
  const [submissions, setSubmissions] = useState(adminSubmissionRows);
  const [participants, setParticipants] = useState(initialParticipants);
  
  // Modal states
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState(null);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Search states
  const [competitionSearch, setCompetitionSearch] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [participantSearch, setParticipantSearch] = useState('');
  
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
    status: 'draft'
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
      status: 'draft'
    });
    setShowCompetitionModal(true);
  };

  const handleEditCompetition = (comp) => {
    setEditingCompetition(comp);
    setCompetitionForm(comp);
    setShowCompetitionModal(true);
  };
// Note: In a real application, you would also want to handle form validation and error handling for the competition form.
  const handleSaveCompetition = () => {
    if (editingCompetition) {
      // Update existing
      setCompetitions(competitions.map(c => 
        c.id === editingCompetition.id ? { ...competitionForm, id: c.id, participants: c.participants } : c
      ));
    } else {
      // Create new
      const newComp = {
        ...competitionForm,
        id: Math.max(...competitions.map(c => c.id)) + 1,
        participants: 0,
      };
      setCompetitions([...competitions, newComp]);
    }
    setShowCompetitionModal(false);
  };

  const handleDeleteCompetition = (id) => {
    setDeleteTarget({ type: 'competition', id });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'competition') {
        setCompetitions(competitions.filter(c => c.id !== deleteTarget.id));
      } else if (deleteTarget.type === 'submission') {
        setSubmissions(submissions.filter(s => s.id !== deleteTarget.id));
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Submission actions
  const handleViewSubmission = (sub) => {
    setViewingSubmission(sub);
    setShowSubmissionModal(true);
  };

  const handleApproveSubmission = (id) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'approved' } : s
    ));
    setShowSubmissionModal(false);
  };

  const handleRejectSubmission = (id) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'rejected' } : s
    ));
    setShowSubmissionModal(false);
  };

  // Filter functions
  const filteredCompetitions = competitions.filter(c => 
    c.name.toLowerCase().includes(competitionSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(competitionSearch.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(s => 
    s.team.toLowerCase().includes(submissionSearch.toLowerCase()) ||
    s.competition.toLowerCase().includes(submissionSearch.toLowerCase())
  );

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(participantSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#333333] text-white hidden lg:block z-40">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate(appPaths.home)}>
            {/* <div className="w-10 h-10 bg-[#C8102E] rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div> */}
             <div
              className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ 
                animation: 'glowPulse 3s ease-in-out infinite',
                background: 'rgba(255,255,255,0.05)' // Opsional: beri sedikit background agar terlihat rapi
              }}
            >
              <img
                src="/assets/telyuuu.png"
                alt="Logo"
                className="w-full h-full object-contain p-1" // object-contain agar logo tidak terpotong, p-1 agar ada jarak ke tepi
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
                      ? 'bg-[#C8102E] text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              logout();
              navigate(appPaths.home);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#333333] text-white z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C8102E] rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm font-bold">Admin Panel</div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#333333] mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Manage competitions, participants, and submissions</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <div className="text-3xl font-bold text-[#333333] mb-2">{stat.value}</div>
                <div className="text-gray-600 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-[#333333] mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-[#C8102E] rounded-full"></div>
                      <span className="text-sm text-gray-700 flex-1">
                        New submission from {sub.team}
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
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search competitions..."
                    value={competitionSearch}
                    onChange={(e) => setCompetitionSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
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
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Competition Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Level</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Participants</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Deadline</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCompetitions.map((comp) => (
                      <tr key={comp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#333333]">{comp.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{comp.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{comp.level}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{comp.participants}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(comp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditCompetition(comp)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompetition(comp.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#333333]">All Submissions</h2>
                <div className="flex-1 relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Team Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Competition</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#333333]">{sub.team}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{sub.competition}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
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
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {sub.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveSubmission(sub.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleRejectSubmission(sub.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
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
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#333333]">All Participants</h2>
                <div className="flex-1 relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">University</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Competitions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredParticipants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#333333]">{participant.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{participant.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{participant.university}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{participant.competitions}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[participant.status]}`}>
                            {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
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

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Competition Name *
                  </label>
                  <input
                    type="text"
                    value={competitionForm.name}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="e.g., UI/UX Design Competition 2026"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={competitionForm.category}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    >
                      <option value="">Select category</option>
                      <option value="Design">Design</option>
                      <option value="IT">IT</option>
                      <option value="Business">Business</option>
                      <option value="Data">Data Science</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      value={competitionForm.level}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, level: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    >
                      <option value="">Select level</option>
                      <option value="University">University</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Deadline *
                    </label>
                    <input
                      type="date"
                      value={competitionForm.deadline}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, deadline: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Prize Pool *
                    </label>
                    <input
                      type="text"
                      value={competitionForm.prizes}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, prizes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                      placeholder="e.g., $10,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={competitionForm.location}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="e.g., Online, Jakarta, Bandung"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    WhatsApp Group Link *
                  </label>
                  <input
                    type="url"
                    value={competitionForm.whatsappGroup}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, whatsappGroup: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={competitionForm.description}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                    placeholder="Describe the competition..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={competitionForm.status}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
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
                  <p className="text-lg text-[#333333]">{viewingSubmission.team}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Competition</label>
                  <p className="text-lg text-[#333333]">{viewingSubmission.competition}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Team Members</label>
                  <p className="text-gray-700">{viewingSubmission.members}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Submitted Date</label>
                  <p className="text-gray-700">
                    {new Date(viewingSubmission.submittedDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Proposal</label>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {viewingSubmission.proposal}
                  </p>
                </div>

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
    </div>
  );
}
