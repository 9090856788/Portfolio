import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "default_user",
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    targetRole: {
      type: String,
      default: "",
    },
    templateId: {
      type: String,
      default: "modern-clean",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    personalInfo: {
      fullName: { type: String, default: "" },
      professionalTitle: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      website: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    summary: {
      type: String,
      default: "",
    },
    experience: [
      {
        id: String,
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        highlights: [String],
      },
    ],
    education: [
      {
        id: String,
        institution: String,
        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        grade: String,
      },
    ],
    skills: [
      {
        id: String,
        name: String,
        category: String,
        proficiency: Number,
      },
    ],
    projects: [
      {
        id: String,
        title: String,
        role: String,
        link: String,
        techStack: String,
        description: String,
        highlights: [String],
      },
    ],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        issueDate: String,
        link: String,
      },
    ],
    languages: [
      {
        id: String,
        name: String,
        proficiency: String,
      },
    ],
    achievements: [
      {
        id: String,
        title: String,
        description: String,
      },
    ],
    customization: {
      accentColor: { type: String, default: "#4f46e5" },
      fontFamily: { type: String, default: "Plus Jakarta Sans" },
      fontSize: { type: String, default: "medium" },
      spacing: { type: String, default: "comfortable" },
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model("Resume", resumeSchema);
