import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: String,
    description: String,
    gitRepoLink: String,
    projectLink: String,
    technology: String,
    stack: String,
    deploy: String,
    projectBanner: {
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

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
