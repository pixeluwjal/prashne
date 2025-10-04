// src/services/resumeParser.ts

import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedResume } from '@/types/resume'; 
// NOTE: LLMService is the external consumer of this raw text.

export class ResumeParser {
    
    // --- PDF PARSER: Returns raw text (string) ---
    async parsePDF(buffer: Buffer): Promise<string> {
      try {
        console.log('🔍 Starting PDF parsing...');
        const data = await pdf(buffer);

        const extractedText = data.text.trim();
        const isLikelyBinary = extractedText.startsWith('%PDF-');

        if (isLikelyBinary || extractedText.length < 100) {
          console.error("DEBUG: Failed Content Start:", extractedText.substring(0, 200));
          throw new Error("Failed to extract readable text from PDF. The file may be image-only or corrupt.");
        }

        console.log('📊 PDF text extracted, length:', extractedText.length);
        return extractedText; 
      } catch (error) {
        console.error('❌ PDF parsing failed:', error);
        throw new Error(`PDF processing failed: ${error.message || 'Unknown PDF error'}`);
      }
    }

    // --- DOCX PARSER: Returns raw text (string) ---
    async parseDOCX(buffer: Buffer): Promise<string> {
      try {
        console.log('🔍 Starting DOCX parsing...');
        const result = await mammoth.extractRawText({ buffer });
        console.log('📊 DOCX text extracted, length:', result.value.length);
        return result.value; 
      } catch (error) {
        console.error('❌ DOCX parsing failed:', error);
        throw new Error(`DOCX parsing failed: ${error.message}`);
      }
    }

    // --- REGEX FALLBACK (Simplified, NO custom name/email regex) ---
    // This is the absolute last resort.
    public extractWithRegex(text: string): ParsedResume {
      console.log('🔍 Using regex fallback extraction');
      
        // Simple heuristic fallback (will likely be 'Unknown Candidate' but necessary return type)
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const fullName = lines[0]?.trim().split('\n')[0].replace(/[\,\;\:\•\*\-].*/, '').trim() || 'Unknown Candidate';

      return {
        fullName: fullName,
        email: 'regex@fallback.com', 
        phone: '+0000000000',
        skills: [], 
        experience: [],
        education: []
      };
    }
}