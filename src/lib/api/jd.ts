import { IJobDescription } from '@/models/JobDescription';

const API_BASE = '/api';

export const jdApi = {
  // Get all JDs for current HR
  async getJDs(): Promise<IJobDescription[]> {
    const res = await fetch(`${API_BASE}/jd`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch job descriptions');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Get single JD by ID
  async getJD(id: string): Promise<IJobDescription> {
    const res = await fetch(`${API_BASE}/jd/${id}`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch job description');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Create new JD
  async createJD(jdData: Partial<IJobDescription>): Promise<IJobDescription> {
    const res = await fetch(`${API_BASE}/jd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(jdData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create job description');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Update existing JD
  async updateJD(id: string, jdData: Partial<IJobDescription>): Promise<IJobDescription> {
    const res = await fetch(`${API_BASE}/jd/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(jdData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update job description');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Delete JD (archive it)
  async deleteJD(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/jd/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete job description');
    }
  },

  // Search JDs by title or skills
  async searchJDs(query: string): Promise<IJobDescription[]> {
    const res = await fetch(`${API_BASE}/jd?search=${encodeURIComponent(query)}`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error('Failed to search job descriptions');
    }
    
    const data = await res.json();
    return data.data;
  },

  // Get JDs by status
  async getJDsByStatus(status: 'active' | 'archived'): Promise<IJobDescription[]> {
    const res = await fetch(`${API_BASE}/jd?status=${status}`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch job descriptions');
    }
    
    const data = await res.json();
    return data.data;
  }
};