import { Navbar } from '../components/Navbar';
import { CompetitionCard } from '../components/CompetitionCard';
import { BookMarked, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { bookmarkedCompetitions } from '../data/competitions';
import { useMemo, useState } from 'react';

export function BookmarkPage() {
  const [items, setItems] = useState(bookmarkedCompetitions);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const visibleBookmarks = useMemo(() => {
    const filtered =
      category === 'all'
        ? items
        : items.filter((competition) => competition.category === category);

    return [...filtered].sort((first, second) => {
      if (sortBy === 'deadline') {
        return new Date(first.deadline).getTime() - new Date(second.deadline).getTime();
      }

      if (sortBy === 'name') {
        return first.title.localeCompare(second.title);
      }

      return new Date(second.bookmarkedDate).getTime() - new Date(first.bookmarkedDate).getTime();
    });
  }, [category, items, sortBy]);
  const designCount = items.filter((competition) => ['UI/UX', 'Design'].includes(competition.category)).length;
  const techCount = items.filter((competition) => ['IT', 'Data Science'].includes(competition.category)).length;
  const businessCount = items.filter((competition) => competition.category === 'Business').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 lg:p-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#C8102E] rounded-xl flex items-center justify-center">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#333333]">Bookmarks</h1>
          </div>
          <p className="text-lg text-gray-600">
            You have {items.length} saved competitions
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
            <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-500">
              Start bookmarking competitions to save them for later
            </p>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-3">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="IT">IT</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                >
                  <option value="recent">Sort by: Recent</option>
                  <option value="deadline">Sort by: Deadline</option>
                  <option value="name">Sort by: Name</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setItems([])}
                className="px-6 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </motion.button>
            </div>

            {/* Bookmarked Competitions Grid */}
            {visibleBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleBookmarks.map((competition) => (
                  <div key={competition.id} className="relative">
                    <CompetitionCard {...competition} />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#C8102E] text-white text-xs font-semibold rounded-lg">
                      Saved {new Date(competition.bookmarkedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <h3 className="text-2xl font-bold text-[#333333] mb-2">No bookmarks match this filter</h3>
                <p className="text-gray-600">Change the category filter to see more saved competitions.</p>
              </div>
            )}

            {/* Collections Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#333333] mb-6">Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Design Competitions</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm">{designCount}</span>
                  </div>
                  <p className="text-white/90 text-sm">UI/UX and Graphic Design competitions</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Tech Challenges</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm">{techCount}</span>
                  </div>
                  <p className="text-white/90 text-sm">IT and Data Science competitions</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Business & Strategy</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm">{businessCount}</span>
                  </div>
                  <p className="text-white/90 text-sm">Business and innovation challenges</p>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
