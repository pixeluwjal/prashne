import mongoose, { Document, Schema, models, Model } from 'mongoose';

// A simpler interface for basic CRUD operations
export interface IResume extends Document {
  candidateId: mongoose.Schema.Types.ObjectId;
  fileName: string;
  fileId: mongoose.Schema.Types.ObjectId; // For future file storage link
  fileSize: number;
  parsedText: string; // We'll keep this as a placeholder for now
}

const ResumeSchema: Schema<IResume> = new Schema({
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true, 
    unique: true 
  },
  fileName: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileSize: { type: Number, required: true },
  parsedText: { type: String, default: 'File uploaded but not yet parsed.' }, 
}, { 
  timestamps: true 
});

const Resume: Model<IResume> = models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;

