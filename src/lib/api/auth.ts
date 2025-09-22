export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }

  return res.json();
}

export async function verifyEmail(data: { email: string; code: string }) {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Verification failed");
  }

  return res.json();
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return res.json();
}

export async function logoutUser() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Logout failed");
  }

  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/me");

  if (!res.ok) {
    return null; // not logged in
  }

  return res.json();
}

export function getUserFromToken() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
  } catch {
    return null;
  }
}
export async function getMe() {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}