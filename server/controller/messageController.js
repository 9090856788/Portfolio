import catchSynchError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Message } from "../models/messageSchema.js";

const sendMessage = catchSynchError(async(req, res, next) => {
    const  { senderName, subject, message } = req.body;
    if(!senderName || !subject || !message){
        return next(new ErrorHandler("Please fill the full form", 400))
    }
    const data = await Message.create({
        senderName, subject, message
    });
    res.status(200).json({
        success: true,
        message: "Message Sent",
        data,
    });
});

export default sendMessage;
