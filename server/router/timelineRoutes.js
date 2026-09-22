import express from "express";
import {
    deleteTimeline,
    getAllTimelines,
    postTimeline,
    updateTimeline,
} from "../controller/timelineController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, postTimeline);
router.get("/getall", getAllTimelines);
router.put("/update/:id", isAuthenticated, updateTimeline);
router.delete("/delete/:id", isAuthenticated, deleteTimeline);

export default router;
