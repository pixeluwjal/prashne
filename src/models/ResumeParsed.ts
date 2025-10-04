import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience {
  company: string;
  role: string;
  years: string;
  duration?: string;
}

export interface IEducation {
  degree: string;
  college: string;
  year: string;
}

export interface IResumeParsed extends Document {
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  originalFileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
  company: String,
  role: String,
  years: String,
  duration: String
});

const educationSchema = new Schema<IEducation>({
  degree: String,
  college: String,
  year: String
});

const resumeParsedSchema = new Schema<IResumeParsed>({
  fullName: String,
  email: String,
  phone: String,
  skills: [String],
  experience: [experienceSchema],
  education: [educationSchema],
  originalFileUrl: String,
  fileName: String,
  fileSize: Number,
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export default mongoose.models.ResumeParsed || mongoose.model<IResumeParsed>('ResumeParsed', resumeParsedSchema);