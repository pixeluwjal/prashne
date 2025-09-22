import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/utils/mailer";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, role } = await req.json();
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    await dbConnect();
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      verificationCode: hashedVerificationCode,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerificationEmail(email, verificationCode);
    return NextResponse.json({
      message: "Registration successful. Verification code sent to your email.",
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return NextResponse.json({ error: "Server error during registration." }, { status: 500 });
  }
}
