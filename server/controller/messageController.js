import catchSynchError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Message } from "../models/messageSchema.js";

// send message post api
export const sendMessage = catchSynchError(async (req, res, next) => {
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
export const getAllMessages = catchSynchError(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});

// delete api for delete the user message record from the database
export const deleteMessage = catchSynchError(async (req, res, next) => {
  const { id } = req.param;
  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Already Deleted!", 400));
  }
  await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message Deleted",
  });
});
