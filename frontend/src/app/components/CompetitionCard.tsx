import { Calendar, Users, Bookmark, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { appPaths } from '../data/paths';
import { formatDaysLeft, isDeadlineUrgent } from '../data/competitions';
import { useTheme } from '../context/ThemeContext';

interface CompetitionCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  level: string;
  participants: number;
  image: string;
}

export function CompetitionCard({
  id,
  title,
  description,
  category,
  deadline,
  level,
  participants,
  image,
}: CompetitionCardProps) {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const deadlineLabel = formatDaysLeft(deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(appPaths.competition(id))}
      className={`
        group relative rounded-2xl overflow-hidden border
        hover:border-[#C8102E] hover:shadow-2xl
        transition-all cursor-pointer
        ${darkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-200'}
      `}
    >

      {/* ========================== BOOKMARK BUTTON ========================== */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isBookmarked
              ? 'bg-[#C8102E] text-white'
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* ========================== IMAGE SECTION ========================== */}
      <div className="relative h-56 overflow-hidden">
        <img
          src="/assets/produk.png"
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Deadline Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isDeadlineUrgent(deadline) || deadlineLabel === 'Closed'
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-800'
            }`}
          >
            {deadlineLabel}
          </span>
        </div>
      </div>

      {/* ========================== CONTENT ========================== */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-[#C8102E]/10 text-[#C8102E] rounded-lg text-sm font-semibold">
            {category}
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {level}
          </span>
        </div>

        <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#C8102E] transition-colors ${
          darkMode ? 'text-white' : 'text-[#333333]'
        }`}>
          {title}
        </h3>

        <p className={`mb-4 line-clamp-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>

        <div className={`flex items-center gap-4 mb-5 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{participants.toLocaleString()} registered</span>
          </div>
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center gap-2 text-[#C8102E] font-semibold group/btn"
        >
          View Details
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* ========================== HOVER BORDER ========================== */}
      <div className="absolute inset-0 border-2 border-[#C8102E] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}