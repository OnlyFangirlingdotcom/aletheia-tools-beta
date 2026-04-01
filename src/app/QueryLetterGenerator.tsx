'use client';

import { useState, useEffect } from 'react';

interface Props {
  darkMode: boolean;
}

export default function QueryLetterGenerator({ darkMode }: Props) {
  const [bookTitle, setBookTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [hook, setHook] = useState('');
  const [stakes, setStakes] = useState('');
  const [compTitles, setCompTitles] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [tone, setTone] = useState<'literary' | 'commercial' | 'bold' | 'warm'>('literary');

  const [generatedLetter, setGeneratedLetter] = useState('');
  const [qualityScore, setQualityScore] = useState(0);
  const [copied, setCopied] = useState(false);

  // Live quality score
  useEffect(() => {
    let score = 0;
    if (bookTitle.length > 5) score += 15;
    if (genre) score += 10;
    if (hook.length > 30) score += 25;
    if (stakes.length > 30) score += 20;
    if (compTitles.length > 10) score += 15;
    if (authorBio.length > 20) score += 15;
    setQualityScore(Math.min(100, score));
  }, [bookTitle, genre, hook, stakes, compTitles, authorBio]);

  const generateLetter = () => {
    const tonePhrases = {
      literary: "with literary precision and emotional depth",
      commercial: "with strong commercial appeal and page-turning tension",
      bold: "with a bold, distinctive voice and fresh perspective",
      warm: "with warmth, heart, and relatable characters"
    };

    const letter = `
Dear [Agent's Name],

I am excited to submit my ${genre || "genre"} novel, **${bookTitle || "TITLE"}** (${wordCount || "XX,XXX"} words), ${tonePhrases[tone]}.

${hook || "This story follows..."}

At its heart, the book explores ${stakes || "deep personal stakes"} in a way that will resonate with readers who loved ${compTitles || "comparable titles"}.

${authorBio ? "About me: " + authorBio : "I am a debut author with a passion for storytelling."}

Thank you for your time and consideration. I look forward to the possibility of working together.

Warm regards,  
[Your Name]
    `.trim();

    setGeneratedLetter(letter);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`max-w-6xl mx-auto px-6 py-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tighter">Query Letter Generator</h1>
        <p className="mt-3 text-xl text-gray-500">Craft professional, agent-ready query letters with guidance</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form - Bigger, centered inputs */}
        <div className={`rounded-3xl p-12 shadow-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-8 text-center">Tell us about your book</h2>

          <div className="space-y-8">
            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-medium mb-3 text-center">Choose your letter tone</label>
              <div className="flex gap-3 justify-center flex-wrap">
                {(['literary', 'commercial', 'bold', 'warm'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-7 py-3 rounded-3xl text-sm font-medium transition-all ${
                      tone === t 
                        ? 'bg-violet-600 text-white shadow-md' 
                        : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Book Title</label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="e.g. The Silent Patient"
                className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
                >
                  <option value="">Select genre...</option>
                  <option value="Literary Fiction">Literary Fiction</option>
                  <option value="Upmarket Fiction">Upmarket Fiction</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="YA Fantasy">YA Fantasy</option>
                  <option value="Historical Fiction">Historical Fiction</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Horror">Horror</option>
                  <option value="Memoir">Memoir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Word Count</label>
                <input
                  type="text"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  placeholder="e.g. 85,000"
                  className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Hook / Logline</label>
              <textarea
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="One compelling sentence that grabs attention..."
                rows={4}
                className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Stakes / Emotional Core</label>
              <textarea
                value={stakes}
                onChange={(e) => setStakes(e.target.value)}
                placeholder="What is at stake for the protagonist?"
                rows={4}
                className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Comp Titles</label>
              <input
                type="text"
                value={compTitles}
                onChange={(e) => setCompTitles(e.target.value)}
                placeholder="e.g. Gone Girl meets The Silent Patient"
                className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Short Author Bio</label>
              <textarea
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="Previous publications, awards, or relevant background..."
                rows={4}
                className={`w-full px-8 py-6 text-xl rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}
              />
            </div>
          </div>

          <button
            onClick={generateLetter}
            className="mt-12 w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-6 text-xl rounded-3xl transition-colors"
          >
            Generate Professional Query Letter
          </button>
        </div>

        {/* Live Preview */}
        <div className={`rounded-3xl p-12 shadow-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-8">Live Preview</h2>

          {generatedLetter ? (
            <div className="relative">
              <div className={`p-10 rounded-3xl font-serif text-lg leading-relaxed whitespace-pre-wrap ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-zinc-50 text-gray-800'}`}>
                {generatedLetter}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-8 right-8 px-7 py-3 bg-white dark:bg-gray-800 border rounded-2xl text-sm font-medium hover:bg-violet-50 transition-colors"
              >
                {copied ? '✅ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          ) : (
            <div className="text-center py-28 text-gray-500">
              Fill the form on the left and click "Generate" to see a live preview
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 px-8 py-4 rounded-3xl">
              <span className="text-sm font-medium">Quality Score</span>
              <span className={`font-bold text-3xl ${qualityScore > 70 ? 'text-green-600' : qualityScore > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {qualityScore}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}