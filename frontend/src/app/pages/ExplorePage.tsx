import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { CompetitionCard } from '../components/CompetitionCard';
import { useCompetitions } from '../hooks/useCompetitions';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

function normalizeFilterValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [deadline, setDeadline] = useState('all');
  const [level, setLevel] = useState('all');

  // Sync state back to URL parameter
  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSearchParams(prev => {
      if (val === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', val);
      }
      return prev;
    });
  };

  // Sync state when URL parameter changes
  useEffect(() => {
    const catParam = searchParams.get('category') || 'all';
    setCategory(catParam);
  }, [searchParams]);

  const { data: competitions, loading, error } = useCompetitions();

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

      const compCatNorm = normalizeFilterValue(competition.category);
      const filterCatNorm = normalizeFilterValue(category);
      const matchesCategory =
        category === 'all' ||
        compCatNorm.includes(filterCatNorm) ||
        filterCatNorm.includes(compCatNorm);

      const matchesLevel =
        level === 'all' || normalizeFilterValue(competition.level) === level;
      const matchesDeadline =
        deadline === 'all' ||
        (deadline === 'week' && daysLeft >= 0 && daysLeft <= 7) ||
        (deadline === 'month' && daysLeft >= 0 && daysLeft <= 30) ||
        (deadline === '3months' && daysLeft >= 0 && daysLeft <= 90);

      return matchesSearch && matchesCategory && matchesLevel && matchesDeadline;
    });
  }, [competitions, category, deadline, level, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <FilterBar
        searchTerm={searchTerm}
        category={category}
        deadline={deadline}
        level={level}
        onSearchTermChange={setSearchTerm}
        onCategoryChange={handleCategoryChange}
        onDeadlineChange={setDeadline}
        onLevelChange={setLevel}
      />

      <div className="p-6 lg:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#333333] mb-3">Explore Competitions</h1>
          <p className="text-lg text-gray-600">
            Discover {filteredCompetitions.length} amazing opportunities to showcase your skills
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Error Fetching Competitions</h2>
            <p>{error.message}</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
          </div>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} {...competition} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-[#333333] mb-2">No competitions found</h2>
            <p className="text-gray-600">Try changing the search keyword or filters.</p>
          </div>
        )}

        {!loading && filteredCompetitions.length === competitions.length && competitions.length > 0 && (
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
