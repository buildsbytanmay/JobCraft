import React, { useState, KeyboardEvent } from 'react';
import { Sparkles, Loader2, RotateCcw, X, Plus } from 'lucide-react';
import { JobFormData } from '../types.js';

interface JobFormProps {
  formData: JobFormData;
  setFormData: React.Dispatch<React.SetStateAction<JobFormData>>;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
}

const PRESET_TEMPLATES: Array<{
  label: string;
  data: JobFormData;
}> = [
  {
    label: 'Full Stack Developer',
    data: {
      jobTitle: 'Full Stack Developer',
      company: 'TechNova Solutions',
      experience: '2–4 years',
      skills: 'React, Node.js, Express.js, MongoDB, TypeScript, REST APIs',
      location: 'Pune, Maharashtra',
      employmentType: 'Full-time',
    },
  },
  {
    label: 'Frontend Engineer',
    data: {
      jobTitle: 'Senior Frontend Engineer',
      company: 'PixelCraft Labs',
      experience: '3–5 years',
      skills: 'React, TypeScript, Tailwind CSS, Next.js, Redux',
      location: 'Bengaluru, Karnataka',
      employmentType: 'Remote',
    },
  },
  {
    label: 'Product Designer',
    data: {
      jobTitle: 'Product Designer',
      company: 'Studio Aurora',
      experience: '2–4 years',
      skills: 'Figma, Design Systems, User Research, Prototyping, Wireframing',
      location: 'Mumbai, Maharashtra',
      employmentType: 'Full-time',
    },
  },
];

const SUGGESTED_SKILLS = [
  'React',
  'Node.js',
  'MongoDB',
  'TypeScript',
  'REST APIs',
  'Tailwind CSS',
  'Python',
  'SQL',
];

export const JobForm: React.FC<JobFormProps> = ({
  formData,
  setFormData,
  onGenerate,
  isLoading,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState('');

  // Parsed array of skills from formData.skills
  const skillsList = formData.skills
    ? formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Please enter a job title.';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Please enter the company name.';
    }
    if (!formData.experience.trim()) {
      newErrors.experience = 'Please specify required experience.';
    }
    if (skillsList.length === 0 && !formData.skills.trim()) {
      newErrors.skills = 'Please add at least one required skill.';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please specify job location.';
    }
    if (!formData.employmentType) {
      newErrors.employmentType = 'Please select employment type.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onGenerate();
  };

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Tag manipulation for skills
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    const parts = trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = [...skillsList];
    for (const part of parts) {
      if (!updated.includes(part)) {
        updated.push(part);
      }
    }

    handleInputChange('skills', updated.join(', '));
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    handleInputChange('skills', updated.join(', '));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === 'Backspace' && !skillInput && skillsList.length > 0) {
      removeSkill(skillsList[skillsList.length - 1]);
    }
  };

  const handleApplyPreset = (presetData: JobFormData) => {
    setFormData(presetData);
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      jobTitle: '',
      company: '',
      experience: '',
      skills: '',
      location: '',
      employmentType: 'Full-time',
    });
    setSkillInput('');
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            Job details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the role requirements to craft a tailored description
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Preset Suggestions */}
      <div className="mb-5 flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-400 font-medium mr-1">Sample roles:</span>
        {PRESET_TEMPLATES.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handleApplyPreset(preset.data)}
            disabled={isLoading}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <div>
          <label
            htmlFor="jobTitle"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Job title <span className="text-red-500">*</span>
          </label>
          <input
            id="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="e.g. Full Stack Developer"
            disabled={isLoading}
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
              errors.jobTitle ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {errors.jobTitle && (
            <p className="text-xs text-red-600 mt-1">{errors.jobTitle}</p>
          )}
        </div>

        {/* Company & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="company"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Company <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="e.g. TechNova Solutions"
              disabled={isLoading}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                errors.company ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.company && (
              <p className="text-xs text-red-600 mt-1">{errors.company}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="experience"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Experience <span className="text-red-500">*</span>
            </label>
            <input
              id="experience"
              type="text"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="e.g. 2–4 years"
              disabled={isLoading}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                errors.experience ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.experience && (
              <p className="text-xs text-red-600 mt-1">{errors.experience}</p>
            )}
          </div>
        </div>

        {/* Location & Employment Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g. Pune, Maharashtra (or Remote)"
              disabled={isLoading}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                errors.location ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.location && (
              <p className="text-xs text-red-600 mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="employmentType"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Employment type <span className="text-red-500">*</span>
            </label>
            <select
              id="employmentType"
              value={formData.employmentType}
              onChange={(e) =>
                handleInputChange(
                  'employmentType',
                  e.target.value as JobFormData['employmentType']
                )
              }
              disabled={isLoading}
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                errors.employmentType ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
            {errors.employmentType && (
              <p className="text-xs text-red-600 mt-1">{errors.employmentType}</p>
            )}
          </div>
        </div>

        {/* Skills Section with Tags/Chips */}
        <div>
          <label
            htmlFor="skillsInput"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Skills <span className="text-red-500">*</span>
          </label>

          {/* Interactive Tag Container */}
          <div
            className={`min-h-[44px] p-2 rounded-lg border bg-white flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-colors ${
              errors.skills ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
            }`}
          >
            {/* Display entered skill tags */}
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  disabled={isLoading}
                  className="hover:text-indigo-900 focus:outline-none cursor-pointer"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* In-line skill input */}
            <input
              id="skillsInput"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onBlur={() => {
                if (skillInput.trim()) addSkill(skillInput);
              }}
              placeholder={skillsList.length === 0 ? 'Type a skill and press Enter...' : 'Add more...'}
              disabled={isLoading}
              className="flex-1 min-w-[140px] px-1 py-1 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>
          {errors.skills && (
            <p className="text-xs text-red-600 mt-1">{errors.skills}</p>
          )}

          {/* Suggested skill chips */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className="text-xs text-slate-400">Suggestions:</span>
            {SUGGESTED_SKILLS.map((skill) => {
              const isAlreadyAdded = skillsList.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  disabled={isLoading || isAlreadyAdded}
                  className={`text-xs px-2 py-0.5 rounded transition-colors ${
                    isAlreadyAdded
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer'
                  }`}
                >
                  + {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-job-btn"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Generate job description</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
