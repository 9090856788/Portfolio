/**
 * Admin API Client
 * Clean HTTP client for admin operations with authentication tokens and error handling.
 */
const API_BASE = "/api/v1";

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem("portfolio_admin_token") || "";
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

// ---------------- Authentication & Credentials ----------------

export async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid credentials");
  return data;
}

export async function adminRegister(credentials) {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create account");
  return data;
}

export async function sendMobileOtp(phone) {
  const res = await fetch(`${API_BASE}/user/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to dispatch verification OTP");
  return data;
}

export async function verifyOtpAndResetPassword(payload) {
  const res = await fetch(`${API_BASE}/user/otp/verify-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Password reset verification failed");
  return data;
}

export async function adminLogout() {
  try {
    await fetch(`${API_BASE}/user/logout`);
  } catch (err) {
    console.warn("Logout request error:", err);
  }
}

// ---------------- Profile & Photo Management ----------------

export async function fetchAdminProfile() {
  const res = await fetch(`${API_BASE}/user/profile/portfolio`);
  if (!res.ok) throw new Error("Failed to load profile");
  const data = await res.json();
  return data.user;
}

export async function updateAdminProfile(payload) {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/user/update/profile`, {
    method: "PUT",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data;
}

// ---------------- Projects ----------------

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/project/getall`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.project || [];
}

export async function addProject(payload) {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/project/add`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add project");
  return data;
}

export async function updateProject(id, payload) {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/project/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update project");
  return data;
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/project/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete project");
  return data;
}

// ---------------- Skills ----------------

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/skill/getall`);
  if (!res.ok) throw new Error("Failed to fetch skills");
  const data = await res.json();
  return data.skill || [];
}

export async function addSkill(payload) {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/skill/add`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add skill");
  return data;
}

export async function updateSkill(id, proficiency) {
  const res = await fetch(`${API_BASE}/skill/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ proficiency }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update skill");
  return data;
}

export async function deleteSkill(id) {
  const res = await fetch(`${API_BASE}/skill/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete skill");
  return data;
}

// ---------------- Timeline ----------------

export async function fetchTimeline() {
  const res = await fetch(`${API_BASE}/timeline/getall`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  const data = await res.json();
  return data.timelines || [];
}

export async function addTimeline(payload) {
  const res = await fetch(`${API_BASE}/timeline/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add timeline item");
  return data;
}

export async function deleteTimeline(id) {
  const res = await fetch(`${API_BASE}/timeline/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete timeline item");
  return data;
}

// ---------------- Software ----------------

export async function fetchSoftware() {
  const res = await fetch(`${API_BASE}/software/getall`);
  if (!res.ok) throw new Error("Failed to fetch software applications");
  const data = await res.json();
  return data.softwareApplications || [];
}

export async function addSoftware(payload) {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/software/add`, {
    method: "POST",
    headers: getAuthHeaders(isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add application");
  return data;
}

export async function deleteSoftware(id) {
  const res = await fetch(`${API_BASE}/software/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete application");
  return data;
}

// ---------------- Messages ----------------

export async function fetchMessages() {
  const res = await fetch(`${API_BASE}/message/getall`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  const data = await res.json();
  return data.messages || [];
}

export async function deleteMessage(id) {
  const res = await fetch(`${API_BASE}/message/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete message");
  return data;
}
