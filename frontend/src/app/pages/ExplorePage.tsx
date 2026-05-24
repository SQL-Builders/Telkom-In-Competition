import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { CompetitionCard } from '../components/CompetitionCard';
import { competitions } from '../data/competitions';
import { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function normalizeFilterValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [deadline, setDeadline] = useState('all');
  const [level, setLevel] = useState('all');
  const { darkMode } = useTheme();

  const filteredCompetitions = useMemo(() => {
    const now = new Date();
    const query = searchTerm.trim().toLowerCase();

    return competitions.filter((competition) => {
      const daysLeft = Math.ceil(
        (new Date(competition.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const matchesSearch =
        !query ||
        competition.title.toLowerCase().includes(query) ||
        competition.description.toLowerCase().includes(query) ||
        competition.category.toLowerCase().includes(query);
      const matchesCategory =
        category === 'all' || normalizeFilterValue(competition.category) === category;
      const matchesLevel =
        level === 'all' || normalizeFilterValue(competition.level) === level;
      const matchesDeadline =
        deadline === 'all' ||
        (deadline === 'week' && daysLeft >= 0 && daysLeft <= 7) ||
        (deadline === 'month' && daysLeft >= 0 && daysLeft <= 30) ||
        (deadline === '3months' && daysLeft >= 0 && daysLeft <= 90);

      return matchesSearch && matchesCategory && matchesLevel && matchesDeadline;
    });
  }, [category, deadline, level, searchTerm]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
      <Navbar />
      <FilterBar
        searchTerm={searchTerm}
        category={category}
        deadline={deadline}
        level={level}
        onSearchTermChange={setSearchTerm}
        onCategoryChange={setCategory}
        onDeadlineChange={setDeadline}
        onLevelChange={setLevel}
      />

      <div className="p-6 lg:p-12">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
            Explore Competitions
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover {filteredCompetitions.length} amazing opportunities to showcase your skills
          </p>
        </div>

        {filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} {...competition} />
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl border p-12 text-center ${
            darkMode ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#333333]'}`}>
              No competitions found
            </h2>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Try changing the search keyword or filters.
            </p>
          </div>
        )}

        {filteredCompetitions.length === competitions.length && (
          <div className="mt-12 text-center">
            <button className="px-8 py-4 bg-[#C8102E] text-white font-bold text-lg rounded-xl hover:bg-[#A00D25] transition-colors shadow-lg hover:shadow-xl">
              Load More Competitions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
