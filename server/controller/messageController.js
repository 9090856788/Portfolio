import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Message } from "../models/messageSchema.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, subject, message } = req.body;
    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("Please fill full form!", 400));
    }

    const messageData = {
        senderName,
        subject,
        message,
        createdAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
        const savedMessage = await Message.create(messageData);
        return res.status(201).json({
            success: true,
            message: "Message Sent Successfully!",
            savedMessage,
        });
    }

    const savedMessage = DataStore.addMessage(messageData);
    res.status(201).json({
        success: true,
        message: "Message Sent Successfully!",
        savedMessage,
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    if (isDbConnected()) {
        const messages = await Message.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            messages,
        });
    }

    const messages = DataStore.getMessages();
    res.status(200).json({
        success: true,
        messages,
    });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (isDbConnected()) {
        const message = await Message.findById(id);
        if (!message) {
            return next(new ErrorHandler("Message not found", 404));
        }
        await message.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Message Deleted!",
        });
    }

    const deleted = DataStore.deleteMessage(id);
    if (!deleted) {
        return next(new ErrorHandler("Message not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Message Deleted!",
    });
});
