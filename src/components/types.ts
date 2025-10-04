// src/components/types.ts

// For Resume-related data
export interface Experience {
  role: string;
  company: string;
  years: string;
}

export interface Education {
  degree: string;
  college: string;
  year: string;
}

export interface Resume {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  originalFileUrl: string; // URL to the original PDF/DOCX
  fileSize: number;
  createdAt: string;
}

// For Job Description data
export interface JD {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    skills: string[];
}