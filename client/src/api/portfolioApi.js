// Helper for API base URL (works across both root and proxied ports)
const API_BASE = "/api/v1";

export async function fetchUserProfile(username) {
  const url = username
    ? `${API_BASE}/user/portfolio/${encodeURIComponent(username)}`
    : `${API_BASE}/user/profile/portfolio`;
  const res = await fetch(url);
  if (!res.ok) {
    // If specific user portfolio not found, fallback to default portfolio
    if (username) {
      const fallbackRes = await fetch(`${API_BASE}/user/profile/portfolio`);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return fallbackData.user;
      }
    }
    throw new Error("Failed to fetch user profile");
  }
  const data = await res.json();
  return data.user;
}

export async function fetchProjects(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/project/getall${query}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.project || [];
}

export async function fetchSkills(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/skill/getall${query}`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  const data = await res.json();
  return data.skill || [];
}

export async function fetchTimeline(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/timeline/getall${query}`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  const data = await res.json();
  return data.timelines || [];
}

export async function fetchSoftware(username) {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const res = await fetch(`${API_BASE}/software/getall${query}`);
  if (!res.ok) throw new Error("Failed to fetch software tools");
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
