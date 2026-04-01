'use client';

import { useState } from 'react';
import Encyclopedia from './Encyclopedia';
import CompSearcher from './CompSearcher';
import QueryLetterGenerator from './QueryLetterGenerator';

export default function Home() {
  const [activeTool, setActiveTool] = useState<'encyclopedia' | 'comp' | 'query'>('encyclopedia');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-[#f8fafc] text-gray-900'}`}>
      <header className={`py-10 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📖</span>
            <h1 className="text-4xl font-semibold tracking-tight">Aletheia Studio</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-6 py-3 rounded-2xl text-sm font-medium border transition-all hover:scale-105"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12 flex gap-12">
        <div className={`w-72 flex-shrink-0 rounded-3xl p-8 h-fit sticky top-8 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-sm'}`}>
          <h2 className="uppercase text-xs tracking-widest text-gray-500 mb-6">Tools</h2>
          <div className="space-y-2">
            <button onClick={() => setActiveTool('encyclopedia')} className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 text-lg transition-all ${activeTool === 'encyclopedia' ? 'bg-violet-600 text-white' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              📖 Encyclopedia
            </button>
            <button onClick={() => setActiveTool('comp')} className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 text-lg transition-all ${activeTool === 'comp' ? 'bg-violet-600 text-white' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              🔍 Comp Searcher
            </button>
            <button onClick={() => setActiveTool('query')} className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 text-lg transition-all ${activeTool === 'query' ? 'bg-violet-600 text-white' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              ✉️ Query Generator
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-4xl">
          {activeTool === 'encyclopedia' && <Encyclopedia darkMode={darkMode} />}
          {activeTool === 'comp' && <CompSearcher darkMode={darkMode} />}
          {activeTool === 'query' && <QueryLetterGenerator darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}