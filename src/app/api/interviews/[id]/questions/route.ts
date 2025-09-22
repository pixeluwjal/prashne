import { NextRequest, NextResponse } from 'next/server';
import Interview from '@/models/Interview';
import connectDB from '@/lib/db'; // Assuming this is your DB connection helper

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // ✨ FIX: We only need ONE query.
    // We search for the document where the 'interviewLink' field contains the UUID from the URL.
    // Using a regular expression makes this search robust.
    const interview = await Interview.findOne({ 
      interviewLink: new RegExp(params.id, "i") 
    });
    
    // If no interview is found with that link, return a 404.
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // If found, return the questions and title.
    return NextResponse.json({
      questions: interview.questions,
      interviewTitle: `${interview.jobTitle} Interview`
    });
    
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error.message },
      { status: 500 }
    );
  }
}