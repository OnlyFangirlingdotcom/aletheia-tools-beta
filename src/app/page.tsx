'use client';

import { useState } from 'react';
import Encyclopedia from './Encyclopedia';
import CompSearcher from './CompSearcher';
import QueryLetterGenerator from './QueryLetterGenerator';
import BeatSheet from './BeatSheet';

export default function Home() {
  const [activeTool, setActiveTool] = useState<'encyclopedia' | 'comp' | 'query' | 'beat'>('comp');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950' : 'bg-[#f8fafc]'}`}>
      {/* Clean Header */}
      <header className={`py-10 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
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

      {/* Main Content - Fully Centered */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Centered Tool Tabs */}
        <div className="flex justify-center mb-16">
          <div className={`inline-flex bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            {[
              { id: 'encyclopedia', label: '📖 Encyclopedia' },
              { id: 'comp', label: '🔍 Comp Searcher' },
              { id: 'query', label: '✉️ Query Generator' },
              { id: 'beat', label: '📋 Beat Sheet' },
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`px-8 py-4 rounded-3xl text-lg font-medium transition-all ${
                  activeTool === tool.id 
                    ? 'bg-violet-600 text-white shadow-md' 
                    : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Content - Large Centered Box */}
        <div className={`rounded-3xl p-14 shadow-2xl min-h-[75vh] ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
          {activeTool === 'encyclopedia' && <Encyclopedia darkMode={darkMode} />}
          {activeTool === 'comp' && <CompSearcher darkMode={darkMode} />}
          {activeTool === 'query' && <QueryLetterGenerator darkMode={darkMode} />}
          {activeTool === 'beat' && <BeatSheet darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}