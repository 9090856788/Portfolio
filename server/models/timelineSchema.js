import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title Required!"],
    },
    description: {
        type: String,
        required: [true, "Description Required!"],
    },
    timeline: {
        from: {
            type: String || Number,
            required: [true, "Timeline Starting Date is Required"]
        },
        to: {
            type: String || Number,
        },
    },
});

export const Timeline = mongoose.model("Timeline", timelineSchema);
