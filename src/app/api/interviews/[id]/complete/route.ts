import connectDB from '@/lib/db';
import Interview from '@/models/Interview';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const { transcripts } = await req.json();
    
    // Update the interview with the transcripts and mark as completed
    const interview = await Interview.findByIdAndUpdate(
      params.id,
      {
        $set: {
          status: 'completed',
          transcripts,
          completedAt: new Date(),
        }
      },
      { new: true }
    );
    
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Interview completed successfully' 
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    return NextResponse.json(
      { error: 'Failed to complete interview' },
      { status: 500 }
    );
  }
}