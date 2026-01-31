import React, { useState, useEffect } from 'react';
import { ThumbnailSlot } from './ThumbnailSlot';
import { ThumbnailSlotData, AnalysisResult } from '../types';
import { analyzeThumbnails } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const HistoryIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  
  // Form State
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [thumbnails, setThumbnails] = useState<ThumbnailSlotData[]>([
    { id: 'A', file: null, previewUrl: null, base64: null },
    { id: 'B', file: null, previewUrl: null, base64: null },
    { id: 'C', file: null, previewUrl: null, base64: null },
    { id: 'D', file: null, previewUrl: null, base64: null },
    { id: 'E', file: null, previewUrl: null, base64: null },
  ]);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (id: string, file: File, base64: string) => {
    setThumbnails(prev => prev.map(t => t.id === id ? { ...t, file, previewUrl: base64, base64 } : t));
  };

  const handleRemove = (id: string) => {
    setThumbnails(prev => prev.map(t => t.id === id ? { ...t, file: null, previewUrl: null, base64: null } : t));
  };

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setError("Please enter a video title.");
      return;
    }
    const uploadedCount = thumbnails.filter(t => t.file).length;
    if (uploadedCount < 2) {
      setError("Please upload at least 2 thumbnails to compare.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeThumbnails(title, niche, thumbnails);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10">
        <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-800">
           <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-500 rounded-lg flex-shrink-0"></div>
           <span className="hidden lg:block font-bold text-xl tracking-tight">ThumbRate</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${activeTab === 'create' ? 'bg-brand-600/10 text-brand-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <HomeIcon />
            <span className="hidden lg:block font-medium">New Analysis</span>
          </button>
          <button 
             onClick={() => setActiveTab('history')}
             className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-brand-600/10 text-brand-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <HistoryIcon />
            <span className="hidden lg:block font-medium">History</span>
             <span className="hidden lg:block ml-auto text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">Pro</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <SettingsIcon />
            <span className="hidden lg:block font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">New Analysis</h1>
            <p className="text-slate-400">Compare your thumbnails against your title and niche.</p>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Video Title <span className="text-brand-400">*</span></label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., I Survived 100 Days in Minecraft Hardcore"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Niche / Channel Topic <span className="text-slate-500 text-xs">(Optional)</span></label>
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., Gaming, Finance, Lifestyle Vlog"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center">
              <h3 className="font-semibold text-white mb-2">Tips for best results:</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-brand-400">•</span> Upload clean, high-res images (1280x720)
                </li>
                 <li className="flex gap-2">
                  <span className="text-brand-400">•</span> Provide the exact video title
                </li>
                 <li className="flex gap-2">
                  <span className="text-brand-400">•</span> Try different text placements variations
                </li>
              </ul>
            </div>
          </div>

          {/* Upload Grid */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">Thumbnail Variations (Max 5)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {thumbnails.map((slot) => (
                <ThumbnailSlot 
                  key={slot.id} 
                  data={slot} 
                  onUpload={handleUpload} 
                  onRemove={handleRemove}
                  disabled={isAnalyzing}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end mb-16">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center gap-3
                ${isAnalyzing 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-brand-600 hover:bg-brand-500 text-white hover:shadow-brand-500/25'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Report
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="animate-fade-in-up space-y-12">
              
              {/* Winner Banner */}
              <div className="bg-gradient-to-r from-brand-900 to-purple-900 rounded-2xl p-8 border border-brand-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-shrink-0">
                      <div className="text-brand-300 font-bold tracking-wider text-sm mb-1 uppercase">Overall Winner</div>
                      <div className="text-5xl font-bold text-white mb-4">Slot {result.overallWinner}</div>
                      <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-200 border border-brand-500/30 text-sm font-medium">
                        Highest Potential CTR
                      </div>
                    </div>
                    <div className="h-px w-full md:w-px md:h-24 bg-brand-500/30"></div>
                    <div>
                      <p className="text-lg text-slate-200 leading-relaxed italic">"{result.summary}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts & Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-6">Score Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.thumbnails}>
                        <XAxis dataKey="slotId" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                          cursor={{fill: '#334155', opacity: 0.4}}
                        />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {result.thumbnails.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.slotId === result.overallWinner ? '#0ea5e9' : '#475569'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Cards */}
                <div className="space-y-4">
                  {result.thumbnails.map((thumb) => (
                    <div key={thumb.slotId} className={`p-5 rounded-xl border ${thumb.slotId === result.overallWinner ? 'bg-brand-900/10 border-brand-500/50' : 'bg-slate-800 border-slate-700'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${thumb.slotId === result.overallWinner ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                            {thumb.slotId}
                          </span>
                          <span className="text-2xl font-bold text-white">{thumb.score}<span className="text-sm text-slate-500 font-normal">/100</span></span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{thumb.critique}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 block">Pros</span>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {thumb.pros.slice(0, 3).map((p, i) => <li key={i} className="flex gap-2"><span className="text-green-500">✓</span> {p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 block">Cons</span>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {thumb.cons.slice(0, 3).map((p, i) => <li key={i} className="flex gap-2"><span className="text-red-500">×</span> {p}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};
