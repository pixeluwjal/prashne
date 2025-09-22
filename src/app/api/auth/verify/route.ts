import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeExpires"
    );

    if (!user || !user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Invalid request or user not found." },
        { status: 400 }
      );
    }

    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("❌ Verify Error:", err);
    return NextResponse.json({ error: "Server error during verification." }, { status: 500 });
  }
}
