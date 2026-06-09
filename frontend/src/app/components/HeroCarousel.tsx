import { motion } from 'motion/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

import { useNavigate } from 'react-router';
import { useFeaturedCompetitions } from '../hooks/useCompetitions';
import { appPaths } from '../data/paths';

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
    >
      <ChevronRight className="w-6 h-6 text-[#C8102E]" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
    >
      <ChevronLeft className="w-6 h-6 text-[#C8102E]" />
    </button>
  );
}

export function HeroCarousel() {
  const navigate = useNavigate();
  const { data: featuredCompetitions, loading } = useFeaturedCompetitions();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  if (featuredCompetitions.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-r from-gray-900 via-gray-800 to-black overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Welcome to Telkom-In Competition
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover and participate in amazing academic and non-academic competitions to showcase your skills and talents.
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-50">
      <Slider {...settings}>
        {featuredCompetitions.map((competition, index) => {
          const posterImg = (competition as any).image || (competition as any).poster_url || '';
          return (
            <div key={competition.id}>
              <div className="relative h-[500px] overflow-hidden">
                {/* Background: poster image (right side) */}
                {posterImg ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${posterImg})` }}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-r ${competition.gradient || 'from-[#C8102E] to-[#A00D25]'}`} />
                )}

                {/* Gradient overlay: merah solid di kiri → transparan di kanan */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, #C8102E 0%, #C8102E 35%, rgba(200,16,46,0.85) 50%, rgba(200,16,46,0.4) 70%, transparent 100%)'
                  }}
                />

                {/* Subtle dark overlay bawah untuk keterbacaan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl"
                  >
                    <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                      <span className="text-white font-semibold text-sm">
                        🔥 OPEN REGISTRATION
                      </span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                      {competition.title}
                    </h1>

                    <p className="text-xl text-white/95 mb-8 leading-relaxed drop-shadow">
                      {competition.description}
                    </p>

                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2 text-white/90">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Deadline: {new Date(competition.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                        <span className="text-white font-medium">{competition.category}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(appPaths.competition(competition.id))}
                      className="px-8 py-4 bg-white text-[#C8102E] font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                    >
                      Register Now
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
