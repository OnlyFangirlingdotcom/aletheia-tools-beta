'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  darkMode: boolean;
}

export default function CompSearcher({ darkMode }: Props) {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedPOV, setSelectedPOV] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ min: 2000, max: 2026 });

  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [allThemes, setAllThemes] = useState<string[]>([]);
  const [allPOV, setAllPOV] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase.from('comp_books').select('*').order('year', { ascending: false });
      if (data) {
        setBooks(data);
        setFilteredBooks(data);
        setAllGenres([...new Set(data.flatMap((b: any) => b.genres || []))].sort());
        setAllThemes([...new Set(data.flatMap((b: any) => b.themes || []))].sort());
        setAllPOV([...new Set(data.flatMap((b: any) => b.pov || []))].sort());
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];

    if (titleSearch) result = result.filter(b => b.title?.toLowerCase().includes(titleSearch.toLowerCase()));
    if (authorSearch) result = result.filter(b => b.author?.toLowerCase().includes(authorSearch.toLowerCase()));

    if (selectedGenres.length > 0) result = result.filter(b => selectedGenres.some(g => b.genres?.includes(g)));
    if (selectedThemes.length > 0) result = result.filter(b => selectedThemes.some(t => b.themes?.includes(t)));
    if (selectedPOV.length > 0) result = result.filter(b => selectedPOV.some(p => b.pov?.includes(p)));

    result = result.filter(b => !b.year || (b.year >= yearRange.min && b.year <= yearRange.max));

    // Calculate match percentage
    result = result.map(book => {
      const genreMatches = selectedGenres.filter(g => book.genres?.includes(g)).length;
      const themeMatches = selectedThemes.filter(t => book.themes?.includes(t)).length;
      const povMatches = selectedPOV.filter(p => book.pov?.includes(p)).length;

      const totalSelected = selectedGenres.length + selectedThemes.length + selectedPOV.length;
      const totalMatches = genreMatches + themeMatches + povMatches;

      const matchPercentage = totalSelected > 0 ? Math.round((totalMatches / totalSelected) * 100) : 50;

      return { ...book, matchPercentage };
    });

    result.sort((a, b) => b.matchPercentage - a.matchPercentage);

    setFilteredBooks(result);
  }, [books, titleSearch, authorSearch, selectedGenres, selectedThemes, selectedPOV, yearRange]);

  const toggleFilter = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearFilters = () => {
    setTitleSearch('');
    setAuthorSearch('');
    setSelectedGenres([]);
    setSelectedThemes([]);
    setSelectedPOV([]);
    setYearRange({ min: 2000, max: 2026 });
  };

  const activeFilters = [...selectedGenres, ...selectedThemes, ...selectedPOV];

  return (
    <div className={`space-y-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div>
        <h1 className="text-5xl font-bold tracking-tighter">Intelligent Comp Title Searcher</h1>
        <p className="mt-3 text-xl text-gray-500">Results ranked by match percentage to your filters</p>
      </div>

      <div className={`rounded-3xl p-12 shadow-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between mb-10">
          <h2 className="text-3xl font-semibold">Filters</h2>
          <button onClick={clearFilters} className="text-violet-600 hover:underline">Clear all</button>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-10 p-6 bg-violet-50 border border-violet-200 rounded-3xl">
            <p className="font-medium text-violet-700">Active:</p>
            <p className="text-violet-800 mt-1">{activeFilters.join(' • ')}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <label className="block text-sm font-medium mb-3">Title</label>
            <input type="text" value={titleSearch} onChange={e => setTitleSearch(e.target.value)} placeholder="Search title..." 
              className={`w-full px-6 py-5 rounded-3xl text-lg focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Author</label>
            <input type="text" value={authorSearch} onChange={e => setAuthorSearch(e.target.value)} placeholder="Search author..." 
              className={`w-full px-6 py-5 rounded-3xl text-lg focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { label: "Genres", list: allGenres, selected: selectedGenres, setter: setSelectedGenres },
            { label: "Themes", list: allThemes, selected: selectedThemes, setter: setSelectedThemes },
            { label: "POV", list: allPOV, selected: selectedPOV, setter: setSelectedPOV }
          ].map(({ label, list, selected, setter }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-5">{label}</label>
              <div className="flex flex-wrap gap-3">
                {list.map(item => {
                  const isSelected = selected.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleFilter(item, setter, selected)}
                      className={`px-8 py-4 text-base font-medium rounded-3xl border transition-all ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 shadow-xl scale-105'
                          : darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <p className="text-2xl mb-8 font-medium">
          Recommended Comps <span className="text-violet-600">({filteredBooks.length})</span>
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book: any) => (
            <div key={book.id} className={`p-9 rounded-3xl transition-all hover:shadow-2xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
              <div className="flex justify-between">
                <h3 className="font-semibold text-2xl">{book.title}</h3>
                <span className="text-sm bg-gray-100 px-4 py-1.5 rounded-full">{book.matchPercentage || 0}% match</span>
              </div>
              <p className="text-violet-600 font-medium mt-2">{book.author}</p>
              {book.hook && <p className="mt-8 text-gray-600 leading-relaxed line-clamp-4">{book.hook}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}