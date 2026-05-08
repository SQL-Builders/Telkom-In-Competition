import { motion } from 'motion/react';

const highlights = [
  { id: 1, title: 'UI/UX Design Summit', color: 'from-purple-500 to-pink-500' },
  { id: 2, title: 'Hackathon 2026', color: 'from-blue-500 to-cyan-500' },
  { id: 3, title: 'Business Innovation', color: 'from-orange-500 to-red-500' },
  { id: 4, title: 'Data Science Challenge', color: 'from-green-500 to-emerald-500' },
  { id: 5, title: 'Mobile App Contest', color: 'from-indigo-500 to-purple-500' },
  { id: 6, title: 'Web Development', color: 'from-yellow-500 to-orange-500' },
  { id: 7, title: 'AI Innovation', color: 'from-pink-500 to-rose-500' },
  { id: 8, title: 'Cybersecurity CTF', color: 'from-red-600 to-pink-600' },
];

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
          {highlights.map((highlight, index) => (
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
