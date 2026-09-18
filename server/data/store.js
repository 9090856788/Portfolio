import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initialSeedData } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "portfolioData.json");

let memoryData = null;

// Temporary in-memory phone OTP repository with 10-minute expiry
const phoneOtpCache = new Map();

function loadData() {
  if (memoryData) return memoryData;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      memoryData = JSON.parse(raw);
    } else {
      memoryData = JSON.parse(JSON.stringify(initialSeedData));
      saveData();
    }
  } catch (err) {
    console.warn("Could not read portfolioData.json, using seed data:", err.message);
    memoryData = JSON.parse(JSON.stringify(initialSeedData));
  }
  return memoryData;
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save to portfolioData.json:", err.message);
  }
}

export const DataStore = {
  // User / Profile
  getUser: () => {
    const d = loadData();
    return d.user;
  },
  updateUser: (updates) => {
    const d = loadData();
    d.user = {
      ...d.user,
      ...updates,
      avatar: updates.avatar ? updates.avatar : d.user.avatar,
      resume: updates.resume ? updates.resume : d.user.resume,
    };
    saveData();
    return d.user;
  },
  // Update admin credentials (password, email, phone)
  setCredentials: ({ email, phone, passwordHash }) => {
    const d = loadData();
    if (email) d.user.email = email;
    if (phone) d.user.phone = phone;
    if (passwordHash) d.user.password = passwordHash;
    saveData();
    return d.user;
  },

  // Mobile OTP Management
  storePhoneOtp: (phone, otp) => {
    // Standardize phone number format by stripping spaces and hyphens
    const cleanPhone = String(phone).replace(/[\s-]/g, "");
    phoneOtpCache.set(cleanPhone, {
      otp: String(otp),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
      createdAt: Date.now(),
    });
  },
  verifyPhoneOtp: (phone, inputOtp) => {
    const cleanPhone = String(phone).replace(/[\s-]/g, "");
    const record = phoneOtpCache.get(cleanPhone);
    if (!record) return { valid: false, reason: "No OTP requested for this phone number." };
    if (Date.now() > record.expiresAt) {
      phoneOtpCache.delete(cleanPhone);
      return { valid: false, reason: "OTP has expired. Please request a new code." };
    }
    if (record.otp !== String(inputOtp).trim()) {
      return { valid: false, reason: "Incorrect verification code entered." };
    }
    // Remove used OTP
    phoneOtpCache.delete(cleanPhone);
    return { valid: true };
  },

  // Projects
  getProjects: () => {
    const d = loadData();
    return d.projects || [];
  },
  getProjectById: (id) => {
    const d = loadData();
    return d.projects.find((p) => String(p._id) === String(id));
  },
  addProject: (projectData) => {
    const d = loadData();
    const newProj = {
      _id: "proj-" + Date.now(),
      createdAt: new Date().toISOString(),
      ...projectData,
    };
    d.projects.unshift(newProj);
    saveData();
    return newProj;
  },
  updateProject: (id, updates) => {
    const d = loadData();
    const index = d.projects.findIndex((p) => String(p._id) === String(id));
    if (index === -1) return null;
    d.projects[index] = { ...d.projects[index], ...updates };
    saveData();
    return d.projects[index];
  },
  deleteProject: (id) => {
    const d = loadData();
    const before = d.projects.length;
    d.projects = d.projects.filter((p) => String(p._id) !== String(id));
    saveData();
    return d.projects.length < before;
  },

  // Skills
  getSkills: () => {
    const d = loadData();
    return d.skills || [];
  },
  addSkill: (skillData) => {
    const d = loadData();
    const newSkill = {
      _id: "sk-" + Date.now(),
      ...skillData,
    };
    d.skills.push(newSkill);
    saveData();
    return newSkill;
  },
  updateSkill: (id, updates) => {
    const d = loadData();
    const index = d.skills.findIndex((s) => String(s._id) === String(id));
    if (index === -1) return null;
    d.skills[index] = { ...d.skills[index], ...updates };
    saveData();
    return d.skills[index];
  },
  deleteSkill: (id) => {
    const d = loadData();
    const before = d.skills.length;
    d.skills = d.skills.filter((s) => String(s._id) !== String(id));
    saveData();
    return d.skills.length < before;
  },

  // Software Applications
  getSoftware: () => {
    const d = loadData();
    return d.software || [];
  },
  addSoftware: (softData) => {
    const d = loadData();
    const newSoft = {
      _id: "sw-" + Date.now(),
      ...softData,
    };
    d.software.push(newSoft);
    saveData();
    return newSoft;
  },
  deleteSoftware: (id) => {
    const d = loadData();
    const before = d.software.length;
    d.software = d.software.filter((s) => String(s._id) !== String(id));
    saveData();
    return d.software.length < before;
  },

  // Timeline
  getTimeline: () => {
    const d = loadData();
    return d.timeline || [];
  },
  addTimeline: (item) => {
    const d = loadData();
    const newTl = {
      _id: "tl-" + Date.now(),
      ...item,
    };
    d.timeline.unshift(newTl);
    saveData();
    return newTl;
  },
  updateTimeline: (id, updates) => {
    const d = loadData();
    const index = d.timeline.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return null;
    d.timeline[index] = { ...d.timeline[index], ...updates };
    saveData();
    return d.timeline[index];
  },
  deleteTimeline: (id) => {
    const d = loadData();
    const before = d.timeline.length;
    d.timeline = d.timeline.filter((t) => String(t._id) !== String(id));
    saveData();
    return d.timeline.length < before;
  },

  // Messages
  getMessages: () => {
    const d = loadData();
    return d.messages || [];
  },
  addMessage: (msg) => {
    const d = loadData();
    const newMsg = {
      _id: "msg-" + Date.now(),
      createdAt: new Date().toISOString(),
      ...msg,
    };
    d.messages.unshift(newMsg);
    saveData();
    return newMsg;
  },
  deleteMessage: (id) => {
    const d = loadData();
    const before = d.messages.length;
    d.messages = d.messages.filter((m) => String(m._id) !== String(id));
    saveData();
    return d.messages.length < before;
  },
};
