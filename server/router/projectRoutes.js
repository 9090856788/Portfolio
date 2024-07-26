import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
    addNewProject,
    updateProject,
    getAllProjects,
    deleteProject,
    getSingleProject
} from "../controller/projectController.js";

const router = express.Router();

router.post("/add", isAuthenticated, addNewProject);
router.get("/getall", getAllProjects);
router.get("/get/:id", getSingleProject);
router.put("/update/:id", isAuthenticated, updateProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);

export default router;
