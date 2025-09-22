import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface IFeedback extends Document {
  interviewId: mongoose.Schema.Types.ObjectId;
  candidateId: mongoose.Schema.Types.ObjectId;
  jobTitle: string;
  feedbackContent: string;
}

const FeedbackSchema: Schema<IFeedback> = new Schema({
  interviewId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interview', 
    required: true 
  },
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobTitle: { 
    type: String, 
    required: true 
  },
  feedbackContent: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

const Feedback: Model<IFeedback> = models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;