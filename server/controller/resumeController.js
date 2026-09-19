import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { DataStore } from "../data/store.js";

// GET /api/v1/resume/all
export const getAllResumes = catchAsyncErrors(async (req, res) => {
  const resumes = DataStore.getResumes();
  res.status(200).json({
    success: true,
    count: resumes.length,
    resumes,
  });
});

// GET /api/v1/resume/:id
export const getSingleResume = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const resume = DataStore.getResumeById(id);
  if (!resume) {
    return next(new ErrorHandler("Resume version not found", 404));
  }
  res.status(200).json({
    success: true,
    resume,
  });
});

// POST /api/v1/resume/create
export const createResume = catchAsyncErrors(async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next(new ErrorHandler("Resume title is required", 400));
  }

  const newResume = DataStore.addResume(req.body);
  res.status(201).json({
    success: true,
    message: "Resume created successfully",
    resume: newResume,
  });
});

// PUT /api/v1/resume/update/:id
export const updateResume = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updated = DataStore.updateResume(id, req.body);
  if (!updated) {
    return next(new ErrorHandler("Resume not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Resume updated successfully",
    resume: updated,
  });
});

// DELETE /api/v1/resume/delete/:id
export const deleteResume = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const deleted = DataStore.deleteResume(id);
  if (!deleted) {
    return next(new ErrorHandler("Resume not found or could not be deleted", 404));
  }
  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
});

// POST /api/v1/resume/duplicate/:id
export const duplicateResume = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const duplicated = DataStore.duplicateResume(id);
  if (!duplicated) {
    return next(new ErrorHandler("Failed to duplicate resume", 404));
  }
  res.status(201).json({
    success: true,
    message: "Resume duplicated successfully",
    resume: duplicated,
  });
});

// GET /api/v1/resume/latest
export const getLatestResume = catchAsyncErrors(async (req, res, next) => {
  const resumes = DataStore.getResumes();
  const latest = resumes.find((r) => r.status === "Saved") || resumes[0];
  if (!latest) {
    return next(new ErrorHandler("No resume found", 404));
  }
  res.status(200).json({
    success: true,
    resume: latest,
  });
});

// GET /api/v1/resume/download/:id (or id = "latest")
export const downloadResume = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const format = (req.query.format || "txt").toLowerCase(); // "txt" | "json" | "html"

  const resumes = DataStore.getResumes();
  let resume = null;

  if (id === "latest" || !id) {
    resume = resumes.find((r) => r.status === "Saved") || resumes[0];
  } else {
    resume = DataStore.getResumeById(id);
  }

  if (!resume) {
    return next(new ErrorHandler("Resume not found", 404));
  }

  const candidateName = (resume.personalInfo?.fullName || "Kanhu_Charan_Sahoo").replace(/\s+/g, "_");
  const versionTitle = (resume.title || "Resume").replace(/\s+/g, "_");

  if (format === "pdf") {
    const pdfBuffer = buildPdfResume(resume);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${candidateName}_${versionTitle}.pdf"`);
    return res.status(200).send(pdfBuffer);
  }

  if (format === "doc" || format === "docx") {
    const docContent = buildDocResume(resume);
    res.setHeader("Content-Type", "application/msword; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${candidateName}_${versionTitle}.doc"`);
    return res.status(200).send(docContent);
  }

  if (format === "json") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${candidateName}_${versionTitle}.json"`);
    return res.status(200).send(JSON.stringify(resume, null, 2));
  }

  if (format === "html") {
    const htmlContent = buildStandaloneResumeHtml(resume);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    if (req.query.view === "true") {
      res.setHeader("Content-Disposition", `inline; filename="${candidateName}_${versionTitle}.html"`);
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${candidateName}_${versionTitle}.html"`);
    }
    return res.status(200).send(htmlContent);
  }

  // Default: Plain text ATS
  const textContent = buildPlainTextResume(resume);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${candidateName}_${versionTitle}.txt"`);
  return res.status(200).send(textContent);
});

