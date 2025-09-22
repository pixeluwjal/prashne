// src/app/api/hr/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // ✅ Extract token from cookies
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: missing token" }, { status: 401 });
    }

    // ✅ Verify & decode JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: invalid token" }, { status: 401 });
    }

    const hrId = decoded.userId; // 👈 this comes from your `login` controller payload
    if (!hrId) {
      return NextResponse.json({ error: "Unauthorized: invalid payload" }, { status: 401 });
    }

    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 12);

    // --- Fetch counts ---
    const [totalInterviews, pendingInterviews, completedInterviews] = await Promise.all([
      Interview.countDocuments({ hrId: new mongoose.Types.ObjectId(hrId) }),
      Interview.countDocuments({ hrId: new mongoose.Types.ObjectId(hrId), status: "pending" }),
      Interview.countDocuments({ hrId: new mongoose.Types.ObjectId(hrId), status: "completed" }),
    ]);

    // --- Aggregate monthly trends ---
    const monthlyTrendData = await Interview.aggregate([
      {
        $match: {
          hrId: new mongoose.Types.ObjectId(hrId),
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = monthlyTrendData.map((item) => ({
      month: `${monthNames[item._id.month - 1]} '${String(item._id.year).slice(2)}`,
      total: item.total,
      completed: item.completed,
    }));

    return NextResponse.json({
      totalInterviews,
      pendingInterviews,
      completedInterviews,
      monthlyTrend: formattedTrend,
    });
  } catch (error) {
    console.error("❌ [Analytics] Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
