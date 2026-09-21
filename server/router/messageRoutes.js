import express from "express";
import {
    deleteMessage,
    getAllMessages,
    sendMessage,
    replyMessage,
    updateMessageStatus,
} from "../controller/messageController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", getAllMessages);
router.post("/reply/:id", isAuthenticated, replyMessage);
router.put("/status/:id", isAuthenticated, updateMessageStatus);
router.delete("/delete/:id", isAuthenticated, deleteMessage);

export default router;
