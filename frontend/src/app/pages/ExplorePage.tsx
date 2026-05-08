import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { CompetitionCard } from '../components/CompetitionCard';

const competitions = [
  {
    id: 1,
    title: 'International UI/UX Design Competition 2026',
    description: 'Design innovative and user-friendly interfaces that solve real-world problems. Compete with designers from around the world.',
    category: 'UI/UX',
    deadline: '2026-05-15',
    level: 'International',
    participants: 1247,
    image: '/competitions/uiux.jpg',
  },
  {
    id: 2,
    title: 'National Hackathon: Smart City Solutions',
    description: 'Build technology solutions that make cities smarter, safer, and more sustainable. 48-hour coding challenge.',
    category: 'IT',
    deadline: '2026-04-28',
    level: 'National',
    participants: 856,
    image: '/competitions/hackathon.jpg',
  },
  {
    id: 3,
    title: 'Business Innovation Challenge 2026',
    description: 'Present your innovative business ideas and compete for funding. Transform your startup dreams into reality.',
    category: 'Business',
    deadline: '2026-06-10',
    level: 'National',
    participants: 623,
    image: '/competitions/business.jpg',
  },
  {
    id: 4,
    title: 'Data Science & AI Competition',
    description: 'Analyze complex datasets and build predictive models. Showcase your data science and machine learning skills.',
    category: 'Data Science',
    deadline: '2026-05-22',
    level: 'International',
    participants: 1089,
    image: '/competitions/data.jpg',
  },
  {
    id: 5,
    title: 'Mobile App Development Contest',
    description: 'Create innovative mobile applications that solve everyday problems. Build for iOS, Android, or cross-platform.',
    category: 'IT',
    deadline: '2026-05-30',
    level: 'National',
    participants: 742,
    image: '/competitions/mobile.jpg',
  },
  {
    id: 6,
    title: 'Graphic Design Championship 2026',
    description: 'Showcase your creativity through stunning visual designs. From branding to illustration, let your art speak.',
    category: 'Design',
    deadline: '2026-06-05',
    level: 'International',
    participants: 1456,
    image: '/competitions/graphic.jpg',
  },
  {
    id: 7,
    title: 'Cybersecurity Capture The Flag',
    description: 'Test your security skills in this intense CTF competition. Hack, defend, and conquer challenges.',
    category: 'IT',
    deadline: '2026-04-25',
    level: 'International',
    participants: 934,
    image: '/competitions/ctf.jpg',
  },
  {
    id: 8,
    title: 'Digital Marketing Strategy Competition',
    description: 'Create comprehensive digital marketing campaigns for real brands. Show your strategic thinking.',
    category: 'Business',
    deadline: '2026-05-18',
    level: 'National',
    participants: 567,
    image: '/competitions/marketing.jpg',
  },
  {
    id: 9,
    title: 'Web Development Sprint Challenge',
    description: 'Build responsive, modern web applications in 72 hours. Demonstrate your full-stack development skills.',
    category: 'IT',
    deadline: '2026-06-01',
    level: 'National',
    participants: 891,
    image: '/competitions/web.jpg',
  },
];

export function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <FilterBar />

      <div className="p-6 lg:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#333333] mb-3">Explore Competitions</h1>
          <p className="text-lg text-gray-600">
            Discover {competitions.length} amazing opportunities to showcase your skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((competition) => (
            <CompetitionCard key={competition.id} {...competition} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg hover:shadow-xl">
            Load More Competitions
          </button>
        </div>
      </div>
    </div>
  );
}
