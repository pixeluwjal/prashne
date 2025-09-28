import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      candidateName,
      candidateEmail,
      jobTitle,
      jobDescription,
      difficulty,
      expiresAt,
      questions
    } = body;

    if (!candidateName || !candidateEmail || !jobTitle || !jobDescription || !difficulty || !expiresAt || !questions || !questions.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    const baseUrl = req.nextUrl.origin;
    const interviewId = uuidv4();
    const interviewLink = `${baseUrl}/interview/${interviewId}`;

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

    return NextResponse.json({ message: "Interview created successfully", interview: newInterview }, { status: 201 });
  } catch (error: any) {
    console.error("❌ [POST /api/hr/create-interview] Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}