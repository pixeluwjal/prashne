import { NextRequest, NextResponse } from 'next/server';
import Interview from '@/models/Interview';
import User from '@/models/User';
import Feedback from '@/models/Feedback';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get HR user ID from your custom auth token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Find all completed interviews for this HR user and populate necessary details
    const interviews = await Interview.find({ 
      hrId: decoded.userId,
      status: 'completed' 
    })
    .populate({
      path: 'candidateId', // Get candidate's name from User model
      select: 'name',
      model: User
    })
    .populate({
      path: 'feedbackId', // Get feedback content from Feedback model
      select: 'feedbackContent',
      model: Feedback
    })
    .sort({ updatedAt: -1 });

    return NextResponse.json(interviews);

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}