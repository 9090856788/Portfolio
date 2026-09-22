// Helper for API base URL (works across both root and proxied ports)
const API_BASE = "/api/v1";

function getPortfolioHeaders() {
  const token = localStorage.getItem("portfolio_admin_token");
  const headers = {};
  if (token && token !== "demo_admin_jwt_token_2026") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchUserProfile(username) {
  const url = username
    ? `${API_BASE}/user/portfolio/${encodeURIComponent(username)}`
    : `${API_BASE}/user/profile/portfolio`;
  const res = await fetch(url, {
    headers: getPortfolioHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    // If specific user portfolio not found, fallback to default portfolio
    if (username) {
      const fallbackRes = await fetch(`${API_BASE}/user/profile/portfolio`, {
        headers: getPortfolioHeaders(),
        credentials: "include",
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return fallbackData.user || null;
      }
    }
    return null;
  }
  const data = await res.json();
  return data.user || null;
}

export async function fetchProjects(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/project/getall${query}`, {
    headers: getPortfolioHeaders(),
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.project || [];
}

export async function fetchSkills(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/skill/getall${query}`, {
    headers: getPortfolioHeaders(),
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.skill || [];
}

export async function fetchTimeline(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/timeline/getall${query}`, {
    headers: getPortfolioHeaders(),
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.timelines || [];
}

export async function fetchSoftware(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/software/getall${query}`, {
    headers: getPortfolioHeaders(),
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.softwareApplications || [];
}

export async function sendContactMessage(formData, username) {
  const payload = username ? { ...formData, recipientUsername: username } : formData;
  const res = await fetch(`${API_BASE}/message/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send message");
  return data;
}
