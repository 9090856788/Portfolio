import express from "express";
import { addNewApplication, deleteApplication, getAllApplications } from "../controller/softwareApplicationController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/addSoftwareApp", isAuthenticated, addNewApplication);
router.get("/getAllSoftwareApp", getAllApplications);
router.delete("deleteSoftwareApp", isAuthenticated, deleteApplication);

export default router;