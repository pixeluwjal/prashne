import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import JobDescription, { IJobDescription } from '@/models/JobDescription';
import ResumeParsed, { IResume } from '@/models/ResumeParsed';
import getCurrentUser from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import nlp from 'compromise'; // Used for basic NLP keyword extraction

// Initialize Gemini Client
const geminiAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- AI Output Schema for Match Analysis (Highly Detailed) ---
const matchSchema = {
    type: "object",
    properties: {
        matchScore: { type: "number", description: "Overall match score (0-100) based on skills, experience, and context." },
        overallSummary: { type: "string", description: "A concise, one-paragraph summary of the candidate's fit." },
        strengths: { type: "array", items: { type: "string", description: "Top 3 key strengths aligned with the JD." } },
        weaknesses: { type: "array", items: { type: "string", description: "Top 3 key weaknesses or skill gaps." } }
    },
    required: ["matchScore", "overallSummary", "strengths", "weaknesses"]
};


// -----------------------------------------------------------------
// NLP Helper: Extracts clean, relevant nouns/phrases for comparison
// -----------------------------------------------------------------

function extractKeywords(text: string): string[] {
    // Use compromise to find nouns, verbs, and adjectives and filter noisy words
    const doc = nlp(text.toLowerCase());
    
    // Extract multi-word terms (Noun-Noun, Adjective-Noun) and single nouns
    let terms = doc.match('#Noun+').out('array');
    
    // Basic cleaning and filtering
    const stopWords = ['experience', 'requirements', 'qualifications', 'responsibilities', 'role', 'company', 'work'];
    terms = terms.filter(term => term.length > 2 && !stopWords.includes(term));

    return Array.from(new Set(terms));
}


// -----------------------------------------------------------------
// CORE API Route Handler (POST: Bulk Match)
// -----------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();
        
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { jdId, candidateIds } = await request.json();

        if (!jdId || !candidateIds || candidateIds.length === 0) {
            return NextResponse.json({ error: 'Missing jdId or candidateIds' }, { status: 400 });
        }

        // 1. Fetch the Job Description
        const jd: IJobDescription | null = await JobDescription.findById(jdId);
        if (!jd) {
            return NextResponse.json({ error: 'Job Description not found' }, { status: 404 });
        }
        
        // 2. Fetch all Resumes based on IDs
        const resumes: IResume[] = await ResumeParsed.find({ _id: { $in: candidateIds } });

        if (resumes.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // 3. Perform Bulk Matching
        const matchPromises = resumes.map(resume => runMatchAnalysis(jd, resume));
        const matchResults = await Promise.all(matchPromises);

        return NextResponse.json({ success: true, data: matchResults }, { status: 200 });

    } catch (error) {
        console.error('API Error (POST /resumes/match):', error);
        return NextResponse.json({ error: 'Internal Server Error during matching' }, { status: 500 });
    }
}

// -----------------------------------------------------------------
// AI Analysis Helper
// -----------------------------------------------------------------

async function runMatchAnalysis(jd: IJobDescription, resume: IResume): Promise<IMatchResult> {
    // Concatenate all resume text data for a comprehensive AI prompt
    const resumeText = `Name: ${resume.fullName}\nEmail: ${resume.email}\nSkills: ${resume.skills.join(', ')}\n\nExperience:\n${JSON.stringify(resume.experience)}\n\nEducation:\n${JSON.stringify(resume.education)}`;

    const prompt = `
        Job Title: ${jd.title}
        Company: ${jd.company || 'N/A'}
        Job Description: ${jd.description}
        Required Skills: ${jd.skills.join(', ')}

        Candidate Resume Details:
        ${resumeText.substring(0, 5000)}

        Your task is to analyze the candidate's resume against the Job Description and return a single JSON object.
    `;

    try {
        const response = await geminiAi.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: matchSchema as any,
                temperature: 0.2, // Keep temperature low for deterministic scoring
            }
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString);

        // Map the structured AI output to the expected IMatchResult interface
        return {
            candidateId: resume._id.toString(),
            matchScore: parsedResult.matchScore || 0,
            overallSummary: parsedResult.overallSummary || "Analysis successful, but summary missing.",
            strengths: parsedResult.strengths || [],
            weaknesses: parsedResult.weaknesses || [],
        };

    } catch (error) {
        console.error(`AI Scoring Failed for ${resume.fullName}:`, error);
        
        // --- Fallback to Basic NLP Keyword Overlap Scoring ---
        const jdKeywords = extractKeywords(jd.description + ' ' + jd.skills.join(' '));
        const resumeKeywords = extractKeywords(resumeText);

        const intersection = resumeKeywords.filter(word => jdKeywords.includes(word));
        const score = Math.round((intersection.length / jdKeywords.length) * 100 * 0.7); // Max 70% for NLP fallback

        return {
            candidateId: resume._id.toString(),
            matchScore: Math.min(score + 10, 80), // Ensure a base score > 0
            overallSummary: "AI failed. Score based on keyword overlap (NLP fallback).",
            strengths: ["Keyword overlap detected"],
            weaknesses: ["Full AI context missing"],
        };
    }
}