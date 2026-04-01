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

export default function Encyclopedia({ darkMode }: Props) {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('glossary')
        .select('*')
        .eq('letter', selectedLetter)
        .order('term', { ascending: true });
      setTerms(data || []);
      setLoading(false);
    };
    fetchTerms();
  }, [selectedLetter]);

  const filtered = terms.filter(t =>
    t.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.definition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyTerm = (term: any) => {
    navigator.clipboard.writeText(`${term.term}: ${term.definition}`);
    alert(`Copied: ${term.term}`);
  };

  return (
    <div className={`max-w-5xl mx-auto ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tighter">Publishing Encyclopedia</h1>
        <p className="mt-4 text-xl text-gray-500">Your modern reference for the publishing world</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {letters.map(letter => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl font-semibold transition-all ${
              selectedLetter === letter
                ? 'bg-violet-600 text-white shadow-xl scale-110'
                : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search any term or definition..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full px-8 py-6 text-xl rounded-3xl mb-12 focus:outline-none focus:ring-4 focus:ring-violet-200 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
      />

      {loading && <p className="text-center py-20 text-2xl">Loading knowledge base...</p>}

      <div className="grid gap-8">
        {filtered.map((item, i) => (
          <div
            key={i}
            className={`p-10 rounded-3xl transition-all hover:shadow-2xl group ${
              darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-3xl font-semibold">{item.term}</h3>
              <button
                onClick={() => copyTerm(item)}
                className="opacity-0 group-hover:opacity-100 px-5 py-2 text-sm bg-violet-600 text-white rounded-2xl hover:bg-violet-700 transition-all"
              >
                Copy
              </button>
            </div>
            {item.category && <p className="text-violet-500 mt-2">Category: {item.category}</p>}
            <p className={`mt-6 leading-relaxed text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}