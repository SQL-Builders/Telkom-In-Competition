import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export function FilterBar() {
  const [category, setCategory] = useState('all');
  const [deadline, setDeadline] = useState('all');
  const [level, setLevel] = useState('all');

  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search competitions by name, category, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent appearance-none cursor-pointer min-w-[140px] font-medium text-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="uiux">UI/UX</option>
              <option value="it">IT</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
              <option value="data">Data Science</option>
            </select>

            <select
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent appearance-none cursor-pointer min-w-[140px] font-medium text-gray-700"
            >
              <option value="all">All Deadlines</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="3months">Next 3 Months</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent appearance-none cursor-pointer min-w-[140px] font-medium text-gray-700"
            >
              <option value="all">All Levels</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
