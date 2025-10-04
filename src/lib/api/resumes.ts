import { IResume } from '@/models/Resume';

const API_BASE = '/api';

export const resumeApi = {
  // Candidate: Upload their own resume
  async uploadResume(file: File): Promise<IResume> {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to upload resume');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Get current user's resume
  async getMyResume(): Promise<IResume | null> {
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch resume');
    }
    
    const data = await res.json();
    return data.data;
  },

  // HR: Upload resume for candidate
  async uploadResumeForCandidate(file: File, candidateEmail: string, candidateName: string): Promise<any> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('candidateEmail', candidateEmail);
    formData.append('candidateName', candidateName);

    const res = await fetch(`${API_BASE}/resumes/hr-upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to upload resume');
    }
    
    return await res.json();
  },

  // HR: Get all resumes
  async getAllResumes(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/resumes`, {
      credentials: 'include',
    });
    
    if (!res.ok) throw new Error('Failed to fetch resumes');
    const data = await res.json();
    return data.data;
  },

  // Match resume with JD
  async matchResume(jdId: string, candidateId?: string): Promise<any> {
    const params = new URLSearchParams({ jdId });
    if (candidateId) params.append('candidateId', candidateId);

    const res = await fetch(`${API_BASE}/resumes/match?${params}`, {
      credentials: 'include',
    });
    
    if (!res.ok) throw new Error('Failed to analyze match');
    const data = await res.json();
    return data.data;
  },

  // Bulk match multiple candidates
  async bulkMatch(jdId: string, candidateIds: string[]): Promise<any> {
    const res = await fetch(`${API_BASE}/resumes/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ jdId, candidateIds }),
    });
    
    if (!res.ok) throw new Error('Failed to perform bulk matching');
    const data = await res.json();
    return data.data;
  },

  // Get match history for a candidate
  async getMatchHistory(candidateId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/resumes/match/history?candidateId=${candidateId}`, {
      credentials: 'include',
    });
    
    if (!res.ok) throw new Error('Failed to fetch match history');
    const data = await res.json();
    return data.data;
  }
};