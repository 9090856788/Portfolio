import express from "express";
import {
  addNewSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "../controller/skillController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/addNewSkill", isAuthenticated, addNewSkill);
router.get("/addNewSkill", getAllSkills);
router.put("/addNewSkill", isAuthenticated, updateSkill);
router.delete("/addNewSkill", isAuthenticated, deleteSkill);

export default router;
