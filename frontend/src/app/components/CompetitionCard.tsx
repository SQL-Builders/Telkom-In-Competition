import { Calendar, Users, Bookmark, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router';

import { appPaths } from '../data/paths';
import {
  formatDaysLeft,
  isDeadlineUrgent
} from '../data/competitions';

interface CompetitionCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  level: string;
  participants: number;
  image: string;
  recommended?: boolean;
  biaya?: number;
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
  recommended,
  biaya,
}: CompetitionCardProps) {

  const navigate = useNavigate();

  // Bookmark state from localStorage
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('telkom-in:bookmarks') || '[]') as number[];
    return saved.includes(id);
  });

  const toggleBookmark = async (e: MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic UI update
    const saved = JSON.parse(localStorage.getItem('telkom-in:bookmarks') || '[]') as number[];
    const newSaved = isBookmarked ? saved.filter(s => s !== id) : [...saved, id];
    localStorage.setItem('telkom-in:bookmarks', JSON.stringify(newSaved));
    setIsBookmarked(!isBookmarked);

    // Sync to backend if logged in
    try {
      const token = localStorage.getItem('telkom-in-competition:token') || sessionStorage.getItem('telkom-in-competition:token');
      if (token) {
        const { bookmarksApi } = await import('../api/bookmarksApi');
        await bookmarksApi.toggleBookmark(id);
      }
    } catch (err) {
      console.error('Failed to sync bookmark to backend', err);
    }
  };

  const deadlineLabel = formatDaysLeft(deadline);

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}

      onClick={() => navigate(appPaths.competition(id))}

      className="
        group relative
        bg-white
        rounded-2xl overflow-hidden
        border border-gray-200
        hover:border-[#C8102E]
        hover:shadow-2xl
        transition-all
        cursor-pointer
      "
    >

      {/* ========================== BOOKMARK BUTTON ========================== */}
      <div className="absolute top-4 right-4 z-10">

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}

          onClick={(e) => toggleBookmark(e)}

          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isBookmarked
              ? 'bg-[#C8102E] text-white'
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >

          <Bookmark
            className={`w-5 h-5 ${
              isBookmarked ? 'fill-current' : ''
            }`}
          />

        </motion.button>

      </div>

      {/* ========================== RECOMMENDED BADGE ========================== */}
      {recommended && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            ⭐ Recommended
          </div>
        </div>
      )}

      {/* ========================== IMAGE SECTION ========================== */}
      <div className="relative h-56 overflow-hidden">

        {/* Competition Image */}
        {image ? (
          <img
            src={image}
            alt={title}
            className="
              w-full h-full
              object-cover
              group-hover:scale-110
              transition-transform duration-500
            "
            onError={(e) => {
              // If image fails to load, show gradient placeholder
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${image ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-[#C8102E] via-[#E91E3A] to-[#FF6B6B] flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
          <span className="text-white text-5xl font-black opacity-30 select-none">{title.charAt(0)}</span>
        </div>

        {/* Overlay */}
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

          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            {level}
          </span>

          {biaya !== undefined && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold ml-auto">
              {biaya === 0 ? 'Free' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(biaya)}
            </span>
          )}

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

            <span>

              {new Date(deadline).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric'
                }
              )}

            </span>

          </div>

          <div className="flex items-center gap-1.5">

            <Users className="w-4 h-4" />

            <span>

              {participants.toLocaleString()} registered

            </span>

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