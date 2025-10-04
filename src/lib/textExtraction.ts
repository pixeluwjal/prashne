import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// PDF Text Extraction from Buffer
export async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  try {
    console.log('Extracting text from PDF buffer...');
    const pdfData = await pdf(buffer);
    
    let extractedText = pdfData.text;
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
    
    console.log(`PDF extraction successful. Extracted ${extractedText.length} characters`);
    
    return extractedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// DOCX Text Extraction from Buffer
export async function extractTextFromDOCXBuffer(buffer: Buffer): Promise<string> {
  try {
    console.log('Extracting text from DOCX buffer...');
    
    const result = await mammoth.extractRawText({ buffer });
    let extractedText = result.value;
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
    
    // Add warnings if any
    if (result.messages.length > 0) {
      console.warn('DOCX extraction warnings:', result.messages);
      extractedText += `\n\n[Extraction Notes: ${result.messages.map(m => m.message).join(', ')}]`;
    }
    
    console.log(`DOCX extraction successful. Extracted ${extractedText.length} characters`);
    
    return extractedText;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(`Failed to extract text from Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main text extraction function from Buffer
export async function extractTextFromBuffer(buffer: Buffer, fileType: string): Promise<string> {
  try {
    console.log('Starting text extraction from buffer for file type:', fileType);
    
    if (fileType === 'application/pdf') {
      return await extractTextFromPDFBuffer(buffer);
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return await extractTextFromDOCXBuffer(buffer);
    } else {
      throw new Error(`Unsupported file type for text extraction: ${fileType}`);
    }
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw error;
  }
}

// Validate extracted text
export function validateExtractedText(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'No text content extracted' };
  }
  
  if (text.trim().length < 10) {
    return { isValid: false, error: 'Extracted text appears to be too short or minimal' };
  }
  
  return { isValid: true };
}