export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    years: string;
  }[];
  education: {
    degree: string;
    college: string;
    year: string;
  }[];
}

export interface ResumeUploadResponse {
  success: boolean;
  data?: ParsedResume & {
    id: string;
    originalFileUrl: string;
    fileName: string;
  };
  error?: string;
}