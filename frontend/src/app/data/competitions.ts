export type CompetitionLevel = 'University' | 'National' | 'International';
export type CompetitionStatus = 'draft' | 'active' | 'completed';
export type UserCompetitionStatus =
  | 'not-started'
  | 'university-pending'
  | 'university-approved'
  | 'university-rejected'
  | 'national-submitted'
  | 'national-reviewed';

export interface Competition {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription: string;
  category: string;
  deadline: string;
  registrationDeadline: string;
  level: CompetitionLevel;
  participants: number;
  image: string;
  organizer: string;
  location: string;
  whatsappGroup: string;
  prizes: string[];
  status: CompetitionStatus;
  featured: boolean;
  recommended: boolean;
  heroGradient: string;
  highlightColor: string;
  timeline: Array<{
    date: string;
    event: string;
    stage: 'University' | 'National';
  }>;
  requirements: string[];
}

export interface UserCompetition {
  id: number;
  status: UserCompetitionStatus;
  stage: 'University' | 'National';
  submittedDate?: string;
  reviewedDate?: string;
  progress: number;
}

export interface ReviewResultData {
  competitionId: number;
  teamName: string;
  submittedDate: string;
  reviewedDate: string;
  status: 'approved' | 'rejected';
  overallScore: number;
  maxScore: number;
  feedback: {
    strengths: string[];
    improvements: string[];
  };
  scores: Array<{
    criteria: string;
    score: number;
    maxScore: number;
  }>;
  reviewerComments: string;
  canProceedToNational: boolean;
}

export interface Submission {
  id: number;
  competitionId: number;
  competition: string;
  team: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  proposal: string;
  members: string;
}

