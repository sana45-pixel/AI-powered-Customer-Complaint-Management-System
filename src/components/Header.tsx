import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Title Area */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-tight">
                  AIVOA Complaints Module
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Pharma QMS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-tight">
                Autonomous Quality Management &amp; Customer Complaint Intake System
              </p>
            </div>
          </div>

          {/* AI Copilot Status Badge */}
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-800">AIVOA Copilot Engine</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
