// pages/api/interviews/[id].ts (or similar)
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await dbConnect();

  try {
    const interview = await Interview.findById(id);
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.status(200).json({
      interview,
      questions: interview.questions,
      interviewTitle: interview.jobTitle
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
}