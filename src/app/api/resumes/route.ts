import { NextResponse } from 'next/server';
// 💡 FIX: Import the DEFAULT export (which is the getCurrentUser function)
import getCurrentUser from '@/lib/auth';
import ResumeParsed from '@/models/ResumeParsed';
import dbConnect from '@/lib/dbConnect';

export async function GET(): Promise<NextResponse> {
  try {
    // 💡 The function is now called directly via the default import name
    const user = await getCurrentUser(); 
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // NOTE: The query suggests filtering by the user who uploaded the resume,
    // which is correct for a user-specific list.
    const resumes = await ResumeParsed.find({ uploadedBy: user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({ success: true, data: resumes });
  } catch (error) {
    console.error('Resumes fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}