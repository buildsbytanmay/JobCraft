import React, { useState, useMemo } from 'react';
import { Search, FolderOpen, Loader2, RefreshCw } from 'lucide-react';
import { JobDescriptionItem } from '../types.js';
import { JobCard } from './JobCard.js';

interface JobListProps {
  jobs: JobDescriptionItem[];
  isLoading: boolean;
  onView: (job: JobDescriptionItem) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  onView,
  onDelete,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        selectedFilter === 'All' || job.employmentType === selectedFilter;

      return matchesSearch && matchesType;
    });
  }, [jobs, searchQuery, selectedFilter]);

  return (
    <section id="saved-jobs-section" className="space-y-4">
      {/* Section Header & Search/Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              My job descriptions
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {jobs.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Previously generated and saved job postings
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or company..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh list"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* List / Cards */}
      {isLoading ? (
        <div className="p-10 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mb-2" />
          <p className="text-xs font-medium text-slate-600">Loading saved descriptions...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-10 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
            <FolderOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-800">No saved job descriptions yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-0.5">
            When you create and save job descriptions, they will appear here.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600">No job descriptions matched your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('All');
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-1.5 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};
