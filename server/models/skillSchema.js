import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: [true, "Title Required!"],
    },
    proficiency: {
        type: Number,
    },
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

export const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);
