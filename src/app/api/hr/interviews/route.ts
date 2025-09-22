import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Get token from cookies
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: no token" }, { status: 401 });
    }

    // 2. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Unauthorized: invalid token" }, { status: 401 });
    }

    const hrId = decoded.userId;
    if (!hrId) {
      return NextResponse.json({ error: "Unauthorized: invalid token payload" }, { status: 401 });
    }

    // 3. Fetch interviews for logged-in HR
    const interviews = await Interview.find({ hrId: new mongoose.Types.ObjectId(hrId) }).sort({ createdAt: -1 });

    return NextResponse.json({ interviews }, { status: 200 });
  } catch (err) {
    console.error("❌ [getInterviews] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
