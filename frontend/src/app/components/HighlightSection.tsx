import { motion } from 'motion/react';
import { competitionHighlights } from '../data/competitions';
import { useTheme } from '../context/ThemeContext';

export function HighlightSection() {
  const { darkMode } = useTheme();

  return (
    <section className={`py-20 transition-colors duration-300 ${darkMode ? 'bg-[#0F172A]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
            Competition Highlights
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse through our visual showcase of exciting competitions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {competitionHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Premium abstract high-tech background cover */}
              <img
                src={highlight.image}
                alt={highlight.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none select-none"
              />

              {/* Tinted gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-75 group-hover:opacity-85 transition-opacity duration-300`} />
              
              {/* Shading overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />

              <div className="relative h-full flex items-end p-6 z-10">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {highlight.title}
                </h3>
              </div>

              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-colors z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

