import React from 'react';

interface Props {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold tracking-tight">ThumbRate AI</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-slate-300 hover:text-white transition-colors">Log In</button>
              <button 
                onClick={onGetStarted}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">Powered by Gemini 3 Pro Preview</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
            Stop Guessing. <br/>Start Clicking.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Upload your thumbnail variations and let world-class AI predict the winner before you publish. 
            Optimize for CTR with professional-grade critiques.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl"
            >
              Analyze My Thumbnails
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-xl font-medium text-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">A/B/C/D/E Testing</h3>
              <p className="text-slate-400">Compare up to 5 variations instantly. No need to wait for live YouTube impressions.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
               <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro-Level Reasoning</h3>
              <p className="text-slate-400">Powered by Gemini 3 Pro, our AI understands visual hierarchy, psychology, and niche context.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
               <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 text-green-400">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Actionable Feedback</h3>
              <p className="text-slate-400">Don't just get a score. Get specific pros, cons, and improvement suggestions for your niche.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};