import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setActiveTab } from '../store/complaintSlice';
import { FileText, Cpu, Database, CheckSquare, Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.complaint.activeTab);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex flex-row items-center justify-between flex-nowrap gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
          {/* Brand Logo & Title Area */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/15 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col shrink-0">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-tight whitespace-nowrap">
                Pharma QA Copilot
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight whitespace-nowrap">
                AI-powered Customer Complaint Management System
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bar & Engine Badge */}
          <div className="flex flex-row items-center space-x-2 shrink-0 flex-nowrap">
            <nav className="flex flex-row items-center space-x-1 sm:space-x-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200/80 shrink-0 flex-nowrap">
              <button
                onClick={() => dispatch(setActiveTab('intake'))}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'intake'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Complaint Intake</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('architecture'))}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'architecture'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>LangGraph Architecture</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('capa'))}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'capa'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                <span>CAPA Remediation</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab('database'))}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === 'database'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>QMS Audit Database</span>
              </button>
            </nav>

            {/* AI Model Badge */}
            <div className="hidden xl:flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 text-[11px] text-slate-600 shrink-0 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="font-medium text-slate-700">Groq LLM</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-500">llama-3.3-70b</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


