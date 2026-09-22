import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: [true, "Title Required!"],
    },
    company: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        required: [true, "Description Required!"],
    },
    type: {
        type: String,
        enum: ["work", "education", "experience"],
        default: "work",
    },
    period: {
        type: String,
        default: "",
    },
    tags: {
        type: String,
        default: "",
    },
    timeline: {
        from: {
            type: String,
            default: "",
        },
        to: {
            type: String,
            default: "",
        },
    },
}, { timestamps: true });

export const Timeline = mongoose.models.Timeline || mongoose.model("Timeline", timelineSchema);
