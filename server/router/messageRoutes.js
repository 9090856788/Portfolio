import express from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controller/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", getAllMessages);
router.delete("/delete", deleteMessage);

export default router;
