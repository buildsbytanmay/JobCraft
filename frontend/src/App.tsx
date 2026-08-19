import { useState, useEffect } from 'react';
import { JobFormData, JobDescriptionItem } from './types.js';
import {
  generateJobDescriptionApi,
  saveJobDescriptionApi,
  getJobDescriptionsApi,
  deleteJobDescriptionApi,
} from './services/api.js';
import { Header } from './components/Header.js';
import { JobForm } from './components/JobForm.js';
import { JobDescriptionEditor } from './components/JobDescriptionEditor.js';
import { JobList } from './components/JobList.js';
import { JobViewModal } from './components/JobViewModal.js';
import { Toast, ToastMessage } from './components/Toast.js';

export default function App() {
  // Form State
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    company: '',
    experience: '',
    skills: '',
    location: '',
    employmentType: 'Full-time',
  });

  // Generated Job Description State
  const [description, setDescription] = useState<string>('');
  const [activeJobContext, setActiveJobContext] = useState<JobFormData | null>(null);

  // Saved Jobs List State
  const [savedJobs, setSavedJobs] = useState<JobDescriptionItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);

  // Operation Progress States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Modal & Toast States
  const [viewingJob, setViewingJob] = useState<JobDescriptionItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load: Fetch saved jobs
  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const jobs = await getJobDescriptionsApi();
      setSavedJobs(jobs);
    } catch (err: any) {
      console.warn('Failed to load saved jobs:', err.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle AI Generation
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const generatedText = await generateJobDescriptionApi(formData);
      setDescription(generatedText);
      setActiveJobContext({ ...formData });
      showToast('success', 'Job description generated!');

      // Smooth scroll to the editor on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const editorEl = document.getElementById('generated-description-section');
          if (editorEl) {
            editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate job description.';
      showToast('error', msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Save Description
  const handleSave = async () => {
    if (!description.trim() || !activeJobContext) {
      showToast('error', 'Please generate a job description before saving.');
      return;
    }

    try {
      setIsSaving(true);
      const skillsArray = activeJobContext.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const savedItem = await saveJobDescriptionApi({
        jobTitle: activeJobContext.jobTitle,
        company: activeJobContext.company,
        experience: activeJobContext.experience,
        skills: skillsArray,
        location: activeJobContext.location,
        employmentType: activeJobContext.employmentType,
        description: description,
      });

      setSavedJobs((prev) => [savedItem, ...prev.filter((j) => j._id !== savedItem._id)]);
      showToast('success', 'Job description saved!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save job description.';
      showToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteJobDescriptionApi(id);
      setSavedJobs((prev) => prev.filter((j) => j._id !== id));
      showToast('info', 'Job description deleted.');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete job description.';
      showToast('error', msg);
    }
  };

  const handleClearEditor = () => {
    setDescription('');
    setActiveJobContext(null);
  };

  const scrollToCreate = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSaved = () => {
    const savedEl = document.getElementById('saved-jobs-section');
    if (savedEl) {
      savedEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Product Header */}
      <Header
        totalSaved={savedJobs.length}
        onNavigateToCreate={scrollToCreate}
        onNavigateToSaved={scrollToSaved}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Main Heading Area */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create a job description
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Enter the role details and let AI create a professional first draft.
          </p>
        </div>

        {/* 2-Column Builder Section (Job details + Job description) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job details Form */}
          <div className="lg:col-span-5 w-full">
            <JobForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerate}
              isLoading={isGenerating}
            />
          </div>

          {/* Right Column: Job description Editor */}
          <div className="lg:col-span-7 w-full">
            <JobDescriptionEditor
              description={description}
              setDescription={setDescription}
              jobContext={activeJobContext}
              onSave={handleSave}
              isSaving={isSaving}
              onClear={handleClearEditor}
              onCopySuccess={() => showToast('success', 'Copied to clipboard')}
            />
          </div>
        </div>

        {/* Saved Job Descriptions Section */}
        <div className="pt-6">
          <JobList
            jobs={savedJobs}
            isLoading={isLoadingJobs}
            onView={(job) => setViewingJob(job)}
            onDelete={handleDelete}
            onRefresh={fetchJobs}
          />
        </div>
      </main>

      {/* View Full Job Modal */}
      <JobViewModal
        job={viewingJob}
        onClose={() => setViewingJob(null)}
        onDelete={(id) => {
          handleDelete(id);
          setViewingJob(null);
        }}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Product Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-medium text-slate-700">JobCraft &bull; AI-powered job description builder</p>
          <p className="text-slate-400">Craft clear, effective recruitment postings in seconds</p>
        </div>
      </footer>
    </div>
  );
}
