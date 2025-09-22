// src/lib/api/hr.ts

// ✅ Helper function to handle responses
const handleResponse = async (response: Response) => {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `HTTP error! status: ${response.status}`);
  }
  return result;
};

// ✅ Data structure for creating an interview
interface CreateInterviewData {
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  expiresAt: Date;
  questionBank: string;
  duration: string;
  notes: string;
}

// ✅ Create interview
export const createInterview = (data: CreateInterviewData) => {
  return fetch(`/api/hr/create-interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // 🔥 send session cookies
  }).then(handleResponse);
};

// ✅ Get analytics
export const getAnalytics = () => {
  return fetch(`/api/hr/analytics`, {
    method: "GET",
    credentials: "include",
  }).then(handleResponse);
};

// ✅ Get interviews
export const getInterviews = () => {
  return fetch(`/api/hr/interviews`, {
    method: "GET",
    credentials: "include",
  }).then(handleResponse);
};
