import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDescription extends Document {
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

const JobDescriptionSchema: Schema = new Schema(
  {
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function (skills: string[]) {
          return Array.isArray(skills) && skills.length > 0;
        },
        message: 'Skills list cannot be empty',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model overwrite error during reload
export const JobDescription: mongoose.Model<IJobDescription> =
  (mongoose.models.JobDescription as mongoose.Model<IJobDescription>) ||
  mongoose.model<IJobDescription>('JobDescription', JobDescriptionSchema);
