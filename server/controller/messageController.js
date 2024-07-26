import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Message } from "../models/messageSchema.js";

// send message post api
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, subject, message } = req.body;
    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }
    const data = await Message.create({
        senderName,
        subject,
        message,
    });
    res.status(200).json({
        success: true,
        message: "Message Sent",
        data,
    });
});

// get api for getting all user message from database
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

// delete api for delete the user message record from the database
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return next(new ErrorHandler("Unauthorized - Please login first", 401));
        }

        const message = await Message.findById(req.params.id);
        console.log(`message is : ${message}`);
        if (!message) {
            return next(new ErrorHandler("Message Not Found", 404));
        }

        await message.deleteOne();
        res.status(200).json({
            success: true,
            message: "Message Deleted",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
