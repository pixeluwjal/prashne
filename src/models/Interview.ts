import mongoose, { Document, Schema, models, Model } from 'mongoose';

// Interface for a single transcript entry
interface ITranscript {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Interface for the main Interview document
export interface IInterview extends Document {
  hrId: string;
  candidateName: string;
  candidateEmail: string;
  candidateId?: mongoose.Schema.Types.ObjectId;
  jobTitle: string;
  jobDescription: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'pending' | 'completed' | 'expired';
  interviewLink: string;
  expiresAt: Date;
  questions: {
    text: string;
    answer?: string; // The HR's model/ideal answer (optional)
  }[];
  transcripts?: ITranscript[];
  feedbackId?: mongoose.Schema.Types.ObjectId;
}

// Schema for embedded transcript documents
const TranscriptSchema: Schema<ITranscript> = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
});

// Main schema for the Interview collection
const InterviewSchema: Schema<IInterview> = new Schema({
  hrId: { type: String, required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true }, // Kept as required
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
  interviewLink: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  questions: [{
    text: { type: String, required: true },
    answer: { type: String } // Storing the HR's model answer here (optional)
  }],
  transcripts: [TranscriptSchema],
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
}, { timestamps: true });

const Interview: Model<IInterview> = models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);

export default Interview;