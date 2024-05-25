import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addNewProject,
  updateProject,
  getAllProjects,
  deleteProject,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/addNewProject", isAuthenticated, addNewProject);
router.get("/getAllProject", getAllProjects);
router.put("/updateProject", isAuthenticated, updateProject);
router.delete("/deleteProject", isAuthenticated, deleteProject);

export default router;
