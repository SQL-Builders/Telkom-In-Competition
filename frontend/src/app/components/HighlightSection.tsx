import { motion } from 'motion/react';
import { competitionHighlights } from '../data/competitions';

export function HighlightSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">
            Competition Highlights
          </h2>
          <p className="text-lg text-gray-600">
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
              <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

              <div className="relative h-full flex items-end p-6">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {highlight.title}
                </h3>
              </div>

              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
