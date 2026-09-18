// Helper for API base URL (works across both root and proxied ports)
const API_BASE = "/api/v1";

export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE}/user/profile/portfolio`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  const data = await res.json();
  return data.user;
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/project/getall`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.project || [];
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/skill/getall`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  const data = await res.json();
  return data.skill || [];
}

export async function fetchTimeline() {
  const res = await fetch(`${API_BASE}/timeline/getall`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  const data = await res.json();
  return data.timelines || [];
}

export async function fetchSoftware() {
  const res = await fetch(`${API_BASE}/software/getall`);
  if (!res.ok) throw new Error("Failed to fetch software tools");
  const data = await res.json();
  return data.softwareApplications || [];
}

export async function sendContactMessage(formData) {
  const res = await fetch(`${API_BASE}/message/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send message");
  return data;
}
