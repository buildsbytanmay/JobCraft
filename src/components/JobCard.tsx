import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { JobDescriptionItem } from '../types.js';

interface JobCardProps {
  job: JobDescriptionItem;
  onView: (job: JobDescriptionItem) => void;
  onDelete: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onView, onDelete }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Auto reset delete confirmation after 5 seconds if not clicked
  useEffect(() => {
    if (!isConfirmingDelete) return;
    const timer = setTimeout(() => {
      setIsConfirmingDelete(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isConfirmingDelete]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(job.description);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
    onDelete(job._id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  // Helper to format date naturally
  const formatSavedDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Saved today';
    if (diffDays === 1) return 'Saved yesterday';
    return `Saved on ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div
      onClick={() => onView(job)}
      className="p-5 bg-white rounded-xl border border-slate-200/90 hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Title & Employment Type */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 text-sm tracking-tight truncate flex-1">
            {job.jobTitle}
          </h3>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
            {job.employmentType}
          </span>
        </div>

        {/* Company & Location */}
        <p className="text-xs font-medium text-slate-700">
          {job.company}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {job.location} &bull; {job.experience}
        </p>

        {/* Skills Snippet */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mt-3">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">
          {formatSavedDate(job.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          {isConfirmingDelete ? (
            /* In-Card Safe Confirmation (Iframe compatible) */
            <div
              className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md border border-red-200 animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[11px] font-medium text-red-700">Delete?</span>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-2 py-0.5 text-[11px] font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Quick Copy */}
              <button
                type="button"
                onClick={handleCopy}
                title="Copy job description"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* View */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(job);
                }}
                className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
              >
                View
              </button>

              {/* Delete Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(true);
                }}
                title="Delete description"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
