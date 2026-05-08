import { Navbar } from '../components/Navbar';
import { HeroCarousel } from '../components/HeroCarousel';
import { HighlightSection } from '../components/HighlightSection';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const featuredCompetitions = [
  {
    id: 1,
    title: 'International UI/UX Design Competition 2026',
    description: 'Design innovative and user-friendly interfaces that solve real-world problems.',
    category: 'UI/UX',
    deadline: '2026-05-15',
    level: 'International',
    participants: 1247,
    image: '/competitions/uiux.jpg',
  },
  {
    id: 2,
    title: 'National Hackathon: Smart City Solutions',
    description: 'Build technology solutions that make cities smarter, safer, and more sustainable.',
    category: 'IT',
    deadline: '2026-04-28',
    level: 'National',
    participants: 856,
    image: '/competitions/hackathon.jpg',
  },
  {
    id: 3,
    title: 'Business Innovation Challenge 2026',
    description: 'Present your innovative business ideas and compete for funding.',
    category: 'Business',
    deadline: '2026-06-10',
    level: 'National',
    participants: 623,
    image: '/competitions/business.jpg',
  },
  {
    id: 4,
    title: 'Data Science & AI Competition',
    description: 'Analyze complex datasets and build predictive models.',
    category: 'Data Science',
    deadline: '2026-05-22',
    level: 'International',
    participants: 1089,
    image: '/competitions/data.jpg',
  },
  {
    id: 5,
    title: 'Mobile App Development Contest',
    description: 'Create innovative mobile applications that solve everyday problems.',
    category: 'IT',
    deadline: '2026-05-30',
    level: 'National',
    participants: 742,
    image: '/competitions/mobile.jpg',
  },
  {
    id: 6,
    title: 'Graphic Design Championship 2026',
    description: 'Showcase your creativity through stunning visual designs.',
    category: 'Design',
    deadline: '2026-06-05',
    level: 'International',
    participants: 1456,
    image: '/competitions/graphic.jpg',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroCarousel />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-[#333333] mb-6"
            >
              Featured Competitions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Discover amazing opportunities to showcase your skills
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} {...competition} />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="px-8 py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Explore All Competitions
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white border-2 border-[#C8102E] text-[#C8102E] font-bold text-lg rounded-xl hover:bg-[#C8102E] hover:text-white transition-colors shadow-lg"
            >
              Join Now
            </motion.button>
          </div>
        </div>
      </section>

      <HighlightSection />
      <Footer />
    </div>
  );
}
