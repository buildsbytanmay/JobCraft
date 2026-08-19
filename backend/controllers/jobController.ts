import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JobDescription } from '../models/JobDescription.js';
import { generateJobDescription } from '../services/aiService.js';

interface MemoryJob {
  _id: string;
  jobTitle: string;
  company: string;
  experience: string;
  skills: string[];
  location: string;
  employmentType: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

let inMemoryJobs: MemoryJob[] = [];

const isMongoActive = (): boolean => {
  return mongoose.connection.readyState === 1;
};

const parseSkills = (skills: any): string[] => {
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof skills === 'string') {
    return skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * @desc    Generate Job Description using Gemini AI
 * @route   POST /api/jobs/generate
 * @access  Public
 */
export const generateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobTitle, company, experience, skills, location, employmentType } = req.body;

    if (!jobTitle || !String(jobTitle).trim()) {
      return res.status(400).json({ success: false, message: 'Job title is required.' });
    }
    if (!company || !String(company).trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }
    if (!experience || !String(experience).trim()) {
      return res.status(400).json({ success: false, message: 'Experience is required.' });
    }
    const parsedSkills = parseSkills(skills);
    if (parsedSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one skill is required.' });
    }
    if (!location || !String(location).trim()) {
      return res.status(400).json({ success: false, message: 'Location is required.' });
    }
    if (!employmentType || !String(employmentType).trim()) {
      return res.status(400).json({ success: false, message: 'Employment type is required.' });
    }

    const description = await generateJobDescription({
      jobTitle: String(jobTitle).trim(),
      company: String(company).trim(),
      experience: String(experience).trim(),
      skills: parsedSkills,
      location: String(location).trim(),
      employmentType: String(employmentType).trim(),
    });

    res.status(200).json({
      success: true,
      description,
      data: {
        jobTitle: String(jobTitle).trim(),
        company: String(company).trim(),
        experience: String(experience).trim(),
        skills: parsedSkills,
        location: String(location).trim(),
        employmentType: String(employmentType).trim(),
        description,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Save Job Description to Database
 * @route   POST /api/jobs
 * @access  Public
 */
export const saveJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobTitle, company, experience, skills, location, employmentType, description } = req.body;

    if (!jobTitle || !company || !experience || !location || !employmentType || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields including the generated job description are required.',
      });
    }

    const parsedSkills = parseSkills(skills);
    if (parsedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one skill is required.',
      });
    }

    if (isMongoActive()) {
      const newJob = await JobDescription.create({
        jobTitle: String(jobTitle).trim(),
        company: String(company).trim(),
        experience: String(experience).trim(),
        skills: parsedSkills,
        location: String(location).trim(),
        employmentType: String(employmentType).trim(),
        description: String(description).trim(),
      });

      return res.status(201).json({
        success: true,
        message: 'Job description saved successfully.',
        data: newJob,
      });
    }

    // In-memory persistence
    const newMemoryJob: MemoryJob = {
      _id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      jobTitle: String(jobTitle).trim(),
      company: String(company).trim(),
      experience: String(experience).trim(),
      skills: parsedSkills,
      location: String(location).trim(),
      employmentType: String(employmentType).trim(),
      description: String(description).trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryJobs.unshift(newMemoryJob);

    return res.status(201).json({
      success: true,
      message: 'Job description saved successfully (in-memory mode).',
      data: newMemoryJob,
      storage: 'in-memory',
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Get all saved job descriptions
 * @route   GET /api/jobs
 * @access  Public
 */
export const getJobs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (isMongoActive()) {
      const jobs = await JobDescription.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    }

    return res.status(200).json({
      success: true,
      count: inMemoryJobs.length,
      data: inMemoryJobs,
      storage: 'in-memory',
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Get single job description by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid job description ID format.' });
      }
      const job = await JobDescription.findOne({ _id: id });
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job description not found.' });
      }
      return res.status(200).json({ success: true, data: job });
    }

    const job = inMemoryJobs.find((j) => j._id === id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job description not found.' });
    }

    return res.status(200).json({ success: true, data: job });
  } catch (error: any) {
    next(error);
  }
};

/**
 * @desc    Delete job description by ID
 * @route   DELETE /api/jobs/:id
 * @access  Public
 */
export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid job description ID format.' });
      }
      const deletedJob = await JobDescription.findOneAndDelete({ _id: id });
      if (!deletedJob) {
        return res.status(404).json({ success: false, message: 'Job description not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Job description deleted successfully.',
      });
    }

    const initialLen = inMemoryJobs.length;
    inMemoryJobs = inMemoryJobs.filter((j) => j._id !== id);
    if (inMemoryJobs.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Job description not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job description deleted successfully.',
    });
  } catch (error: any) {
    next(error);
  }
};
