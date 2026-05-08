import { Calendar, MapPin, Users, Bookmark, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

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
  const [isBookmarked, setIsBookmarked] = useState(false);

  const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/competition/${id}`)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#C8102E] hover:shadow-2xl transition-all cursor-pointer"
    >
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isBookmarked ? 'bg-[#C8102E] text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            daysLeft <= 7
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-800'
          }`}>
            {daysLeft} days left
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-[#C8102E]/10 text-[#C8102E] rounded-lg text-sm font-semibold">
            {category}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            {level}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#333333] mb-3 line-clamp-2 group-hover:text-[#C8102E] transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-4 mb-5 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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

      <div className="absolute inset-0 border-2 border-[#C8102E] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
