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
  // Find admin user credentials across admin registry and main profile
  findAdminUser: (email) => {
    const d = loadData();
    const cleanEmail = String(email || "").toLowerCase().trim();
    if (!d.admins || !Array.isArray(d.admins)) {
      d.admins = [
        {
          _id: "admin-master",
          email: "admin@gmail.com",
          password: "admin123",
          fullName: "Admin",
          phone: "",
          role: "",
          location: "",
          aboutMe: "",
          avatar: { public_id: "", url: "" },
          resume: { public_id: "", url: "" },
        },
      ];
      saveData();
    }

    const foundInAdmins = d.admins.find((a) => (a.email || "").toLowerCase() === cleanEmail);
    if (foundInAdmins) return foundInAdmins;

    if (d.user && d.user.email && d.user.email.toLowerCase() === cleanEmail) {
      return {
        _id: d.user._id,
        email: d.user.email,
        password: d.user.password || "admin123",
        fullName: d.user.fullName,
        phone: d.user.phone,
        role: d.user.role,
        avatar: d.user.avatar,
      };
    }

    return null;
  },
  // Register or update an admin in the admin store
  registerAdminUser: (userData) => {
    const d = loadData();
    if (!d.admins || !Array.isArray(d.admins)) {
      d.admins = [
        {
          _id: "admin-master",
          email: "admin@gmail.com",
          password: "admin123",
          fullName: "Admin",
          phone: "",
          role: "",
          location: "",
          aboutMe: "",
          avatar: { public_id: "", url: "" },
          resume: { public_id: "", url: "" },
        },
      ];
    }
    const cleanEmail = String(userData.email || "").toLowerCase().trim();
    const existingIndex = d.admins.findIndex((a) => (a.email || "").toLowerCase() === cleanEmail);
    const newAdmin = {
      _id: existingIndex >= 0 ? d.admins[existingIndex]._id : "admin-" + Date.now(),
      fullName: userData.fullName || "Admin",
      email: cleanEmail,
      phone: userData.phone || "",
      password: userData.password,
      role: userData.role || "",
      location: userData.location || "",
      aboutMe: userData.aboutMe || "",
      avatar: userData.avatar || { public_id: "", url: "" },
      resume: userData.resume || { public_id: "", url: "" },
    };

    if (existingIndex >= 0) {
      d.admins[existingIndex] = { ...d.admins[existingIndex], ...newAdmin };
    } else {
      d.admins.push(newAdmin);
    }

    if (d.user) {
      d.user._id = newAdmin._id;
      d.user.fullName = newAdmin.fullName;
      d.user.email = newAdmin.email;
      d.user.phone = newAdmin.phone;
      d.user.role = newAdmin.role;
      d.user.location = newAdmin.location;
      d.user.aboutMe = newAdmin.aboutMe;
      d.user.password = userData.password;
      if (newAdmin.avatar) d.user.avatar = newAdmin.avatar;
    }

    saveData();
    return newAdmin;
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

  // Resumes
  getResumes: () => {
    const d = loadData();
    if (!d.resumes || d.resumes.length === 0) {
      d.resumes = getDefaultResumes();
      saveData();
    }
    return d.resumes;
  },
  getResumeById: (id) => {
    const d = loadData();
    if (!d.resumes) d.resumes = getDefaultResumes();
    return d.resumes.find((r) => String(r._id) === String(id));
  },
  addResume: (resumeData) => {
    const d = loadData();
    if (!d.resumes) d.resumes = getDefaultResumes();
    const newResume = {
      _id: "res-" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: resumeData.status || "Draft",
      version: 1,
      versionsHistory: [
        {
          version: 1,
          savedAt: new Date().toISOString(),
          title: "Initial Resume",
          note: "Created new resume version",
        },
      ],
      ...resumeData,
    };
    d.resumes.unshift(newResume);
    saveData();
    return newResume;
  },
  updateResume: (id, updates) => {
    const d = loadData();
    if (!d.resumes) d.resumes = getDefaultResumes();
    const index = d.resumes.findIndex((r) => String(r._id) === String(id));
    if (index === -1) return null;
    const current = d.resumes[index];
    const newVersionNum = (current.version || 1) + 1;
    const historyEntry = {
      version: newVersionNum,
      savedAt: new Date().toISOString(),
      title: updates.title || current.title,
      note: updates.versionNote || "Updated resume content",
    };
    const updatedHistory = [historyEntry, ...(current.versionsHistory || [])].slice(0, 15);

    d.resumes[index] = {
      ...current,
      ...updates,
      version: newVersionNum,
      versionsHistory: updatedHistory,
      updatedAt: new Date().toISOString(),
    };
    saveData();
    return d.resumes[index];
  },
  deleteResume: (id) => {
    const d = loadData();
    if (!d.resumes) return false;
    const before = d.resumes.length;
    d.resumes = d.resumes.filter((r) => String(r._id) !== String(id));
    saveData();
    return d.resumes.length < before;
  },
  duplicateResume: (id) => {
    const d = loadData();
    if (!d.resumes) d.resumes = getDefaultResumes();
    const source = d.resumes.find((r) => String(r._id) === String(id));
    if (!source) return null;
    const clone = JSON.parse(JSON.stringify(source));
    clone._id = "res-" + Date.now();
    clone.title = `${source.title} (Copy)`;
    clone.status = "Draft";
    clone.version = 1;
    clone.createdAt = new Date().toISOString();
    clone.updatedAt = new Date().toISOString();
    clone.versionsHistory = [
      {
        version: 1,
        savedAt: new Date().toISOString(),
        title: clone.title,
        note: `Duplicated from ${source.title}`,
      },
    ];
    d.resumes.unshift(clone);
    saveData();
    return clone;
  },
};

