import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // --- 1. Authentication (same as before) ---
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- 2. Get data from the form ---
    const body = await req.json();
    const { jobTitle, jobDescription, difficulty, numQuestions } = body;

    if (!jobTitle || !jobDescription || !difficulty || !numQuestions) {
      return NextResponse.json({ error: "Missing required fields for AI generation" }, { status: 400 });
    }

    // --- 3. Securely call the OpenAI API ---
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API Key on the server.");
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The API key is safely used on the server, not exposed to the browser
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // A powerful and cost-effective model
        messages: [
          {
            role: "system",
            content: "You are an expert interview question generator. Your only output should be a valid JSON object."
          },
          {
            role: "user",
            content: `Generate ${numQuestions} interview questions for the role of '${jobTitle}' at a '${difficulty}' difficulty "${jobDescription}". Structure your response as a JSON object with a single key "questions", which contains an array of objects. Each object in the array should have one key, "text".`,
          },
        ],
        response_format: { type: "json_object" }, // Use OpenAI's JSON Mode for reliable output
      }),
    });

    if (!openaiResponse.ok) {
        const errorBody = await openaiResponse.text();
        console.error("OpenAI API Error:", errorBody);
        throw new Error("Failed to get a valid response from OpenAI.");
    }

    const data = await openaiResponse.json();
    
    // --- 4. Parse the response and send it back to the form ---
    const content = JSON.parse(data.choices[0].message.content);
    const questions = content.questions; // Extract the questions array

    return NextResponse.json({ questions });

  } catch (error: any) {
    console.error("❌ [POST /api/hr/generate-questions] Error:", error);
    return NextResponse.json({ error: "Failed to generate questions." }, { status: 500 });
  }
}