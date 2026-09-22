import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: [true, "Sender name is required"],
        trim: true,
    },
    senderEmail: {
        type: String,
        trim: true,
        default: "",
    },
    subject: {
        type: String,
        default: "Portfolio Inquiry",
        trim: true,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    isUnread: {
        type: Boolean,
        default: true,
    },
    isStarred: {
        type: Boolean,
        default: false,
    },
    replied: {
        type: Boolean,
        default: false,
    },
    replies: [
        {
            text: { type: String, required: true },
            sentAt: { type: Date, default: Date.now },
            sentBy: { type: String, default: "Admin" },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
