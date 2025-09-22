// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing Gemini API Key in environment variables.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

interface GenerateQuestionsParams {
  jobTitle: string;
  jobDescription: string;
  difficulty: string;
  count?: number;
}

export async function generateInterviewQuestions({
  jobTitle,
  jobDescription,
  difficulty,
  count = 10,
}: GenerateQuestionsParams) {
  const prompt = `
    Generate ${count} technical and behavioral interview questions for a '${jobTitle}' role.
    The difficulty level should be '${difficulty}'.
    The ideal candidate has experience with: "${jobDescription}".
    
    IMPORTANT: Respond ONLY with a valid JSON array of objects, where each object has a single key "text" containing the question string.
    Example: [{"text": "What is a closure in JavaScript?"}, {"text": "Describe a time you handled a project deadline."}]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(jsonString);
    
    return questions;
  } catch (error) {
    console.error("Error generating questions from Gemini API:", error);
    throw new Error("Failed to generate interview questions.");
  }
}