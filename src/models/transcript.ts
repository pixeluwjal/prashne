import mongoose, { Document, Schema } from 'mongoose';

// Define the type for a single transcript entry
export interface ITranscriptEntry {
  speaker: 'ai' | 'user';
  text: string;
}

// Define the interface for the transcript document
export interface ITranscript extends Document {
  interviewId: string;
  candidateEmail: string;
  transcript: ITranscriptEntry[];
  createdAt: Date;
}

const TranscriptSchema: Schema = new Schema({
  interviewId: { type: String, required: true, unique: true },
  candidateEmail: { type: String, required: true },
  transcript: [{
    speaker: { type: String, required: true },
    text: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

export const Transcript = mongoose.model<ITranscript>('Transcript', TranscriptSchema);