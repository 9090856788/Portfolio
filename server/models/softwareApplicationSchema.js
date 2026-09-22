import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: String,
    svg: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
}, { timestamps: true });

export const SoftwareApplication =
    mongoose.models.SoftwareApplication ||
    mongoose.model(
        "SoftwareApplication",
        softwareApplicationSchema
    );
