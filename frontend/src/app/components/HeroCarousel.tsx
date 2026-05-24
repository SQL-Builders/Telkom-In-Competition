import { motion } from 'motion/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const featuredCompetitions = [
  {
    id: 1,
    title: 'National UI/UX Design Challenge 2026',
    description: 'Design the future of digital experiences. Create innovative solutions for real-world problems.',
    deadline: '2026-05-15',
    category: 'UI/UX',
    gradient: 'from-[#C8102E] via-[#E91E3A] to-[#FF4757]',
  },
  {
    id: 2,
    title: 'Indonesia Hackathon: AI Innovation',
    description: 'Build intelligent solutions using cutting-edge AI technology. Shape the future with code.',
    deadline: '2026-06-01',
    category: 'IT',
    gradient: 'from-[#A00D25] via-[#C8102E] to-[#E91E3A]',
  },
  {
    id: 3,
    title: 'Business Case Competition 2026',
    description: 'Solve complex business challenges with creative strategies and data-driven insights.',
    deadline: '2026-05-20',
    category: 'Business',
    gradient: 'from-[#8A0B1F] via-[#A00D25] to-[#C8102E]',
  },
];

function NextArrow({ onClick, darkMode }: { onClick?: () => void; darkMode: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
        darkMode
          ? 'bg-gray-800/90 hover:bg-gray-700 text-white'
          : 'bg-white/90 hover:bg-white text-[#C8102E]'
      }`}
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
}

function PrevArrow({ onClick, darkMode }: { onClick?: () => void; darkMode: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
        darkMode
          ? 'bg-gray-800/90 hover:bg-gray-700 text-white'
          : 'bg-white/90 hover:bg-white text-[#C8102E]'
      }`}
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}

export function HeroCarousel() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow darkMode={darkMode} />,
    prevArrow: <PrevArrow darkMode={darkMode} />,
    pauseOnHover: true,
  };

  return (
    <div className={`relative w-full transition-colors duration-300 ${darkMode ? 'bg-[#0F172A]' : 'bg-gray-50'}`}>
      <Slider {...settings}>
        {featuredCompetitions.map((competition) => (
          <div key={competition.id}>
            <div className={`relative h-[500px] bg-gradient-to-r ${competition.gradient} overflow-hidden`}>
              {/* Premium abstract high-tech background pattern */}
              <img
                src="/assets/banner_bg.png"
                alt="Banner Tech Pattern"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-black/10" />

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

                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {competition.title}
                  </h1>

                  <p className="text-xl text-white/95 mb-8 leading-relaxed">
                    {competition.description}
                  </p>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">
                        Deadline: {new Date(competition.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                      <span className="text-white font-medium">{competition.category}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/registerpage')}
                    className="px-8 py-4 bg-white text-[#C8102E] font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                  >
                    Register Now
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
