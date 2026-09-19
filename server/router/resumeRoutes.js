import express from "express";
import {
  getAllResumes,
  getSingleResume,
  getLatestResume,
  downloadResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from "../controller/resumeController.js";

const router = express.Router();

router.get("/all", getAllResumes);
router.get("/latest", getLatestResume);
router.get("/download/:id", downloadResume);
router.get("/get/:id", getSingleResume);
router.post("/create", createResume);
router.put("/update/:id", updateResume);
router.delete("/delete/:id", deleteResume);
router.post("/duplicate/:id", duplicateResume);

export default router;
