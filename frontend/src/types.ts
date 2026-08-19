export interface JobFormData {
  jobTitle: string;
  company: string;
  experience: string;
  skills: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';
}

export interface JobDescriptionItem {
  _id: string;
  jobTitle: string;
  company: string;
  experience: string;
  skills: string[];
  location: string;
  employmentType: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  description?: string;
  count?: number;
  storage?: string;
}

export interface ServerHealth {
  status: string;
  service: string;
  database: {
    connected: boolean;
    readyState: number;
    host: string;
  };
  aiModel: string;
  timestamp: string;
}
