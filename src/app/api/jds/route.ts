import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import JobDescription, { IJobDescription } from '@/models/JobDescription'; 
import getCurrentUser from '@/lib/auth'; 

// --- GET: Fetch all JDs for the current HR only ---
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get current HR user
    const currentUser = await getCurrentUser(); 
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized: User not found or session expired.' 
      }, { status: 401 });
    }
    const hrId = currentUser._id;

    // Fetch only JDs created by this HR
    const jds: IJobDescription[] = await JobDescription.find({ hrId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: jds }, { status: 200 });

  } catch (error) {
    console.error('API Error (GET JDs):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job descriptions.' },
      { status: 500 }
    );
  }
}

// --- POST: Create a new JD (Manual or AI Generated) ---
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Authenticate and retrieve the required hrId
    const currentUser = await getCurrentUser(); 
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized: User not found or session expired.' 
      }, { status: 401 });
    }
    const hrId = currentUser._id;

    const body = await request.json();
    let jdData = body;
    
    // Check for the AI generation prompt
    if (body.generateWithAi && process.env.GEMINI_API_KEY) {
      console.log(`🤖 Generating JD using AI for prompt: ${body.aiPrompt}`);
      jdData = await generateJDFromAI(body.aiPrompt);
    }

    // Construct the final data payload, including the required hrId
    const finalData = { ...jdData, hrId };

    // Input validation (basic check for required fields *after* AI generation/manual input)
    if (!finalData.title || !finalData.description) {
      return NextResponse.json(
        { success: false, error: 'Job Title and Description are required.' },
        { status: 400 }
      );
    }

    // Use finalData, which now includes the hrId field
    const newJD = await JobDescription.create(finalData);

    return NextResponse.json({ 
        success: true, 
        data: newJD 
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Error (POST JD):', error);
    
    const errorMessage = error.message.includes('validation failed') 
        ? `Validation Failed: ${Object.keys(error.errors).map(key => error.errors[key].path).join(', ')} missing.` 
        : 'Failed to create job description.';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// --- AI GENERATION HELPER ---
async function generateJDFromAI(prompt: string): Promise<any> {
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const geminiAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

        const jdSchema = {
            type: "object",
            properties: {
                title: { type: "string", description: "The professional job title." },
                company: { type: "string", description: "A plausible company name if not specified." },
                location: { type: "string", description: "A plausible location (e.g., Remote, San Francisco)." },
                description: { type: "string", description: "The detailed job description, including responsibilities and requirements, formatted with paragraphs." },
                skills: {
                    type: "array",
                    items: { type: "string", description: "Key technical and soft skills required for the role." }
                }
            },
            required: ["title", "description", "skills"]
        };

        const systemInstruction = `You are an expert HR assistant. Generate a highly detailed and attractive Job Description based on the user's brief prompt. Return the output ONLY as a single JSON object adhering strictly to the provided schema. Ensure the description is rich with responsibilities, requirements, and benefits.`;
        
        const aiPrompt = `${systemInstruction}\n\nUser Prompt: ${prompt}`;

        const response = await geminiAi.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: aiPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jdSchema as any,
                temperature: 0.7,
            }
        });

        const jsonString = response.text.trim();
        if (!jsonString) {
            throw new Error("AI returned an empty response.");
        }

        const parsedJson = JSON.parse(jsonString);
        
        // Ensure skills field is an array
        if (typeof parsedJson.skills === 'string') {
             parsedJson.skills = parsedJson.skills
                 .split(',')
                 .map((s: string) => s.trim())
                 .filter((s: string) => s.length > 0);
        }

        return parsedJson;

    } catch (error: any) {
        console.error('Gemini AI Generation Error:', error);
        throw new Error(`AI generation failed: ${error.message || 'Check API key/quota.'}`);
    }
}