export const competitions: Competition[] = [
  {
    id: 1,
    title: 'International UI/UX Design Competition 2026',
    shortTitle: 'UI/UX Design Competition',
    description: 'Design innovative and user-friendly interfaces that solve real-world problems.',
    fullDescription:
      'This competition is designed to push the boundaries of user experience design. Participants will work on intuitive and visually appealing interfaces for web, mobile, and desktop platforms.\n\nIMPORTANT: This competition uses a two-stage selection process:\n1. University Stage: Submit your proposal for review by Telkom University judges. Only approved proposals can proceed to the national stage.\n2. National Stage: Approved teams compete at the national level with participants from other universities across Indonesia.\n\nYou will be given a real-world problem statement and challenged to create a complete design solution including user research, wireframes, prototypes, and final high-fidelity designs.',
    category: 'UI/UX',
    deadline: '2026-05-15',
    registrationDeadline: '2026-04-30',
    level: 'International',
    participants: 1247,
    image: '/competitions/uiux.jpg',
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/example-uiux-competition',
    prizes: ['$5,000 First Prize', '$3,000 Second Prize', '$1,500 Third Prize'],
    status: 'active',
    featured: true,
    recommended: true,
    heroGradient: 'from-[#C8102E] via-[#E91E3A] to-[#FF4757]',
    highlightColor: 'from-purple-500 to-pink-500',
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
      'Individual or team participation, maximum 3 members',
      'Submit original work only',
      'Follow design guidelines and requirements',
      'Present work in English',
    ],
  },
  {
    id: 2,
    title: 'National Hackathon: Smart City Solutions',
    shortTitle: 'National Hackathon 2026',
    description: 'Build technology solutions that make cities smarter, safer, and more sustainable.',
    fullDescription:
      'A 48-hour coding challenge for students to build practical smart city solutions. Teams will prototype software, hardware, or hybrid products that address mobility, safety, energy, public services, or sustainability.',
    category: 'IT',
    deadline: '2026-04-28',
    registrationDeadline: '2026-04-20',
    level: 'National',
    participants: 856,
    image: '/competitions/hackathon.jpg',
    organizer: 'Telkom University',
    location: 'Jakarta',
    whatsappGroup: 'https://chat.whatsapp.com/hackathon',
    prizes: ['$8,000 First Prize', '$4,000 Second Prize', '$2,000 Third Prize'],
    status: 'active',
    featured: true,
    recommended: false,
    heroGradient: 'from-[#A00D25] via-[#C8102E] to-[#E91E3A]',
    highlightColor: 'from-blue-500 to-cyan-500',
    timeline: [
      { date: '2026-04-05', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-04-20', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-04-24', event: 'University Review Results', stage: 'University' },
      { date: '2026-04-25', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-04-28', event: 'Hackathon Begins', stage: 'National' },
    ],
    requirements: [
      'Team participation, 2-4 members',
      'At least one developer per team',
      'Prototype must be built during the event',
      'Submit repository and presentation deck',
    ],
  },
  {
    id: 3,
    title: 'Business Innovation Challenge 2026',
    shortTitle: 'Business Innovation',
    description: 'Present your innovative business ideas and compete for funding.',
    fullDescription:
      'A business case and venture pitching competition for student teams with innovative, feasible, and scalable ideas. Participants will submit proposals, validate the market, and pitch to a panel of academic and industry judges.',
    category: 'Business',
    deadline: '2026-06-10',
    registrationDeadline: '2026-05-25',
    level: 'National',
    participants: 623,
    image: '/competitions/business.jpg',
    organizer: 'Telkom University',
    location: 'Bandung',
    whatsappGroup: 'https://chat.whatsapp.com/business',
    prizes: ['$5,000 First Prize', '$2,500 Second Prize', '$1,000 Third Prize'],
    status: 'active',
    featured: true,
    recommended: false,
    heroGradient: 'from-[#8A0B1F] via-[#A00D25] to-[#C8102E]',
    highlightColor: 'from-orange-500 to-red-500',
    timeline: [
      { date: '2026-05-01', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-05-25', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-05-31', event: 'University Review Results', stage: 'University' },
      { date: '2026-06-01', event: 'National Pitch Registration Opens', stage: 'National' },
      { date: '2026-06-10', event: 'Final Pitch Day', stage: 'National' },
    ],
    requirements: [
      'Team participation, maximum 3 members',
      'Business proposal and pitch deck',
      'Market validation summary',
      'Financial projection summary',
    ],
  },
  {
    id: 4,
    title: 'Data Science & AI Competition',
    shortTitle: 'Data Science Challenge',
    description: 'Analyze complex datasets and build predictive models.',
    fullDescription:
      'Students solve analytical problems using data science and AI techniques. Teams will submit methodology, notebooks, model results, and a short explanation of business impact.',
    category: 'Data Science',
    deadline: '2026-05-22',
    registrationDeadline: '2026-05-10',
    level: 'International',
    participants: 1089,
    image: '/competitions/data.jpg',
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/datascience',
    prizes: ['$12,000 First Prize', '$6,000 Second Prize', '$3,000 Third Prize'],
    status: 'active',
    featured: true,
    recommended: true,
    heroGradient: 'from-green-600 via-emerald-600 to-teal-500',
    highlightColor: 'from-green-500 to-emerald-500',
    timeline: [
      { date: '2026-05-01', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-05-10', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-05-15', event: 'University Review Results', stage: 'University' },
      { date: '2026-05-16', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-05-22', event: 'Model Submission Deadline', stage: 'National' },
    ],
    requirements: [
      'Team participation, maximum 3 members',
      'Submit notebook and model explanation',
      'Use only allowed datasets',
      'Include reproducible methodology',
    ],
  },
  {
    id: 5,
    title: 'Mobile App Development Contest',
    shortTitle: 'Mobile App Contest',
    description: 'Create innovative mobile applications that solve everyday problems.',
    fullDescription:
      'A mobile product competition for Android, iOS, and cross-platform apps. Teams will build a working prototype, document the user flow, and present the product value.',
    category: 'IT',
    deadline: '2026-05-30',
    registrationDeadline: '2026-05-18',
    level: 'National',
    participants: 742,
    image: '/competitions/mobile.jpg',
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/mobile-app',
    prizes: ['$6,000 First Prize', '$3,000 Second Prize', '$1,500 Third Prize'],
    status: 'active',
    featured: true,
    recommended: false,
    heroGradient: 'from-indigo-600 via-violet-600 to-purple-600',
    highlightColor: 'from-indigo-500 to-purple-500',
    timeline: [
      { date: '2026-05-05', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-05-18', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-05-22', event: 'University Review Results', stage: 'University' },
      { date: '2026-05-23', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-05-30', event: 'Prototype Submission Deadline', stage: 'National' },
    ],
    requirements: [
      'Submit working prototype',
      'Include app demo video',
      'Original source code only',
      'Provide installation instructions',
    ],
  },
  {
    id: 6,
    title: 'Graphic Design Championship 2026',
    shortTitle: 'Graphic Design Championship',
    description: 'Showcase your creativity through stunning visual designs.',
    fullDescription:
      'A design competition covering branding, illustration, social campaign visuals, and creative communication. Participants submit a design package and explain the concept.',
    category: 'Design',
    deadline: '2026-06-05',
    registrationDeadline: '2026-05-27',
    level: 'International',
    participants: 1456,
    image: '/competitions/graphic.jpg',
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/graphic-design',
    prizes: ['$4,000 First Prize', '$2,000 Second Prize', '$1,000 Third Prize'],
    status: 'active',
    featured: true,
    recommended: false,
    heroGradient: 'from-pink-600 via-rose-600 to-red-500',
    highlightColor: 'from-pink-500 to-rose-500',
    timeline: [
      { date: '2026-05-10', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-05-27', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-05-31', event: 'University Review Results', stage: 'University' },
      { date: '2026-06-01', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-06-05', event: 'Final Artwork Deadline', stage: 'National' },
    ],
    requirements: [
      'Submit original artwork',
      'Include source files',
      'Explain visual concept',
      'No AI-generated final artwork without disclosure',
    ],
  },
  {
    id: 7,
    title: 'Cybersecurity Capture The Flag',
    shortTitle: 'Cybersecurity CTF',
    description: 'Test your security skills in this intense CTF competition.',
    fullDescription:
      'A cybersecurity competition with web, crypto, forensics, reverse engineering, and binary exploitation challenges. Teams compete to solve challenges and collect flags.',
    category: 'IT',
    deadline: '2026-04-25',
    registrationDeadline: '2026-04-18',
    level: 'International',
    participants: 934,
    image: '/competitions/ctf.jpg',
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/cybersecurity-ctf',
    prizes: ['$7,000 First Prize', '$3,500 Second Prize', '$1,750 Third Prize'],
    status: 'completed',
    featured: false,
    recommended: false,
    heroGradient: 'from-red-700 via-rose-700 to-pink-700',
    highlightColor: 'from-red-600 to-pink-600',
    timeline: [
      { date: '2026-04-01', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-04-18', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-04-21', event: 'University Review Results', stage: 'University' },
      { date: '2026-04-22', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-04-25', event: 'CTF Competition Day', stage: 'National' },
    ],
    requirements: [
      'Team participation, maximum 4 members',
      'Follow responsible disclosure rules',
      'Use provided challenge environment only',
      'Submit write-up for solved challenges',
    ],
  },
  {
    id: 8,
    title: 'Digital Marketing Strategy Competition',
    shortTitle: 'Digital Marketing Strategy',
    description: 'Create comprehensive digital marketing campaigns for real brands.',
    fullDescription:
      'A marketing strategy competition where teams build a campaign plan, content direction, channel strategy, budget allocation, and success metrics for a real brand case.',
    category: 'Business',
    deadline: '2026-05-18',
    registrationDeadline: '2026-05-09',
    level: 'National',
    participants: 567,
    image: '/competitions/marketing.jpg',
    organizer: 'Telkom University',
    location: 'Bandung',
    whatsappGroup: 'https://chat.whatsapp.com/digital-marketing',
    prizes: ['$4,500 First Prize', '$2,000 Second Prize', '$1,000 Third Prize'],
    status: 'active',
    featured: false,
    recommended: false,
    heroGradient: 'from-yellow-500 via-orange-500 to-red-500',
    highlightColor: 'from-yellow-500 to-orange-500',
    timeline: [
      { date: '2026-05-01', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-05-09', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-05-13', event: 'University Review Results', stage: 'University' },
      { date: '2026-05-14', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-05-18', event: 'Campaign Pitch Day', stage: 'National' },
    ],
    requirements: [
      'Team participation, maximum 3 members',
      'Submit campaign strategy deck',
      'Include budget and metrics',
      'Present campaign rationale',
    ],
  },
  {
    id: 9,
    title: 'Web Development Sprint Challenge',
    shortTitle: 'Web Development Sprint',
    description: 'Build responsive, modern web applications in 72 hours.',
    fullDescription:
      'A web development sprint focused on building usable, responsive, and accessible web apps. Teams submit source code, deployment link, and a short product demo.',
    category: 'IT',
    deadline: '2026-06-01',
    registrationDeadline: '2026-05-22',
    level: 'National',
    participants: 891,
    image: '/competitions/web.jpg',
    organizer: 'Telkom University',
    location: 'Online',
    whatsappGroup: 'https://chat.whatsapp.com/web-sprint',
    prizes: ['$6,500 First Prize', '$3,000 Second Prize', '$1,500 Third Prize'],
    status: 'active',
    featured: false,
    recommended: true,
    heroGradient: 'from-sky-600 via-blue-600 to-indigo-600',
    highlightColor: 'from-sky-500 to-blue-500',
    timeline: [
      { date: '2026-05-08', event: 'University Proposal Opens', stage: 'University' },
      { date: '2026-05-22', event: 'University Proposal Deadline', stage: 'University' },
      { date: '2026-05-26', event: 'University Review Results', stage: 'University' },
      { date: '2026-05-27', event: 'National Registration Opens', stage: 'National' },
      { date: '2026-06-01', event: 'Sprint Submission Deadline', stage: 'National' },
    ],
    requirements: [
      'Submit source code repository',
      'Deploy a working web app',
      'Include responsive layout',
      'Provide short product documentation',
    ],
  },
];

export const userCompetitions: UserCompetition[] = [
  {
    id: 1,
    status: 'university-approved',
    stage: 'University',
    submittedDate: '2026-05-10',
    reviewedDate: '2026-05-17',
    progress: 100,
  },
  {
    id: 2,
    status: 'university-pending',
    stage: 'University',
    submittedDate: '2026-04-25',
    progress: 100,
  },
  {
    id: 3,
    status: 'not-started',
    stage: 'University',
    progress: 0,
  },
  {
    id: 4,
    status: 'university-rejected',
    stage: 'University',
    submittedDate: '2026-05-18',
    reviewedDate: '2026-05-20',
    progress: 100,
  },
  {
    id: 5,
    status: 'national-submitted',
    stage: 'National',
    submittedDate: '2026-05-25',
    progress: 100,
  },
];

export const reviewResults: ReviewResultData[] = [
  {
    competitionId: 1,
    teamName: 'Design Masters',
    submittedDate: '2026-05-10',
    reviewedDate: '2026-05-17',
    status: 'approved',
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
    reviewerComments:
      'Excellent proposal with strong potential. The team has demonstrated clear understanding of the problem domain and proposed an innovative solution. Looking forward to seeing the implementation in the national stage.',
    canProceedToNational: true,
  },
  {
    competitionId: 4,
    teamName: 'Data Wizards',
    submittedDate: '2026-05-18',
    reviewedDate: '2026-05-20',
    status: 'rejected',
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
    reviewerComments:
      'While the team shows potential and good intentions, the proposal does not meet the minimum requirements for advancing to the national stage. The technical methodology is insufficiently detailed, and the feasibility assessment lacks depth.',
    canProceedToNational: false,
  },
];

export const submissions: Submission[] = [
  {
    id: 1,
    competitionId: 1,
    competition: 'International UI/UX Design Competition 2026',
    team: 'Design Masters',
    submittedDate: '2026-05-10',
    status: 'pending',
    proposal: 'Innovative mobile app design for healthcare',
    members: 'John Doe, Jane Smith, Bob Wilson',
  },
  {
    id: 2,
    competitionId: 2,
    competition: 'National Hackathon: Smart City Solutions',
    team: 'Code Warriors',
    submittedDate: '2026-04-25',
    status: 'approved',
    proposal: 'Smart traffic management system',
    members: 'Alice Johnson, Mark Lee',
  },
  {
    id: 3,
    competitionId: 1,
    competition: 'International UI/UX Design Competition 2026',
    team: 'Creative Minds',
    submittedDate: '2026-05-12',
    status: 'pending',
    proposal: 'E-learning platform redesign',
    members: 'Sarah Connor, Tom Hardy',
  },
  {
    id: 4,
    competitionId: 3,
    competition: 'Business Innovation Challenge 2026',
    team: 'Innovators Hub',
    submittedDate: '2026-05-08',
    status: 'rejected',
    proposal: 'Sustainable farming marketplace',
    members: 'David Kim, Lisa Wang, Alex Chen',
  },
  {
    id: 5,
    competitionId: 4,
    competition: 'Data Science & AI Competition',
    team: 'Data Wizards',
    submittedDate: '2026-05-18',
    status: 'approved',
    proposal: 'Predictive analytics for retail',
    members: 'Michael Brown, Emma Davis',
  },
];

export const participants = [
  { id: 1, name: 'John Doe', email: 'john@student.telkomuniversity.ac.id', university: 'Telkom University', competitions: 3, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@student.ui.ac.id', university: 'Universitas Indonesia', competitions: 2, status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@student.itb.ac.id', university: 'Institut Teknologi Bandung', competitions: 5, status: 'active' },
  { id: 4, name: 'Alice Johnson', email: 'alice@student.ugm.ac.id', university: 'Universitas Gadjah Mada', competitions: 1, status: 'active' },
  { id: 5, name: 'Mark Lee', email: 'mark@student.telkomuniversity.ac.id', university: 'Telkom University', competitions: 4, status: 'inactive' },
];

export const bookmarkedCompetitionIds = [1, 3, 4, 6];
const bookmarkedDates: Record<number, string> = {
  1: '2026-04-10',
  3: '2026-04-12',
  4: '2026-04-08',
  6: '2026-04-11',
};

export const featuredCompetitions = competitions.filter((competition) => competition.featured).slice(0, 6);
export const recommendedCompetitions = competitions.filter((competition) => competition.recommended).slice(0, 3);
export const heroCompetitions = competitions.slice(0, 3).map((competition) => ({
  ...competition,
  gradient: competition.heroGradient,
}));
export const competitionHighlights = competitions.slice(0, 8).map((competition) => ({
  id: competition.id,
  title: competition.shortTitle,
  color: competition.highlightColor,
}));
export const myCompetitions = userCompetitions
  .map((entry) => {
    const competition = getCompetitionById(entry.id);

    if (!competition) return null;

    return {
      ...competition,
      ...entry,
    };
  })
  .filter(Boolean) as Array<Competition & UserCompetition>;
export const bookmarkedCompetitions = bookmarkedCompetitionIds
  .map((id) => {
    const competition = getCompetitionById(id);

    if (!competition) return null;

    return {
      ...competition,
      bookmarkedDate: bookmarkedDates[id],
    };
  })
  .filter(Boolean) as Array<Competition & { bookmarkedDate: string }>;
export const adminCompetitionRows = competitions.map((competition) => ({
  id: competition.id,
  name: competition.shortTitle,
  category: competition.category,
  participants: competition.participants,
  status: competition.status,
  deadline: competition.deadline,
  level: competition.level,
  prizes: competition.prizes[0]?.split(' First Prize')[0] ?? '',
  location: competition.location,
  whatsappGroup: competition.whatsappGroup,
  description: competition.description,
}));
export const adminSubmissionRows = submissions;

export function getCompetitionById(id?: string | number) {
  const numericId = Number(id);
  return competitions.find((competition) => competition.id === numericId);
}

export function getUserCompetitionById(id?: string | number) {
  const numericId = Number(id);
  return userCompetitions.find((competition) => competition.id === numericId);
}

export function getReviewResultByCompetitionId(id?: string | number) {
  const numericId = Number(id);
  return reviewResults.find((result) => result.competitionId === numericId);
}

export function getFeaturedCompetitions(limit = 6) {
  return competitions.filter((competition) => competition.featured).slice(0, limit);
}

export function getRecommendedCompetitions(limit = 3) {
  return competitions.filter((competition) => competition.recommended).slice(0, limit);
}

export function getBookmarkedCompetitions() {
  return bookmarkedCompetitionIds
    .map((id) => getCompetitionById(id))
    .filter(Boolean) as Competition[];
}

export function competitionPath(id: number | string) {
  return `/competition/${id}`;
}

export function universityProposalPath(id: number | string) {
  return `/competition/${id}/submit-proposal`;
}

export function nationalRegistrationPath(id: number | string) {
  return `/competition/${id}/register`;
}

export function reviewResultPath(id: number | string) {
  return `/competition/${id}/review-result`;
}

export function formatDaysLeft(deadline: string) {
  const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return 'Closed';
  if (daysLeft === 0) return 'Last day';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

export function isDeadlineUrgent(deadline: string) {
  const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return daysLeft >= 0 && daysLeft <= 7;
}
