// app/api/interviews/[id]/feedback/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interview from '@/models/Interview';
import Feedback from '@/models/Feedback';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const { candidateId, transcripts } = await request.json();
    
    console.log('Received feedback request:', { 
      interviewId: params.id, 
      candidateId, 
      transcriptCount: transcripts?.length 
    });

    // Validate incoming data
    if (!candidateId || !transcripts || !Array.isArray(transcripts)) {
      return NextResponse.json({ 
        error: "Missing or invalid candidateId or transcripts" 
      }, { status: 400 });
    }
    
    // Find the interview - try multiple ways to find it
    let interview = await Interview.findOne({ 
      interviewLink: { $regex: params.id, $options: 'i' } 
    });

    if (!interview) {
      // Try finding by _id as fallback
      interview = await Interview.findById(params.id);
    }

    if (!interview) {
      console.error('Interview not found for ID:', params.id);
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }
    
    console.log('Found interview:', interview._id);

    // Update interview with transcripts and mark as completed
    interview.transcripts = transcripts;
    interview.status = 'completed';
    interview.candidateId = candidateId;
    
    // Generate feedback using Gemini
    let feedbackContent = "Feedback generation in progress...";
    try {
      feedbackContent = await generateFeedback(interview);
      console.log('Feedback generated successfully');
    } catch (feedbackError) {
      console.error('Error generating feedback:', feedbackError);
      feedbackContent = `# Interview Feedback\n\n## Status\nFeedback generation failed. Please review manually.\n\n## Transcript\n${transcripts.map(t => `${t.role}: ${t.content}`).join('\n\n')}`;
    }
    
    // Create and save the new Feedback document
    const newFeedback = new Feedback({
      interviewId: interview._id,
      candidateId: candidateId,
      jobTitle: interview.jobTitle,
      feedbackContent: feedbackContent,
    });
    await newFeedback.save();

    // Link the new feedback document back to the interview
    interview.feedbackId = newFeedback._id;
    
    // Save the updated interview document
    await interview.save();
    
    console.log('Interview and feedback saved successfully');
    
    return NextResponse.json({
      success: true,
      feedback: feedbackContent,
      interviewId: interview._id
    });

  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback', details: error.message },
      { status: 500 }
    );
  }
}

async function generateFeedback(interview) {
  try {
    // Use the correct model names - try these in order
    const modelNames = [
      "gemini-2.5-flash"              // Legacy Pro model
    ];

    let lastError = null;
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
            topP: 0.8,
            topK: 40,
          }
        });

        const prompt = `
          Analyze this interview transcript and provide constructive feedback for the candidate.

          JOB DETAILS:
          - Position: ${interview.jobTitle}
          - Job Description: ${interview.jobDescription || 'Not provided'}
          - Difficulty Level: ${interview.difficulty || 'Not specified'}

          INTERVIEW TRANSCRIPT:
          ${interview.transcripts.map((t, index) => 
            `${t.role.toUpperCase()}: ${t.content}`
          ).join('\n\n')}

          Please provide structured feedback with these sections:

          ## 🎯 Overall Assessment
          A brief, high-level summary of the candidate's performance.

          ## ✅ Key Strengths
          - 2-3 specific strengths demonstrated during the interview
          - Reference actual responses from the transcript

          ## 📈 Areas for Improvement  
          - 2-3 actionable areas where the candidate could improve
          - Provide concrete examples and suggestions

          ## 🔍 Detailed Analysis
          - Analyze 2-3 key questions and responses
          - Suggest how answers could have been stronger
          - Reference the job requirements

          ## 💡 Final Recommendations
          - Specific actions for the candidate to improve
          - Overall suitability for the role
          - Next steps for development

          Format the response in clean, professional markdown with clear section headers and bullet points.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.text();

        if (feedback) {
          console.log(`Successfully generated feedback using ${modelName}`);
          return feedback;
        }
      } catch (modelError) {
        lastError = modelError;
        console.log(`Model ${modelName} failed:`, modelError.message);
        // Continue to next model
      }
    }

    // If all models fail, throw the last error
    throw lastError || new Error('All model attempts failed');

  } catch (error) {
    console.error('All Gemini models failed:', error);
    
    // Fallback feedback
    return `# Interview Feedback Report

## 🎯 Overall Assessment
Interview completed successfully. AI feedback generation is temporarily unavailable.

## 📋 Interview Details
- **Position**: ${interview.jobTitle}
- **Difficulty**: ${interview.difficulty || 'Not specified'}
- **Transcript Length**: ${interview.transcripts.length} messages

## 📝 Interview Transcript
${interview.transcripts.map((t, i) => 
  `**${t.role.toUpperCase()}**: ${t.content}`
).join('\n\n')}

## 🔍 Manual Review Required
Please review the transcript above and provide your professional assessment of:
- Technical knowledge and skills demonstrated
- Communication effectiveness
- Problem-solving approach
- Cultural fit and enthusiasm

*Note: AI feedback system is temporarily undergoing maintenance.*`;
  }
}

// GET endpoint to check available models (for debugging)
export async function GET(request, { params }) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    
    // List available models
    const modelList = await genAI.listModels();
    console.log('Available models:', modelList);
    
    return NextResponse.json({
      availableModels: modelList
    });
    
  } catch (error) {
    console.error('Error listing models:', error);
    return NextResponse.json({
      error: 'Failed to list models',
      details: error.message
    }, { status: 500 });
  }
}