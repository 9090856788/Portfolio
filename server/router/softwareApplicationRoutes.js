import express from "express";
import { addNewApplication, updateApplication, deleteApplication, getAllApplications } from "../controller/softwareApplicationController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addNewApplication);
router.put("/update/:id", isAuthenticated, updateApplication);
router.get("/getall", getAllApplications);
router.delete("/delete/:id", isAuthenticated, deleteApplication);

export default router;