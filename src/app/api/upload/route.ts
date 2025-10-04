import { NextRequest, NextResponse } from "next/server";
// 💡 Auth fix: DEFAULT import is required
import getCurrentUser from "@/lib/auth"; 
import { ResumeParser } from "@/services/resumeParser"; // For file parsing (raw text only)
import { LLMService } from "@/services/llmService"; // 💡 NEW: For 5-layer AI failover
import ResumeParsed from "@/models/ResumeParsed";
import dbConnect from "@/lib/dbConnect";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser(); 
    if (!user || !user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // --- Validation and Buffer Creation (UNCHANGED) ---

    console.log(
      "📁 Uploading file:",
      file.name,
      "Type:",
      file.type,
      "Size:",
      file.size
    );

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("🔍 Starting resume parsing...");

    // --- STEP 1: Extract RAW Text using ResumeParser ---
    const parser = new ResumeParser();
    let rawText: string;

    try {
      if (file.type === "application/pdf") {
        console.log("📄 Extracting raw text from PDF...");
        // NOTE: ResumeParser.parsePDF must now return string, not ParsedResume
        rawText = await parser.parsePDF(buffer); 
      } else {
        console.log("📝 Extracting raw text from DOCX...");
        // NOTE: ResumeParser.parseDOCX must now return string, not ParsedResume
        rawText = await parser.parseDOCX(buffer);
      }
      console.log("✅ Raw text extracted successfully.");
    } catch (parseError) {
      console.error("❌ File text extraction failed:", parseError);
      return NextResponse.json(
        { error: `File text extraction failed: ${parseError.message}` },
        { status: 400 }
      );
    }
    
    // --- STEP 2: Use LLMService for Structured Data (with Failover) ---
    const llmService = new LLMService();
    let parsedData;
    
    try {
        console.log("🤖 Starting multi-API structured parsing...");
        // Call the central failover orchestrator
        parsedData = await llmService.extractWithFailover(rawText);
        console.log("✅ Final resume data structured successfully:", parsedData.fullName);
    } catch (llmError) {
         console.error("❌ Final LLM/Regex extraction failed completely:", llmError.message);
         return NextResponse.json(
             { error: `Data structuring failed (5 APIs failed): ${llmError.message}` },
             { status: 500 }
         );
    }

    // --- File Saving (UNCHANGED) ---

    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.log("Uploads directory already exists");
    }

    const fileName = `${randomUUID()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      await writeFile(filePath, buffer);
      console.log("💾 File saved to:", filePath);
    } catch (writeError) {
      console.error("❌ File save failed:", writeError);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    // --- STEP 3: Save to database ---

    const resume = await ResumeParsed.create({
      ...parsedData,
      fileName: file.name,
      fileSize: file.size,
      originalFileUrl: `/api/download/${fileName}`,
      uploadedBy: user._id, 
    });

    console.log("💾 Resume saved to database with ID:", resume._id);

    return NextResponse.json({
      success: true,
      data: {
        id: resume._id,
        ...parsedData,
        originalFileUrl: resume.originalFileUrl,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("💥 Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process resume: " + error.message },
      { status: 500 }
    );
  }
}