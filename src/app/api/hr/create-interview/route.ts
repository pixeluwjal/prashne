import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview";
import { generateInterviewQuestions } from "@/services/geminiService";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { candidateName, candidateEmail, jobTitle, jobDescription, difficulty, expiresAt } = body;
    if (!candidateName || !candidateEmail || !jobTitle || !jobDescription || !difficulty || !expiresAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ JWT from cookies
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized: no token" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Unauthorized: invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) return NextResponse.json({ error: "Unauthorized: invalid payload" }, { status: 401 });

    // ✅ Generate questions
    const questions = await generateInterviewQuestions({ jobTitle, jobDescription, difficulty });

    // ✅ Get base URL from the request
    const baseUrl = req.nextUrl.origin; // ← THIS is dynamic (http://localhost:3000 in dev, domain in prod)
    const interviewId = uuidv4();
    const interviewLink = `${baseUrl}/interview/${interviewId}`;

    // ✅ Save interview
    const newInterview = await Interview.create({
      hrId: userId,
      candidateName,
      candidateEmail,
      jobTitle,
      jobDescription,
      difficulty,
      expiresAt: new Date(expiresAt),
      interviewLink,
      questions,
      status: "pending",
    });

    return NextResponse.json({ message: "Interview created", interview: newInterview }, { status: 201 });
  } catch (error: any) {
    console.error("❌ [createInterview] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
