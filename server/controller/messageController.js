import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Message } from "../models/messageSchema.js";
import { DataStore } from "../data/store.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, senderEmail, email, subject, message } = req.body;
    if (!senderName || !message) {
        return next(new ErrorHandler("Please provide both name and message!", 400));
    }

    const contactEmail = senderEmail || email || "";
    const msgSubject = subject || `Inquiry from ${senderName}`;

    const messageData = {
        senderName,
        senderEmail: contactEmail,
        subject: msgSubject,
        message,
        isUnread: true,
        isStarred: false,
        replied: false,
        replies: [],
        createdAt: new Date(),
    };

    let savedMessage = null;

    if (isDbConnected()) {
        try {
            savedMessage = await Message.create(messageData);
        } catch (dbErr) {
            console.warn("MongoDB message creation notice, writing to DataStore:", dbErr.message);
        }
    }

    if (!savedMessage) {
        savedMessage = DataStore.addMessage(messageData);
    } else {
        // Keep DataStore in sync for instant cache
        DataStore.addMessage(savedMessage.toObject ? savedMessage.toObject() : savedMessage);
    }

    // Optional: send notification email to admin/owner if SMTP is configured
    const adminNotificationEmail = process.env.SMTP_MAIL || process.env.SMTP_USER || process.env.EMAIL_USER;
    if (adminNotificationEmail) {
        sendEmail({
            email: adminNotificationEmail,
            subject: `New Portfolio Message: ${msgSubject}`,
            message: `You received a new inquiry on your portfolio!\n\nFrom: ${senderName} (${contactEmail || "No email provided"})\nSubject: ${msgSubject}\n\nMessage:\n${message}\n\nLog into your admin dashboard to reply.`,
        }).catch((err) => {
            console.warn("Could not dispatch admin inquiry notification email:", err.message);
        });
    }

    res.status(201).json({
        success: true,
        message: "Message Sent Successfully!",
        savedMessage,
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    if (isDbConnected()) {
        try {
            const messages = await Message.find().sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                messages,
            });
        } catch (dbErr) {
            console.warn("MongoDB message fetch notice, using DataStore:", dbErr.message);
        }
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
        try {
            const message = await Message.findById(id);
            if (message) {
                await message.deleteOne();
                DataStore.deleteMessage(id);
                return res.status(200).json({
                    success: true,
                    message: "Message Deleted!",
                });
            }
        } catch (dbErr) {
            console.warn("MongoDB delete message notice:", dbErr.message);
        }
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

export const replyMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { replyText, subject } = req.body;

    if (!replyText || !replyText.trim()) {
        return next(new ErrorHandler("Reply text cannot be empty", 400));
    }

    let targetMessage = null;

    if (isDbConnected()) {
        try {
            targetMessage = await Message.findById(id);
        } catch (err) {
            console.warn("MongoDB find error:", err.message);
        }
    }

    if (!targetMessage) {
        const allMsgs = DataStore.getMessages();
        targetMessage = allMsgs.find((m) => (m._id || m.id) === id);
    }

    if (!targetMessage) {
        return next(new ErrorHandler("Message not found", 404));
    }

    const recipientEmail = targetMessage.senderEmail;
    const replySubject = subject || `Re: ${targetMessage.subject || "Your Portfolio Inquiry"}`;
    const sentBy = req.user?.fullName || "Portfolio Owner";

    let emailDispatched = false;
    let emailNotice = "";

    // Send email via configured SMTP
    if (recipientEmail) {
        try {
            await sendEmail({
                email: recipientEmail,
                subject: replySubject,
                message: `${replyText}\n\n---\nOriginal Message from ${targetMessage.senderName}:\n${targetMessage.message}`,
            });
            emailDispatched = true;
        } catch (mailErr) {
            console.warn("SMTP reply email failed:", mailErr.message);
            emailNotice = `Note: SMTP dispatch returned '${mailErr.message}'. Saved reply locally in thread.`;
        }
    } else {
        emailNotice = "No sender email was attached to this inquiry. Reply saved to conversation thread.";
    }

    const newReply = {
        text: replyText.trim(),
        sentAt: new Date(),
        sentBy,
    };

    if (isDbConnected() && targetMessage.save) {
        targetMessage.replied = true;
        targetMessage.isUnread = false;
        if (!targetMessage.replies) targetMessage.replies = [];
        targetMessage.replies.push(newReply);
        await targetMessage.save();
    }

    // Update in DataStore
    DataStore.updateMessage(id, {
        replied: true,
        isUnread: false,
        reply: newReply,
    });

    res.status(200).json({
        success: true,
        message: emailDispatched
            ? "Reply sent successfully via email!"
            : emailNotice || "Reply saved successfully!",
        reply: newReply,
        emailDispatched,
    });
});

export const updateMessageStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { isUnread, isStarred, replied } = req.body;

    const updates = {};
    if (typeof isUnread === "boolean") updates.isUnread = isUnread;
    if (typeof isStarred === "boolean") updates.isStarred = isStarred;
    if (typeof replied === "boolean") updates.replied = replied;

    if (isDbConnected()) {
        try {
            const updated = await Message.findByIdAndUpdate(id, updates, { new: true });
            if (updated) {
                DataStore.updateMessage(id, updates);
                return res.status(200).json({
                    success: true,
                    message: "Status updated",
                    messageDoc: updated,
                });
            }
        } catch (err) {
            console.warn("MongoDB update status error:", err.message);
        }
    }

    const updated = DataStore.updateMessage(id, updates);
    res.status(200).json({
        success: true,
        message: "Status updated",
        messageDoc: updated,
    });
});