function getDefaultResumes() {
  return [
    {
      _id: "res-frontend-default",
      title: "Frontend Developer Resume",
      targetRole: "Senior Frontend Developer",
      status: "Saved",
      templateId: "modern-pro",
      customization: {
        accentColor: "#4f46e5",
        fontFamily: "Plus Jakarta Sans",
        fontSize: "10pt",
        lineSpacing: "1.45",
        marginSize: "16mm",
        showPhoto: true,
      },
      sectionsOrder: [
        "personal",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "achievements",
        "languages",
      ],
      sectionsVisibility: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        achievements: true,
        languages: true,
        interests: false,
        custom: false,
      },
      personalInfo: {
        fullName: "Kanhu Charan Sahoo",
        professionalTitle: "Senior Frontend Developer",
        email: "kanhucharansahoo595@gmail.com",
        phone: "+91 9090856788",
        location: "Bhubaneswar, Odisha",
        website: "https://kanhustudio.dev",
        linkedIn: "https://linkedin.com/in/kanhucharansahoo",
        github: "https://github.com/0908563188",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      },
      summary:
        "Frontend Developer with 5+ years of experience building scalable, high-performance web applications using React.js, JavaScript & Typescript. Expertise in reusable component development, REST API integration, and state management with Redux and TanStack Query. Focused on performance optimization, clean architecture, and delivering production-ready solutions in Agile environments.",
      experience: [
        {
          id: "exp-1",
          role: "Senior Frontend Developer",
          company: "Capgemini Technology Pvt Ltd.",
          location: "Bhubaneswar / Hybrid",
          startDate: "May 2025",
          endDate: "Present",
          isCurrent: true,
          highlights: [
            "Developed scalable and high-performance web applications using React.js for banking and policy management systems.",
            "Built reusable and modular UI components, improving development efficiency and reducing code duplication across policy workflows.",
            "Optimized application performance by minimizing unnecessary re-renders and improving rendering cycles for faster load times.",
            "Implemented robust state management using Redux and React Hooks to manage complex financial and policy-related data flows.",
            "Integrated REST APIs using Axios/Fetch for policy creation, validation, and customer data processing with proper error handling.",
            "Worked on policy lifecycle features including onboarding, verification, approval workflows, and status tracking.",
            "Collaborated with backend teams to ensure secure and consistent handling of sensitive financial and customer data.",
            "Contributed to scalable frontend architecture, ensuring maintainability and compliance with enterprise standards.",
            "Worked in Agile (SCRUM) environment, collaborating with cross-functional teams to deliver high-quality features.",
          ],
        },
        {
          id: "exp-2",
          role: "React Developer",
          company: "Zensar Technology",
          location: "Pune, India",
          startDate: "April 2023",
          endDate: "Dec 2024",
          isCurrent: false,
          highlights: [
            "Developed reusable and modular UI components using React.js, improving code maintainability and reusability.",
            "Built interactive user interfaces using React concepts like JSX, Virtual DOM, and one-way data flow.",
            "Implemented state management using React Hooks and custom hooks for efficient data handling.",
            "Integrated REST APIs using Axios/Fetch and worked extensively with backend services.",
            "Designed responsive UI using HTML5, CSS3, JavaScript, and MUI.",
            "Managed routing using React Router and followed modular programming practices.",
            "Used Git for version control and collaborated with cross-functional teams in Agile environment.",
          ],
        },
        {
          id: "exp-3",
          role: "Frontend Developer",
          company: "KFin Technology",
          location: "Hyderabad, India",
          startDate: "July 2022",
          endDate: "April 2023",
          isCurrent: false,
          highlights: [
            "Developed and redesigned UI for a data analytics platform, improving usability and user experience.",
            "Built reusable and customizable components using React.js and Material UI (Accordion, Filters, Dropdowns, Forms).",
            "Implemented data visualization using FusionCharts and contributed to report-building tools in the admin panel.",
            "Owned and delivered the Exception Management feature, handling end-to-end workflows from error generation to resolution.",
            "Integrated REST APIs using Axios/Fetch and ensured efficient data handling across the application.",
            "Collaborated with cross-functional teams in Agile (SCRUM) environment, participating in sprint planning, code reviews, and KT sessions.",
            "Maintained code quality through unit testing, documentation, and adherence to coding standards.",
          ],
        },
        {
          id: "exp-4",
          role: "Software Engineer",
          company: "Tata Consultancy Services (TCS)",
          location: "Bhubaneswar, India",
          startDate: "Sept 2020",
          endDate: "July 2022",
          isCurrent: false,
          highlights: [
            "Developed and maintained responsive user interfaces using React.js, HTML5, CSS3, and JavaScript.",
            "Built reusable UI components using Material UI, including forms, grids, pagination, and interactive elements.",
            "Integrated RESTful APIs using Axios/Fetch to enable seamless client-server communication.",
            "Translated design wireframes into high-quality, functional UI components.",
            "Developed custom UI features such as date pickers, drag-and-drop components, and dynamic widgets.",
            "Optimized application performance and improved rendering efficiency.",
            "Debugged and resolved issues using browser developer tools and Redux DevTools.",
            "Collaborated with cross-functional teams for requirement gathering, defect fixing, and feature enhancements.",
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          degree: "Master in Computer Application",
          institution: "Suresh Gyan Vihar University",
          location: "Jaipur, India",
          startDate: "June 2020",
          endDate: "August 2022",
          grade: "Final CGPA: 7.2",
          highlights: ["Specialized in Advanced Web Systems, Distributed Computing, and Cloud Architectures"],
        },
        {
          id: "edu-2",
          degree: "Bachelor of Computer Application",
          institution: "Regional College of Management, BBSR",
          location: "Bhubaneswar, India",
          startDate: "April 2017",
          endDate: "August 2020",
          grade: "Final CGPA: 7.5",
          highlights: ["Core foundations in Data Structures, Algorithms, Software Engineering, and Database Management"],
        },
      ],
      skills: [
        { id: "sk-1", name: "ReactJs", category: "Frontend", level: "Expert" },
        { id: "sk-2", name: "React Native", category: "Mobile", level: "Proficient" },
        { id: "sk-3", name: "JavaScript", category: "Languages", level: "Expert" },
        { id: "sk-4", name: "TypeScript", category: "Languages", level: "Proficient" },
        { id: "sk-5", name: "HTML/CSS", category: "Frontend", level: "Expert" },
        { id: "sk-6", name: "MUI", category: "Frontend", level: "Expert" },
        { id: "sk-7", name: "Micro Frontend", category: "Architecture", level: "Proficient" },
        { id: "sk-8", name: "NodeJs", category: "Backend", level: "Proficient" },
        { id: "sk-9", name: "ExpressJs", category: "Backend", level: "Proficient" },
        { id: "sk-10", name: "MongoDB", category: "Database", level: "Proficient" },
        { id: "sk-11", name: "Redux", category: "State Management", level: "Expert" },
        { id: "sk-12", name: "REST API Integration", category: "API", level: "Expert" },
        { id: "sk-13", name: "NPM", category: "Tools", level: "Expert" },
        { id: "sk-14", name: "AWS", category: "Cloud", level: "Proficient" },
        { id: "sk-15", name: "React Router", category: "Frontend", level: "Expert" },
      ],
      projects: [
        {
          id: "proj-1",
          title: "Full-Stack Portfolio & Admin Studio",
          role: "Lead Frontend Engineer",
          techStack: "React.js, Redux, Node.js, Express, MUI",
          link: "https://kanhustudio.dev",
          description: "Architected a developer portfolio and admin management workspace with real-time content synchronization, neumorphic UI, and live editing controls.",
          highlights: [
            "Engineered modular state management with Redux Toolkit and REST API caching.",
            "Created responsive dual-mode neumorphic and glassmorphic design token system.",
          ],
        },
        {
          id: "proj-2",
          title: "Banking & Policy Management Portal",
          role: "Senior Frontend Engineer",
          techStack: "React.js, TypeScript, Redux, Axios",
          link: "",
          description: "High-throughput insurance policy lifecycle and underwriting workspace with complex multi-step validation flows and real-time approval pipelines.",
          highlights: [
            "Optimized state tree to minimize rendering cycles during large data-grid pagination.",
            "Enforced strict TypeScript interfaces across API endpoints.",
          ],
        },
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Meta Certified Frontend Developer",
          issuer: "Meta / Coursera",
          issueDate: "2023",
          link: "https://coursera.org",
        },
        {
          id: "cert-2",
          name: "AWS Certified Cloud Practitioner",
          issuer: "Amazon Web Services",
          issueDate: "2024",
          link: "https://aws.amazon.com",
        },
      ],
      achievements: [
        {
          id: "ach-1",
          title: "Bundle Optimization",
          description: "Reduced initial web application bundle load time by 38% through route-level code splitting and lazy loading of heavy visual assets.",
        },
        {
          id: "ach-2",
          title: "Reusable Design Library",
          description: "Authored and maintained a shared React component UI library adopted by 4 cross-functional development squads at Capgemini.",
        },
      ],
      languages: [
        { id: "lang-1", name: "English", proficiency: "Professional Working Proficiency" },
        { id: "lang-2", name: "Hindi", proficiency: "Fluent" },
        { id: "lang-3", name: "Odia", proficiency: "Native" },
      ],
      interests: ["Micro-frontends", "UI/UX Architecture", "Open Source Contribution", "Performance Optimization"],
      customSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 3,
      versionsHistory: [
        {
          version: 3,
          savedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          title: "Added Projects & Certifications",
          note: "Included banking policy portal and Meta certificate",
        },
        {
          version: 2,
          savedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
          title: "Updated Experience",
          note: "Refined Capgemini and Zensar highlight bullets",
        },
        {
          version: 1,
          savedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
          title: "Initial Resume",
          note: "Imported baseline resume data",
        },
      ],
    },
    {
      _id: "res-react-native",
      title: "React Native Developer Resume",
      targetRole: "Mobile Application Developer (React Native)",
      status: "Draft",
      templateId: "technical-dev",
      customization: {
        accentColor: "#059669",
        fontFamily: "Plus Jakarta Sans",
        fontSize: "10pt",
        lineSpacing: "1.45",
        marginSize: "16mm",
        showPhoto: true,
      },
      sectionsOrder: [
        "personal",
        "summary",
        "skills",
        "experience",
        "projects",
        "education",
      ],
      sectionsVisibility: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: false,
        achievements: false,
        languages: true,
        interests: false,
        custom: false,
      },
      personalInfo: {
        fullName: "Kanhu Charan Sahoo",
        professionalTitle: "React Native & Mobile Engineer",
        email: "kanhucharansahoo595@gmail.com",
        phone: "+91 9090856788",
        location: "Bhubaneswar, Odisha",
        website: "https://kanhustudio.dev",
        linkedIn: "https://linkedin.com/in/kanhucharansahoo",
        github: "https://github.com/0908563188",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      },
      summary:
        "Passionate Mobile Application Developer with deep proficiency in React Native, JavaScript, and TypeScript. Experienced in crafting smooth cross-platform iOS and Android experiences with Redux state management and clean native bridges.",
      experience: [
        {
          id: "exp-1",
          role: "Frontend & Mobile Developer",
          company: "Capgemini Technology Pvt Ltd.",
          location: "Bhubaneswar",
          startDate: "May 2025",
          endDate: "Present",
          isCurrent: true,
          highlights: [
            "Contributed to responsive hybrid mobile workflows using React Native and React.",
            "Implemented offline storage and state synchronization with Redux Toolkit.",
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          degree: "Master in Computer Application",
          institution: "Suresh Gyan Vihar University",
          location: "Jaipur",
          startDate: "2020",
          endDate: "2022",
          grade: "7.2 CGPA",
          highlights: [],
        },
      ],
      skills: [
        { id: "sk-1", name: "React Native", category: "Mobile", level: "Expert" },
        { id: "sk-2", name: "React.js", category: "Frontend", level: "Expert" },
        { id: "sk-3", name: "TypeScript", category: "Languages", level: "Proficient" },
        { id: "sk-4", name: "Redux Toolkit", category: "State", level: "Expert" },
        { id: "sk-5", name: "REST APIs", category: "API", level: "Expert" },
      ],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [
        { id: "lang-1", name: "English", proficiency: "Professional" },
        { id: "lang-2", name: "Hindi", proficiency: "Fluent" },
      ],
      interests: [],
      customSections: [],
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      version: 1,
      versionsHistory: [
        {
          version: 1,
          savedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          title: "Initial Draft",
          note: "Drafted mobile-focused resume version",
        },
      ],
    },
    {
      _id: "res-fullstack",
      title: "Full Stack Developer Resume",
      targetRole: "Full Stack Engineer (MERN Stack)",
      status: "Draft",
      templateId: "minimal-ats",
      customization: {
        accentColor: "#334155",
        fontFamily: "Roboto",
        fontSize: "10pt",
        lineSpacing: "1.45",
        marginSize: "16mm",
        showPhoto: false,
      },
      sectionsOrder: [
        "personal",
        "summary",
        "skills",
        "experience",
        "education",
        "projects",
      ],
      sectionsVisibility: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: false,
        achievements: false,
        languages: true,
        interests: false,
        custom: false,
      },
      personalInfo: {
        fullName: "Kanhu Charan Sahoo",
        professionalTitle: "Full Stack Engineer (MERN)",
        email: "kanhucharansahoo595@gmail.com",
        phone: "+91 9090856788",
        location: "Bhubaneswar, Odisha",
        website: "https://kanhustudio.dev",
        linkedIn: "https://linkedin.com/in/kanhucharansahoo",
        github: "https://github.com/0908563188",
        photoUrl: "",
      },
      summary:
        "Full Stack Developer specializing in the MERN stack (MongoDB, Express, React, Node.js) with 5+ years of software engineering expertise in end-to-end web architectures, micro-services, and enterprise API design.",
      experience: [
        {
          id: "exp-1",
          role: "Senior Full Stack Engineer",
          company: "Capgemini Technology Pvt Ltd.",
          location: "Bhubaneswar",
          startDate: "May 2025",
          endDate: "Present",
          isCurrent: true,
          highlights: [
            "Architected full-stack enterprise portals with Express REST services and React frontend.",
            "Designed secure MongoDB schemas and indexing strategies for high read-write workloads.",
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          degree: "Master in Computer Application",
          institution: "Suresh Gyan Vihar University",
          location: "Jaipur",
          startDate: "2020",
          endDate: "2022",
          grade: "7.2 CGPA",
          highlights: [],
        },
      ],
      skills: [
        { id: "sk-1", name: "React.js", category: "Frontend", level: "Expert" },
        { id: "sk-2", name: "Node.js", category: "Backend", level: "Proficient" },
        { id: "sk-3", name: "Express.js", category: "Backend", level: "Proficient" },
        { id: "sk-4", name: "MongoDB", category: "Database", level: "Proficient" },
        { id: "sk-5", name: "REST APIs", category: "API", level: "Expert" },
      ],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [
        { id: "lang-1", name: "English", proficiency: "Professional" },
      ],
      interests: [],
      customSections: [],
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      version: 1,
      versionsHistory: [
        {
          version: 1,
          savedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
          title: "Initial Full Stack Draft",
          note: "Drafted MERN focused resume",
        },
      ],
    },
  ];
}

