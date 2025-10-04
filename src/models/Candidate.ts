import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ICandidate extends Document {
  username: string;
  email: string;
}

const CandidateSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'Candidate name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Candidate email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
  },
}, { timestamps: true });

// To handle Next.js hot-reloading in development
const Candidate: Model<ICandidate> = models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;