function buildPlainTextResume(resume) {
  const p = resume.personalInfo || {};
  const lines = [];

  lines.push(p.fullName?.toUpperCase() || "KANHU CHARAN SAHOO");
  lines.push(p.professionalTitle || "Senior Frontend Developer");
  lines.push([p.email, p.phone, p.location].filter(Boolean).join(" | "));
  if (p.linkedin || p.linkedIn) lines.push(`LinkedIn: ${p.linkedIn || p.linkedin}`);
  if (p.github) lines.push(`GitHub: ${p.github}`);
  if (p.website) lines.push(`Portfolio: ${p.website}`);
  lines.push("");

  if (resume.summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("----------------------------------------");
    lines.push(resume.summary);
    lines.push("");
  }

  if (resume.experience?.length > 0) {
    lines.push("WORK EXPERIENCE");
    lines.push("----------------------------------------");
    resume.experience.forEach((exp) => {
      lines.push(`${exp.role} — ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})`);
      if (exp.location) lines.push(exp.location);
      (exp.highlights || []).forEach((h) => lines.push(`• ${h}`));
      lines.push("");
    });
  }

  if (resume.education?.length > 0) {
    lines.push("EDUCATION");
    lines.push("----------------------------------------");
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} — ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`);
      if (edu.grade) lines.push(edu.grade);
      (edu.highlights || []).forEach((h) => lines.push(`• ${h}`));
      lines.push("");
    });
  }

  if (resume.skills?.length > 0) {
    lines.push("TECHNICAL SKILLS");
    lines.push("----------------------------------------");
    lines.push(resume.skills.map((s) => s.name).join(", "));
    lines.push("");
  }

  if (resume.projects?.length > 0) {
    lines.push("KEY PROJECTS");
    lines.push("----------------------------------------");
    resume.projects.forEach((proj) => {
      lines.push(`${proj.title} ${proj.role ? `(${proj.role})` : ""}`);
      if (proj.techStack) lines.push(`Tech Stack: ${proj.techStack}`);
      if (proj.link) lines.push(`Link: ${proj.link}`);
      if (proj.description) lines.push(proj.description);
      (proj.highlights || []).forEach((h) => lines.push(`• ${h}`));
      lines.push("");
    });
  }

  if (resume.certifications?.length > 0) {
    lines.push("CERTIFICATIONS");
    lines.push("----------------------------------------");
    resume.certifications.forEach((c) => {
      lines.push(`${c.name} — ${c.issuer} (${c.issueDate || ""})`);
      if (c.link) lines.push(c.link);
    });
    lines.push("");
  }

  if (resume.achievements?.length > 0) {
    lines.push("ACHIEVEMENTS");
    lines.push("----------------------------------------");
    resume.achievements.forEach((a) => {
      lines.push(`• ${a.title}: ${a.description}`);
    });
    lines.push("");
  }

  if (resume.languages?.length > 0) {
    lines.push("LANGUAGES");
    lines.push("----------------------------------------");
    lines.push(resume.languages.map((l) => `${l.name} (${l.proficiency})`).join(", "));
    lines.push("");
  }

  return lines.join("\n");
}

function escapePdf(str) {
  return String(str || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\r\n]/g, " ");
}

function wrapPdfText(text, maxChars = 82) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildPdfResume(resume) {
  const p = resume.personalInfo || {};
  const pages = [];
  let currentOps = [];
  let curY = 780;

  function flushPage() {
    if (currentOps.length > 0) {
      pages.push(currentOps.join("\n"));
      currentOps = [];
      curY = 780;
    }
  }

  function checkY(needed = 22) {
    if (curY - needed < 55) {
      flushPage();
    }
  }

  function addHeader(text) {
    checkY(32);
    curY -= 10;
    currentOps.push("0.31 0.27 0.90 rg"); // Purple accent non-stroking
    currentOps.push(`BT /F2 12 Tf 50 ${curY} Td (${escapePdf(text)}) Tj ET`);
    curY -= 4;
    currentOps.push(`0.31 0.27 0.90 RG 1 w 50 ${curY} m 545 ${curY} l S`);
    curY -= 14;
  }

  // Header Title
  const fullName = p.fullName || "Kanhu Charan Sahoo";
  const professionalTitle = p.professionalTitle || "Senior Frontend Developer";

  currentOps.push("0.1 0.1 0.15 rg");
  currentOps.push(`BT /F2 22 Tf 50 ${curY} Td (${escapePdf(fullName)}) Tj ET`);
  curY -= 20;

  currentOps.push("0.31 0.27 0.90 rg");
  currentOps.push(`BT /F2 12 Tf 50 ${curY} Td (${escapePdf(professionalTitle)}) Tj ET`);
  curY -= 18;

  // Contact line
  const contactParts = [p.email, p.phone, p.location].filter(Boolean);
  if (contactParts.length > 0) {
    currentOps.push("0.3 0.35 0.4 rg");
    currentOps.push(`BT /F1 9 Tf 50 ${curY} Td (${escapePdf(contactParts.join("  |  "))}) Tj ET`);
    curY -= 14;
  }

  const webParts = [p.portfolioURL || p.website, p.linkedIn || p.linkedin, p.github].filter(Boolean);
  if (webParts.length > 0) {
    currentOps.push("0.3 0.35 0.4 rg");
    currentOps.push(`BT /F1 8.5 Tf 50 ${curY} Td (${escapePdf(webParts.join("  |  "))}) Tj ET`);
    curY -= 14;
  }

  // Summary
  if (resume.summary) {
    addHeader("PROFESSIONAL SUMMARY");
    const summaryLines = wrapPdfText(resume.summary, 88);
    currentOps.push("0.2 0.2 0.2 rg");
    summaryLines.forEach((l) => {
      checkY(14);
      currentOps.push(`BT /F1 9.5 Tf 50 ${curY} Td (${escapePdf(l)}) Tj ET`);
      curY -= 13;
    });
  }

  // Experience
  if (resume.experience?.length > 0) {
    addHeader("WORK EXPERIENCE");
    resume.experience.forEach((exp) => {
      checkY(36);
      currentOps.push("0.08 0.08 0.1 rg");
      currentOps.push(`BT /F2 10.5 Tf 50 ${curY} Td (${escapePdf(exp.role)}) Tj ET`);
      currentOps.push("0.4 0.4 0.45 rg");
      const dateText = `${exp.startDate || ""} - ${exp.endDate || "Present"}`;
      currentOps.push(`BT /F1 9 Tf 420 ${curY} Td (${escapePdf(dateText)}) Tj ET`);
      curY -= 14;

      currentOps.push("0.31 0.27 0.90 rg");
      const compText = `${exp.company || ""}${exp.location ? ` - ${exp.location}` : ""}`;
      currentOps.push(`BT /F2 9.5 Tf 50 ${curY} Td (${escapePdf(compText)}) Tj ET`);
      curY -= 14;

      (exp.highlights || []).forEach((h) => {
        const wrapped = wrapPdfText(h, 84);
        wrapped.forEach((wl, idx) => {
          checkY(13);
          currentOps.push("0.2 0.2 0.2 rg");
          const prefix = idx === 0 ? "• " : "   ";
          currentOps.push(`BT /F1 9 Tf 55 ${curY} Td (${escapePdf(prefix + wl)}) Tj ET`);
          curY -= 12;
        });
      });
      curY -= 6;
    });
  }

  // Education
  if (resume.education?.length > 0) {
    addHeader("EDUCATION");
    resume.education.forEach((edu) => {
      checkY(28);
      currentOps.push("0.08 0.08 0.1 rg");
      currentOps.push(`BT /F2 10 Tf 50 ${curY} Td (${escapePdf(edu.degree)}) Tj ET`);
      currentOps.push("0.4 0.4 0.45 rg");
      currentOps.push(`BT /F1 9 Tf 420 ${curY} Td (${escapePdf(`${edu.startDate || ""} - ${edu.endDate || ""}`)}) Tj ET`);
      curY -= 14;

      currentOps.push("0.25 0.3 0.35 rg");
      const instText = `${edu.institution || ""}${edu.location ? ` - ${edu.location}` : ""}${edu.grade ? ` (Grade: ${edu.grade})` : ""}`;
      currentOps.push(`BT /F1 9 Tf 50 ${curY} Td (${escapePdf(instText)}) Tj ET`);
      curY -= 16;
    });
  }

  // Technical Skills
  if (resume.skills?.length > 0) {
    addHeader("TECHNICAL SKILLS");
    const skillNames = resume.skills.map((s) => s.name).join(", ");
    const wrappedSkills = wrapPdfText(skillNames, 88);
    currentOps.push("0.15 0.15 0.2 rg");
    wrappedSkills.forEach((sl) => {
      checkY(14);
      currentOps.push(`BT /F1 9.5 Tf 50 ${curY} Td (${escapePdf(sl)}) Tj ET`);
      curY -= 13;
    });
  }

  // Projects
  if (resume.projects?.length > 0) {
    addHeader("KEY PROJECTS");
    resume.projects.forEach((proj) => {
      checkY(32);
      currentOps.push("0.08 0.08 0.1 rg");
      currentOps.push(`BT /F2 10 Tf 50 ${curY} Td (${escapePdf(proj.title + (proj.role ? ` (${proj.role})` : ""))}) Tj ET`);
      curY -= 14;

      if (proj.techStack) {
        currentOps.push("0.31 0.27 0.90 rg");
        currentOps.push(`BT /F1 8.5 Tf 50 ${curY} Td (${escapePdf("Tech Stack: " + proj.techStack)}) Tj ET`);
        curY -= 12;
      }

      if (proj.description) {
        const pDesc = wrapPdfText(proj.description, 86);
        currentOps.push("0.2 0.2 0.2 rg");
        pDesc.forEach((dl) => {
          checkY(13);
          currentOps.push(`BT /F1 9 Tf 50 ${curY} Td (${escapePdf(dl)}) Tj ET`);
          curY -= 12;
        });
      }

      (proj.highlights || []).forEach((h) => {
        const wrapped = wrapPdfText(h, 84);
        wrapped.forEach((wl, idx) => {
          checkY(13);
          currentOps.push("0.2 0.2 0.2 rg");
          const prefix = idx === 0 ? "• " : "   ";
          currentOps.push(`BT /F1 9 Tf 55 ${curY} Td (${escapePdf(prefix + wl)}) Tj ET`);
          curY -= 12;
        });
      });
      curY -= 6;
    });
  }

  // Certifications & Languages
  if (resume.certifications?.length > 0) {
    addHeader("CERTIFICATIONS");
    resume.certifications.forEach((c) => {
      checkY(16);
      currentOps.push("0.15 0.15 0.2 rg");
      currentOps.push(`BT /F1 9 Tf 50 ${curY} Td (${escapePdf(`• ${c.name} — ${c.issuer} (${c.issueDate || ""})`)}) Tj ET`);
      curY -= 13;
    });
  }

  if (resume.languages?.length > 0) {
    addHeader("LANGUAGES");
    const langStr = resume.languages.map((l) => `${l.name} (${l.proficiency})`).join("  •  ");
    checkY(16);
    currentOps.push("0.15 0.15 0.2 rg");
    currentOps.push(`BT /F1 9 Tf 50 ${curY} Td (${escapePdf(langStr)}) Tj ET`);
    curY -= 13;
  }

  flushPage();
  if (pages.length === 0) {
    pages.push("BT /F2 16 Tf 50 780 Td (Kanhu Charan Sahoo - Resume) Tj ET");
  }

  // Build standard PDF structure
  const objects = [];
  function addObj(c) {
    objects.push(c);
    return objects.length;
  }

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj(""); // Pages placeholder (#2)

  const pageObjNums = [];
  const contentObjNums = [];

  pages.forEach((pOps) => {
    const pStream = pOps + "\n";
    const cNum = addObj(`<< /Length ${Buffer.byteLength(pStream)} >>\nstream\n${pStream}endstream`);
    contentObjNums.push(cNum);
    const pNum = addObj("");
    pageObjNums.push(pNum);
  });

  const f1 = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const f2 = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const kidsStr = pageObjNums.map((n) => `${n} 0 R`).join(" ");
  objects[1] = `<< /Type /Pages /Kids [${kidsStr}] /Count ${pages.length} >>`;

  pageObjNums.forEach((pNum, idx) => {
    objects[pNum - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentObjNums[idx]} 0 R /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> >>`;
  });

  let out = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, idx) => {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const startxref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    out += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

function buildDocResume(resume) {
  const p = resume.personalInfo || {};
  const fullName = p.fullName || "Kanhu Charan Sahoo";
  const professionalTitle = p.professionalTitle || "Senior Frontend Developer";

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${fullName} - Resume</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 21.0cm 29.7cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 4pt 0;
    }
    .title {
      font-size: 13pt;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 8pt;
    }
    .contacts {
      font-size: 9.5pt;
      color: #475569;
      margin-bottom: 12pt;
      border-bottom: 1.5pt solid #4f46e5;
      padding-bottom: 6pt;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #4f46e5;
      text-transform: uppercase;
      margin-top: 14pt;
      margin-bottom: 6pt;
      border-bottom: 1pt solid #cbd5e1;
      padding-bottom: 2pt;
    }
    .job-header {
      font-size: 11pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 8pt;
    }
    .company {
      font-size: 10pt;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 4pt;
    }
    .dates {
      float: right;
      font-weight: normal;
      color: #64748b;
      font-size: 9.5pt;
    }
    ul {
      margin: 4pt 0 8pt 18pt;
      padding: 0;
    }
    li {
      margin-bottom: 3pt;
      font-size: 10pt;
      color: #334155;
    }
    .skills-box {
      font-size: 10pt;
      background: #f8fafc;
      padding: 8pt 10pt;
      border: 1pt solid #e2e8f0;
      color: #1e293b;
      margin-bottom: 8pt;
    }
  </style>
</head>
<body>
  <h1>${fullName}</h1>
  <div class="title">${professionalTitle}</div>
  <div class="contacts">
    ${[p.email, p.phone, p.location, p.portfolioURL || p.website, p.linkedIn || p.linkedin, p.github].filter(Boolean).join(" &nbsp;|&nbsp; ")}
  </div>

  ${resume.summary ? `
  <div class="section-title">Professional Summary</div>
  <p style="font-size: 10.5pt; color: #334155; margin: 4pt 0 10pt 0;">${resume.summary}</p>
  ` : ""}

  ${resume.experience?.length ? `
  <div class="section-title">Work Experience</div>
  ${resume.experience.map(exp => `
    <div class="job-header">
      ${exp.role}
      <span class="dates">${exp.startDate} - ${exp.endDate || "Present"}</span>
    </div>
    <div class="company">${exp.company} ${exp.location ? `• ${exp.location}` : ""}</div>
    ${exp.highlights?.length ? `
      <ul>
        ${exp.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>
    ` : ""}
  `).join("")}
  ` : ""}

  ${resume.education?.length ? `
  <div class="section-title">Education</div>
  ${resume.education.map(edu => `
    <div class="job-header">
      ${edu.degree}
      <span class="dates">${edu.startDate} - ${edu.endDate || ""}</span>
    </div>
    <div class="company">${edu.institution} ${edu.location ? `• ${edu.location}` : ""} ${edu.grade ? `(${edu.grade})` : ""}</div>
  `).join("")}
  ` : ""}

  ${resume.skills?.length ? `
  <div class="section-title">Technical Skills</div>
  <div class="skills-box">
    ${resume.skills.map(s => `<strong>${s.name}</strong>`).join(" &nbsp;•&nbsp; ")}
  </div>
  ` : ""}

  ${resume.projects?.length ? `
  <div class="section-title">Key Projects</div>
  ${resume.projects.map(proj => `
    <div class="job-header">
      ${proj.title} ${proj.role ? `(${proj.role})` : ""}
      ${proj.link ? `<span class="dates"><a href="${proj.link}">View</a></span>` : ""}
    </div>
    ${proj.techStack ? `<div style="font-size: 9.5pt; color: #4f46e5; margin-bottom: 2pt;">Tech Stack: ${proj.techStack}</div>` : ""}
    ${proj.description ? `<p style="font-size: 10pt; margin: 2pt 0 4pt 0; color: #334155;">${proj.description}</p>` : ""}
    ${proj.highlights?.length ? `
      <ul>
        ${proj.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>
    ` : ""}
  `).join("")}
  ` : ""}

  ${resume.certifications?.length ? `
  <div class="section-title">Certifications</div>
  <ul>
    ${resume.certifications.map(c => `<li><strong>${c.name}</strong> — ${c.issuer} (${c.issueDate || ""})</li>`).join("")}
  </ul>
  ` : ""}

  ${resume.languages?.length ? `
  <div class="section-title">Languages</div>
  <p style="font-size: 10pt; color: #334155;">${resume.languages.map(l => `${l.name} (${l.proficiency})`).join(" &nbsp;•&nbsp; ")}</p>
  ` : ""}
</body>
</html>`;
}

function buildStandaloneResumeHtml(resume) {
  const p = resume.personalInfo || {};
  const accent = resume.customization?.accentColor || "#4f46e5";
  const fontFamily = resume.customization?.fontFamily || "Plus Jakarta Sans";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.fullName || "Kanhu Charan Sahoo"} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px 0;
      background: #f1f5f9;
      font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.5;
    }
    .resume-container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: #ffffff;
      padding: 16mm;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      position: relative;
    }
    .print-actions {
      text-align: center;
      margin-bottom: 20px;
    }
    .btn-print {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      background: ${accent};
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
    h1 { margin: 0 0 4px; font-size: 26px; font-weight: 800; color: #0f172a; }
    .title { font-size: 14px; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .contacts { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #475569; margin-bottom: 16px; }
    .contacts a { color: inherit; text-decoration: none; }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: ${accent};
      border-bottom: 2px solid ${accent};
      padding-bottom: 4px;
      margin: 18px 0 10px;
    }
    .job, .edu, .proj { margin-bottom: 14px; }
    .job-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #0f172a; }
    .company { color: ${accent}; font-weight: 600; font-size: 12px; margin-bottom: 4px; }
    ul { margin: 4px 0 0; padding-left: 18px; font-size: 12px; color: #334155; }
    li { margin-bottom: 3px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-chip { background: #f8fafc; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    @media print {
      body { background: #fff; padding: 0; }
      .print-actions { display: none !important; }
      .resume-container { box-shadow: none; margin: 0; width: 210mm; min-height: 297mm; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      Print / Save to PDF
    </button>
  </div>
  <div class="resume-container">
    <h1>${p.fullName || "Kanhu Charan Sahoo"}</h1>
    <div class="title">${p.professionalTitle || "Senior Frontend Developer"}</div>
    <div class="contacts">
      ${p.email ? `<span>✉ ${p.email}</span>` : ""}
      ${p.phone ? `<span>✆ ${p.phone}</span>` : ""}
      ${p.location ? `<span>📍 ${p.location}</span>` : ""}
      ${p.website ? `<span>🌐 <a href="${p.website}">${p.website}</a></span>` : ""}
      ${p.linkedIn || p.linkedin ? `<span>in <a href="${p.linkedIn || p.linkedin}">LinkedIn</a></span>` : ""}
      ${p.github ? `<span>⌥ <a href="${p.github}">GitHub</a></span>` : ""}
    </div>

    ${resume.summary ? `
    <div class="section-title">Professional Summary</div>
    <p style="font-size: 12px; margin: 0; color: #334155; line-height: 1.6; text-align: justify;">${resume.summary}</p>
    ` : ""}

    ${resume.experience?.length ? `
    <div class="section-title">Work Experience</div>
    ${resume.experience.map(exp => `
      <div class="job">
        <div class="job-header">
          <span>${exp.role}</span>
          <span style="color: #64748b; font-weight: 500;">${exp.startDate} - ${exp.endDate || "Present"}</span>
        </div>
        <div class="company">${exp.company} ${exp.location ? `• ${exp.location}` : ""}</div>
        ${exp.highlights?.length ? `
          <ul>
            ${exp.highlights.map(h => `<li>${h}</li>`).join("")}
          </ul>
        ` : ""}
      </div>
    `).join("")}
    ` : ""}

    ${resume.education?.length ? `
    <div class="section-title">Education</div>
    ${resume.education.map(edu => `
      <div class="edu">
        <div class="job-header">
          <span>${edu.degree}</span>
          <span style="color: #64748b; font-weight: 500;">${edu.startDate} - ${edu.endDate}</span>
        </div>
        <div class="company">${edu.institution} ${edu.location ? `• ${edu.location}` : ""} ${edu.grade ? `(${edu.grade})` : ""}</div>
      </div>
    `).join("")}
    ` : ""}

    ${resume.skills?.length ? `
    <div class="section-title">Technical Skills</div>
    <div class="skills-grid">
      ${resume.skills.map(s => `<span class="skill-chip">${s.name}</span>`).join("")}
    </div>
    ` : ""}

    ${resume.projects?.length ? `
    <div class="section-title">Featured Projects</div>
    ${resume.projects.map(proj => `
      <div class="proj">
        <div class="job-header">
          <span>${proj.title} ${proj.role ? `(${proj.role})` : ""}</span>
          ${proj.link ? `<a href="${proj.link}" style="color: ${accent}; font-size: 11px;">View Project</a>` : ""}
        </div>
        ${proj.techStack ? `<div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">Tech: ${proj.techStack}</div>` : ""}
        ${proj.description ? `<p style="font-size: 11.5px; margin: 2px 0 4px; color: #334155;">${proj.description}</p>` : ""}
        ${proj.highlights?.length ? `
          <ul>
            ${proj.highlights.map(h => `<li>${h}</li>`).join("")}
          </ul>
        ` : ""}
      </div>
    `).join("")}
    ` : ""}

    ${resume.certifications?.length ? `
    <div class="section-title">Certifications</div>
    ${resume.certifications.map(c => `
      <div style="font-size: 12px; margin-bottom: 4px; color: #0f172a;">
        <strong>${c.name}</strong> — <span style="color: #64748b;">${c.issuer} (${c.issueDate || ""})</span>
      </div>
    `).join("")}
    ` : ""}

    ${resume.achievements?.length ? `
    <div class="section-title">Key Achievements</div>
    <ul>
      ${resume.achievements.map(a => `<li><strong>${a.title}:</strong> ${a.description}</li>`).join("")}
    </ul>
    ` : ""}

    ${resume.languages?.length ? `
    <div class="section-title">Languages</div>
    <div style="font-size: 12px; color: #334155;">
      ${resume.languages.map(l => `<strong>${l.name}</strong> (${l.proficiency})`).join(" &nbsp;•&nbsp; ")}
    </div>
    ` : ""}
  </div>
</body>
</html>`;
}
