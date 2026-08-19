import axios from 'axios';
import { JobFormData, JobDescriptionItem, ApiResponse, ServerHealth } from '../types.js';

// Support VITE_API_URL for production or separate dev server (e.g., http://localhost:5000)
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

/**
 * Generate a Job Description using Gemini AI via Express Backend
 */
export async function generateJobDescriptionApi(formData: JobFormData): Promise<string> {
  const skillsArray = formData.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    jobTitle: formData.jobTitle.trim(),
    company: formData.company.trim(),
    experience: formData.experience.trim(),
    skills: skillsArray,
    location: formData.location.trim(),
    employmentType: formData.employmentType,
  };

  const response = await apiClient.post<ApiResponse>('/api/jobs/generate', payload);
  if (!response.data.success || !response.data.description) {
    throw new Error(response.data.message || 'Failed to generate job description.');
  }

  return response.data.description;
}

/**
 * Save Job Description to Database
 */
export async function saveJobDescriptionApi(payload: {
  jobTitle: string;
  company: string;
  experience: string;
  skills: string[];
  location: string;
  employmentType: string;
  description: string;
}): Promise<JobDescriptionItem> {
  const response = await apiClient.post<ApiResponse<JobDescriptionItem>>('/api/jobs', payload);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to save job description.');
  }

  return response.data.data;
}

/**
 * Fetch all previously saved job descriptions
 */
export async function getJobDescriptionsApi(): Promise<JobDescriptionItem[]> {
  const response = await apiClient.get<ApiResponse<JobDescriptionItem[]>>('/api/jobs');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch job descriptions.');
  }

  return response.data.data || [];
}

/**
 * Fetch a single job description by ID
 */
export async function getJobDescriptionByIdApi(id: string): Promise<JobDescriptionItem> {
  const response = await apiClient.get<ApiResponse<JobDescriptionItem>>(`/api/jobs/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Job description not found.');
  }

  return response.data.data;
}

/**
 * Delete a saved job description by ID
 */
export async function deleteJobDescriptionApi(id: string): Promise<void> {
  const response = await apiClient.delete<ApiResponse>(`/api/jobs/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete job description.');
  }
}

/**
 * Check backend health and DB connection
 */
export async function checkHealthApi(): Promise<ServerHealth> {
  const response = await apiClient.get<ServerHealth>('/api/health');
  return response.data;
}
