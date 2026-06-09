  import { Navbar } from '../components/Navbar';
import { HeroCarousel } from '../components/HeroCarousel';
import { HighlightSection } from '../components/HighlightSection';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useFeaturedCompetitions, useRecommendedCompetitions } from '../hooks/useCompetitions';
import { appPaths } from '../data/paths';

export function LandingPage() {
  const navigate = useNavigate();
  const { data: featuredCompetitions, loading: featuredLoading } = useFeaturedCompetitions();
  const { data: recommendedCompetitions, loading: recommendedLoading } = useRecommendedCompetitions();

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

          {featuredLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8102E]"></div>
            </div>
          ) : featuredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredCompetitions.slice(0, 3).map((competition) => (
                <CompetitionCard key={competition.id} {...competition} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 mb-16 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-700 mb-2">More Competitions Coming Soon</h3>
              <p className="text-gray-500">We are currently preparing exciting new competitions for you.</p>
            </div>
          )}

          {recommendedCompetitions.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-[#333333] mb-4"
                >
                  Recommended For You
                </motion.h2>
                <p className="text-lg text-gray-600">
                  Top picks carefully selected by our team
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recommendedCompetitions.slice(0, 3).map((competition) => (
                  <CompetitionCard key={competition.id} {...competition} />
                ))}
              </div>
            </div>
          )}

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
