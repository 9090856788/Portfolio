import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Name Required!"],
    },
    category: {
        type: String,
        default: "IDE",
    },
    categoryFullName: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    tags: {
        type: String,
        default: "",
    },
    toolUrl: {
        type: String,
        default: "",
    },
    svg: {
        public_id: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "",
        },
    },
}, { timestamps: true });

export const SoftwareApplication =
    mongoose.models.SoftwareApplication ||
    mongoose.model(
        "SoftwareApplication",
        softwareApplicationSchema
    );
