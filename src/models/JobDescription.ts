// src/models/JobDescription.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDescription extends Document {
  title: string;
  company?: string;
  location?: string;
  description: string;
  skills: string[];
  // 💡 FIX: ADD hrId to the interface
  hrId: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const JobDescriptionSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  location: { type: String, trim: true },
  description: { type: String, required: true },
  skills: [{ type: String, trim: true }],
  // 💡 FIX: ADD hrId to the schema and make it required
  hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, {
  timestamps: true,
});

const JobDescription = (mongoose.models.JobDescription ||
  mongoose.model<IJobDescription>('JobDescription', JobDescriptionSchema)
) as mongoose.Model<IJobDescription>;

export default JobDescription;