import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview";

// GET /api/hr/interviews/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    // TODO: Replace with actual session-based HR userId
    const userId = "dummy-hr-id";
    const { id: interviewId } = params;

    const interview = await Interview.findOne({ _id: interviewId, hrId: userId });
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("❌ [getInterviewById] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
