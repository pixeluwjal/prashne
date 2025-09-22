import { NextRequest, NextResponse } from 'next/server';
import Interview from '@/models/Interview';
import Feedback from '@/models/Feedback'; // Import the new Feedback model
import connectDB from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { candidateId, transcripts } = await request.json();

    // Validate incoming data
    if (!candidateId || !transcripts || !Array.isArray(transcripts)) {
        return NextResponse.json({ error: "Missing or invalid candidateId or transcripts" }, { status: 400 });
    }
    
    // Find the interview using the UUID in the `interviewLink` field
    const interview = await Interview.findOne({ 
      interviewLink: new RegExp(params.id, "i") 
    });
    
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // 1. Update interview with transcripts and mark as completed
    interview.transcripts = transcripts;
    interview.status = 'completed';
    interview.candidateId = candidateId;
    
    // 2. Generate feedback using Gemini
    const feedbackContent = await generateFeedback(interview);
    
    // 3. Create and save the new Feedback document
    const newFeedback = new Feedback({
      interviewId: interview._id,
      candidateId: interview.candidateId,
      jobTitle: interview.jobTitle,
      feedbackContent: feedbackContent,
    });
    await newFeedback.save();

    // 4. Link the new feedback document back to the interview
    interview.feedbackId = newFeedback._id;
    
    // 5. Save the updated interview document with the new feedback link
    await interview.save();
    
    return NextResponse.json({
      success: true,
      feedback: feedbackContent // Return the generated feedback to the frontend
    });

  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generates feedback for the interview using the Gemini AI model.
 * @param interview The interview document containing the transcript and job details.
 * @returns The generated feedback text as a string.
 */
async function generateFeedback(interview: any): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Analyze this interview transcript and provide constructive feedback for the candidate.

      Job Title: ${interview.jobTitle}
      Job Description: ${interview.jobDescription}
      Difficulty Level: ${interview.difficulty}
      
      Interview Transcript:
      ${interview.transcripts.map((t: any) => `${t.role}: ${t.content}`).join('\n')}
      
      Please provide the following in a structured format with clear headings:
      1. Overall Summary: A brief, high-level assessment of the candidate's performance.
      2. Key Strengths: 2-3 bullet points highlighting what the candidate did well.
      3. Areas for Improvement: 2-3 specific, actionable areas where the candidate could improve.
      4. Detailed Analysis: Go through a few key questions and suggest how the answers could have been stronger.
      5. Final Recommendation: A concluding thought on the candidate's suitability for the next steps.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating feedback with Gemini:', error);
    return "Feedback generation failed. Please review the transcript manually.";
  }
}