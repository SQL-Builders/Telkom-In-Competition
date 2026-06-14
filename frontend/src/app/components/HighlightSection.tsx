import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Calendar, Tag, Globe, Loader2 } from 'lucide-react';
import { useCompetitionHighlights } from '../hooks/useCompetitions';
import { formatDaysLeft, isDeadlineUrgent } from '../data/competitions';
import { appPaths } from '../data/paths';

export function HighlightSection() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);
  const { highlights, loading } = useCompetitionHighlights(8);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              Competition Highlights
            </h2>
            <p className="text-lg text-gray-600">
              Browse and click to explore exciting competitions
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(appPaths.explore)}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] text-white font-semibold rounded-xl hover:bg-[#A00D25] transition-colors text-sm shadow"
          >
            View All <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Loading skeleton */}
          {loading && highlights.length === 0 && (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center"
              >
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ))
          )}

          {highlights.map((highlight, index) => {
            const isHovered = hoveredId === highlight.id;
            const targetUrl = `${appPaths.explore}?category=${highlight.categoryValue}`;

            return (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-300"
                onMouseEnter={() => setHoveredId(highlight.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(targetUrl)}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${highlight.title} competitions`}
                onKeyDown={(e) => e.key === 'Enter' && navigate(targetUrl)}
              >
                {/* Background image */}
                {highlight.image && (
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                )}

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.color} transition-opacity duration-300`}
                  style={{ opacity: isHovered ? 0.92 : 0.78 }}
                />
                {/* Dark scrim */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Badge - top right */}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {highlight.competitionCount} Lomba
                  </span>
                </div>

                {/* Static bottom title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                    {highlight.title}
                  </h3>
                </div>

                {/* Hover overlay - slides up */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="absolute inset-0 flex flex-col justify-end p-4 z-20"
                    >
                      {/* Frosted info panel */}
                      <div className="bg-black/55 backdrop-blur-md rounded-xl p-3 space-y-2 border border-white/15 text-left text-white">
                        <p className="text-white font-bold text-sm leading-tight truncate">
                          {highlight.title}
                        </p>

                        <div className="text-[10px] text-white/75 font-semibold uppercase tracking-wider">
                          Daftar Lomba:
                        </div>

                        <ul className="space-y-1 text-xs text-white/95 max-h-[85px] overflow-hidden">
                          {highlight.competitions?.slice(0, 3).map((comp) => (
                            <li key={comp.id} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 bg-white/70 rounded-full flex-shrink-0" />
                              <span className="truncate">{comp.shortTitle || comp.title}</span>
                            </li>
                          ))}
                          {highlight.competitions && highlight.competitions.length > 3 && (
                            <li className="text-[10px] text-white/60 pl-2.5">
                              + {highlight.competitions.length - 3} lainnya...
                            </li>
                          )}
                        </ul>

                        <div className="flex items-center justify-between pt-1.5 border-t border-white/10 mt-1">
                          <span className="text-white/80 text-[11px]">
                            {highlight.competitionCount} Lomba
                          </span>
                          <div className="flex items-center gap-1 bg-white text-[#C8102E] text-xs font-bold px-2.5 py-1 rounded-lg shadow hover:bg-white/90 transition-colors">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Border shine */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/50 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile "View All" button */}
        <div className="mt-8 flex justify-center md:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(appPaths.explore)}
            className="flex items-center gap-2 px-6 py-3 bg-[#C8102E] text-white font-semibold rounded-xl hover:bg-[#A00D25] transition-colors shadow"
          >
            View All Competitions <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
