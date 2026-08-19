import React, { useState } from 'react';
import {
  Copy,
  Check,
  BookmarkPlus,
  Edit3,
  Eye,
  Loader2,
  Trash2,
  FileText,
} from 'lucide-react';
import { JobFormData } from '../types.js';

interface JobDescriptionEditorProps {
  description: string;
  setDescription: (val: string) => void;
  jobContext: JobFormData | null;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onClear: () => void;
  onCopySuccess?: () => void;
}

export const JobDescriptionEditor: React.FC<JobDescriptionEditorProps> = ({
  description,
  setDescription,
  jobContext,
  onSave,
  isSaving,
  onClear,
  onCopySuccess,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const handleCopy = async () => {
    if (!description) return;
    try {
      await navigator.clipboard.writeText(description);
      setIsCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;

  return (
    <div
      id="generated-description-section"
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col h-full"
    >
      {/* Description Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            Job description
          </h2>
          {jobContext ? (
            <p className="text-xs text-slate-500 mt-0.5">
              {jobContext.jobTitle} &bull; {jobContext.company} ({jobContext.employmentType})
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">
              Review, edit, and refine the generated draft
            </p>
          )}
        </div>

        {/* Action Controls */}
        {description && (
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Tab switch: Edit / Preview */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium mr-1">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              id="copy-description-btn"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Save Button */}
            <button
              type="button"
              id="save-description-btn"
              onClick={onSave}
              disabled={isSaving || !description.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-indigo-100" />
                  <span>Save description</span>
                </>
              )}
            </button>

            {/* Clear / Discard */}
            <button
              type="button"
              onClick={onClear}
              title="Clear description"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      {description ? (
        <div className="flex-1 flex flex-col min-h-[360px]">
          {activeTab === 'edit' ? (
            <textarea
              id="job-description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Your job description will appear here..."
              rows={16}
              className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm leading-relaxed font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
            />
          ) : (
            <div className="w-full flex-1 p-5 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans overflow-y-auto min-h-[360px]">
              {description}
            </div>
          )}

          {/* Word count & document helper */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 px-1">
            <span>You can edit this draft before saving or copying</span>
            <span>{wordCount} words &bull; {charCount} characters</span>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-xl min-h-[320px]">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Your job description will appear here
          </h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Fill in the role details and generate a draft to get started.
          </p>
        </div>
      )}
    </div>
  );
};
