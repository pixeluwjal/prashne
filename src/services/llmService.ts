// src/services/llmService.ts

import { GoogleGenAI } from '@google/genai';
import { CohereClient } from 'cohere-ai';
import { ResumeParser } from './resumeParser'; 
import { ParsedResume } from '@/types/resume'; 

// --- Initialize Clients ---
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY }); 

// --- Shared Schema for all Structured Calls ---
const resumeSchema = {
    type: "object",
    properties: {
        fullName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        skills: { type: "array", items: { type: "string" } },
        experience: { 
            type: "array", 
            items: { 
                type: "object", 
                properties: { company: { type: "string" }, role: { type: "string" }, years: { type: "string" } } 
            } 
        },
        education: { 
            type: "array", 
            items: { 
                type: "object", 
                properties: { degree: { type: "string" }, college: { type: "string" }, year: { type: "string" } } 
            } 
        }
    },
    required: ["fullName", "email", "phone", "skills", "experience", "education"]
};

// --- LLM Service Implementation ---

export class LLMService {
    private fallbackParser: ResumeParser; 

    constructor() {
        this.fallbackParser = new ResumeParser();
    }

    // --- API CALL HELPERS ---

    // 💡 PRIORITY 1: OPENAI (via fetch) - Prompt updated for Indian names
    private async callOpenAi(text: string): Promise<ParsedResume> {
        if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing.");

        // 💡 UPDATED PROMPT: Explicitly request focus on name/email/phone handling diverse inputs
        const systemPrompt = `You are a resume parser expert. Your primary goal is to extract the contact information (name, email, phone) and the detailed resume sections (skills, experience, education). The name must be accurately extracted, handling diverse name structures including common Indian names. Output ONLY a single JSON object matching the required schema.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-1106', 
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Extract information from this resume text: ${text.substring(0, 5000)}` }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" } 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Status ${response.status}: ${errorData.error.message}`);
        }

        const data = await response.json();
        const jsonContent = data.choices[0].message.content;
        return JSON.parse(jsonContent) as ParsedResume;
    }
    
    // 💡 PRIORITY 2: GEMINI (via fetch) - Prompt updated for Indian names
    private async callGemini(text: string): Promise<ParsedResume> {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing.");
        
        // 💡 UPDATED PROMPT: Explicitly request focus on name/email/phone handling diverse inputs
        const systemPrompt = `You are an expert resume parser. Extract ALL structured information from the provided resume text into the required JSON schema. The name must be accurately extracted, handling diverse name structures including common Indian names.`;
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GEMINI_API_KEY, 
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nResume Text: ${text.substring(0, 5000)}` }] }],
                generationConfig: { 
                    responseMimeType: "application/json",
                    responseSchema: resumeSchema,
                    temperature: 0.1,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Status ${response.status}: ${errorData.error.message}`);
        }

        const data = await response.json();
        const jsonString = data.candidates[0].content.parts[0].text.trim();
        if (!jsonString) throw new Error("Gemini returned empty response.");
        return JSON.parse(jsonString) as ParsedResume;
    }
    
    // PRIORITY 3: MISTRAL (via fetch) - Unchanged
    private async callMistral(text: string): Promise<ParsedResume> {
        if (!process.env.MISTRAL_API_KEY) throw new Error("MISTRAL_API_KEY missing.");

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-large-latest', 
                messages: [
                    { role: 'system', content: `You are a strict JSON parser. Extract the full resume details into a single JSON object. Schema: ${JSON.stringify(resumeSchema)}` },
                    { role: 'user', content: `Parse this resume text: ${text.substring(0, 5000)}` }
                ],
                response_format: { type: "json_object" }, 
                temperature: 0.1,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Mistral API Status ${response.status}: ${errorData.error.message}`);
        }
        
        const data = await response.json();
        const output = data.choices[0].message.content;

        if (!output) throw new Error("Mistral returned empty content.");
        return JSON.parse(output) as ParsedResume;
    }


    private async callCohere(text: string): Promise<ParsedResume> {
        if (!process.env.COHERE_API_KEY) throw new Error("COHERE_API_KEY missing.");

        const prompt = `Extract ALL resume data (full name, email, phone, skills, experience, and education) from the following text into a valid JSON object matching this schema: ${JSON.stringify(resumeSchema)}. If data is missing, use empty arrays/strings. Resume text:\n\n${text.substring(0, 5000)}`;
        
        const cohereClient = new CohereClient({ token: process.env.COHERE_API_KEY }); 
        const response = await cohereClient.generate({
            model: 'command-r-plus', 
            prompt: prompt,
            maxTokens: 1000,
            temperature: 0.1,
        });

        const output = response.generations[0].text;
        const jsonMatch = output.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error("Cohere failed to return valid JSON.");
        return JSON.parse(jsonMatch[0]) as ParsedResume;
    }

    private async callPerplexity(text: string): Promise<ParsedResume> {
        if (!process.env.PERPLEXITY_API_KEY) throw new Error("PERPLEXITY_API_KEY missing.");

        const systemPrompt = `You are a JSON extractor. Based on the user's resume text, output ONLY a single JSON object adhering strictly to this schema: ${JSON.stringify(resumeSchema)}.`;
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3-8b-instruct', 
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Parse the following resume: ${text.substring(0, 5000)}` }
                ],
                temperature: 0.1,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Perplexity API Status ${response.status}: ${errorData.error.message}`);
        }

        const data = await response.json();
        const output = data.choices[0].message.content;

        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Perplexity failed to return valid JSON.");
        
        return JSON.parse(jsonMatch[0]) as ParsedResume;
    }
    
    // --- Primary Failover Orchestrator (No Hybrid Logic) ---

    async extractWithFailover(text: string): Promise<ParsedResume> {
        if (text.length < 50) {
            throw new Error("Input text too short for LLM processing.");
        }
        
        // Define the priority chain
        const apis = [
            { name: 'OpenAI', call: this.callOpenAi.bind(this) }, 
            { name: 'Gemini', call: this.callGemini.bind(this) }, 
            { name: 'Mistral', call: this.callMistral.bind(this) }, 
            { name: 'Cohere', call: this.callCohere.bind(this) },
            { name: 'Perplexity', call: this.callPerplexity.bind(this) }
        ];

        for (const api of apis) {
            try {
                console.log(`🤖 Attempting extraction with ${api.name} API...`);
                const result = await api.call(text);
                
                // Sanity check: Ensure crucial fields were extracted 
                if (result && result.fullName && result.fullName.toLowerCase() !== 'unknown candidate' && result.fullName.length > 3) {
                    console.log(`✅ ${api.name} successful.`);
                    return result; // Success!
                } else {
                    throw new Error(`AI returned incomplete or default data.`);
                }
            } catch (error) {
                console.error(`❌ ${api.name} extraction failed: ${error.message}`);
            }
        }

        // Final Fallback: Local Regex
        console.warn('⚠️ All remote APIs failed. Falling back to local regex extraction.');
        // NOTE: This relies on ResumeParser.extractWithRegex() which must be robust.
        return this.fallbackParser.extractWithRegex(text);
    }
}