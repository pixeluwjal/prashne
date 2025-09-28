// src/lib/api/hr.ts

// ✅ A single, robust helper function for all API calls
async function apiHelper(url: string, method: 'GET' | 'POST', payload?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Automatically include cookies for all requests
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `An unknown error occurred on ${method} ${url}`);
  }

  return data;
}


// ✅ The CORRECT createInterview function for the form we built
export async function createInterview(payload: any) {
  return apiHelper('/api/hr/create-interview', 'POST', payload);
}

// ✅ The CORRECT generateAIQuestions function for the form we built
export async function generateAIQuestions(payload: {
  jobTitle: string;
  jobDescription: string;
  difficulty: string;
  numQuestions: number;
}) {
  return apiHelper('/api/hr/generate-questions', 'POST', payload);
}

// ✅ Your other API functions, updated to use the new helper
export async function getAnalytics() {
  return apiHelper('/api/hr/analytics', 'GET');
}

export async function getInterviews() {
  return apiHelper('/api/hr/interviews', 'GET');
}