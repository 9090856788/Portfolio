import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addNewProject,
  updateProject,
  getAllProjects,
  deleteProject,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/add", isAuthenticated, addNewProject);
router.get("/getall", getAllProjects);
router.put("/update/:id", isAuthenticated, updateProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);

export default router;
