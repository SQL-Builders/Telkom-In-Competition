import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { Calendar, Users, MapPin, Trophy, Clock, CheckCircle, ArrowLeft, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

export function CompetitionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const competition = {
    id: 1,
    title: 'International UI/UX Design Competition 2026',
    description: 'Join us for an exciting opportunity to showcase your design skills and compete with talented designers from around the world. This competition challenges you to create innovative, user-friendly interfaces that solve real-world problems.',
    fullDescription: `This competition is designed to push the boundaries of user experience design. Participants will work on creating intuitive and visually appealing interfaces for a variety of platforms including web, mobile, and desktop applications.

IMPORTANT: This competition uses a two-stage selection process:
1. University Stage: Submit your proposal for review by Telkom University judges. Only approved proposals can proceed to the national stage.
2. National Stage: Approved teams compete at the national level with participants from other universities across Indonesia.

You'll be given a real-world problem statement and challenged to create a complete design solution including user research, wireframes, prototypes, and final high-fidelity designs. The competition emphasizes both aesthetic excellence and functional usability.`,
    category: 'UI/UX',
    deadline: '2026-05-15',
    registrationDeadline: '2026-04-30',
    level: 'International',
    participants: 1247,
    prizes: ['$5,000 First Prize', '$3,000 Second Prize', '$1,500 Third Prize'],
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/example-uiux-competition', // Tambah WhatsApp Group
    timeline: [
      { date: '2026-04-01', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-04-15', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-04-22', event: 'University Review Results', stage: 'University' },
      { date: '2026-04-25', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-05-01', event: 'National Competition Begins', stage: 'National' },
      { date: '2026-05-15', event: 'National Submission Deadline', stage: 'National' },
      { date: '2026-05-25', event: 'Winners Announced', stage: 'National' },
    ],
    requirements: [
      'Must be a currently enrolled student',
      'Individual or team participation (max 3 members)',
      'Submit original work only',
      'Follow design guidelines and requirements',
      'Present work in English',
    ],
  };

  const daysLeft = Math.ceil((new Date(competition.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C8102E] to-[#E91E3A] text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                    {competition.category}
                  </span>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
                    {competition.level}
                  </span>
                  <span className={`px-4 py-1.5 backdrop-blur-sm rounded-lg font-semibold ${
                    daysLeft <= 7 ? 'bg-red-500 text-white' : 'bg-white/20'
                  }`}>
                    {daysLeft} days left
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {competition.title}
                </h1>

                <p className="text-xl text-white/90 mb-6 max-w-3xl">
                  {competition.description}
                </p>

                <div className="flex flex-wrap gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Deadline: {new Date(competition.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{competition.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{competition.location}</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">About This Competition</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {competition.fullDescription}
                </div>
              </section>

              {/* Timeline */}
              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">Competition Timeline</h2>
                <div className="space-y-4">
                  {competition.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.stage === 'University' ? 'bg-blue-500' : 'bg-[#C8102E]'
                        }`}>
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        {index < competition.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            item.stage === 'University'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.stage}
                          </span>
                        </div>
                        <div className="font-semibold text-[#333333]">{item.event}</div>
                        <div className="text-gray-600">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-2xl font-bold text-[#333333] mb-4">Requirements</h2>
                <div className="space-y-3">
                  {competition.requirements.map((req, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Register Card */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-[#C8102E] mb-2">
                    {competition.prizes[0].split(' ')[0]}
                  </div>
                  <div className="text-gray-600">Total Prize Pool</div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                  <div className="text-sm font-semibold text-blue-900 mb-2">📋 Competition Stages</div>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>1. Submit University Proposal</div>
                    <div>2. University Review (7-14 days)</div>
                    <div>3. If approved → National Stage</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/competition/${id}/university-proposal`)}
                  className="w-full py-4 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg mb-4"
                >
                  Submit University Proposal
                </motion.button>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Organizer</div>
                    <div className="font-semibold text-[#333333]">{competition.organizer}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Registration Deadline</div>
                    <div className="font-semibold text-[#333333]">
                      {new Date(competition.registrationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prizes */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <h3 className="font-bold text-[#333333]">Prizes</h3>
                </div>
                <div className="space-y-2">
                  {competition.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{prize}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Group */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-[#333333]">Join Our Community</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Bergabung dengan grup WhatsApp untuk update, diskusi, dan networking dengan peserta lain.
                </p>
                <motion.a
                  href={competition.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join WhatsApp Group
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}