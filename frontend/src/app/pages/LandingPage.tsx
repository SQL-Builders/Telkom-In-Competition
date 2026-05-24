import { Navbar } from '../components/Navbar';
import { HeroCarousel } from '../components/HeroCarousel';
import { HighlightSection } from '../components/HighlightSection';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { featuredCompetitions } from '../data/competitions';
import { appPaths } from '../data/paths';
import { useTheme } from '../context/ThemeContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0F172A]' : 'bg-white'}`}>
      <Navbar />
      <HeroCarousel />

      <section className={`py-20 transition-colors duration-300 ${darkMode ? 'bg-[#0F172A]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#333333]'}`}
            >
              Featured Competitions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
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
              onClick={() => navigate(appPaths.explore)}
              className="px-8 py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Explore All Competitions
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(appPaths.register)}
              className={`px-8 py-4 border-2 border-[#C8102E] text-[#C8102E] font-bold text-lg rounded-xl hover:bg-[#C8102E] hover:text-white transition-colors shadow-lg ${darkMode ? 'bg-transparent' : 'bg-white'}`}
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
