import React from 'react';
import { Sparkles, Bookmark, PlusCircle } from 'lucide-react';

interface HeaderProps {
  totalSaved: number;
  onNavigateToCreate: () => void;
  onNavigateToSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalSaved,
  onNavigateToCreate,
  onNavigateToSaved,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToCreate}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                JobCraft
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              AI-powered job description builder
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" />
            <span>Create</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>My Job Descriptions</span>
            {totalSaved > 0 && (
              <span className="ml-0.5 px-2 py-0.2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                {totalSaved}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
