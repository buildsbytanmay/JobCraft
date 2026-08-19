import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { JobDescriptionItem } from '../types.js';

interface JobViewModalProps {
  job: JobDescriptionItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const JobViewModal: React.FC<JobViewModalProps> = ({ job, onClose, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!job) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(job.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(job._id);
    }
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {job.employmentType}
              </span>
              <span className="text-xs text-slate-400">
                {formattedDate}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{job.jobTitle}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
              <span className="font-medium text-slate-800">
                {job.company}
              </span>
              <span>&bull;</span>
              <span>{job.location}</span>
              <span>&bull;</span>
              <span>{job.experience}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-slate-500 mr-1">
              Required skills:
            </span>
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
          {job.description}
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2.5">
          <div>
            {onDelete && (
              isConfirmingDelete ? (
                <div className="flex items-center gap-2 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  <span className="text-xs text-red-700 font-medium">Delete this job description?</span>
                  <button
                    onClick={handleDelete}
                    className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy description</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
