import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Timeline } from "../models/timelineSchema.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const postTimeline = catchAsyncErrors(async (req, res, next) => {
    const { title, company, description, from, to } = req.body;
    if (!title || !description) {
        return next(new ErrorHandler("Title and Description are required", 400));
    }

    const timelineObj = {
        title,
        company: company || "",
        description,
        timeline: {
            from: from || "",
            to: to || "",
        },
        period: from && to ? `${from} - ${to}` : (from || to || "Present"),
    };

    if (isDbConnected()) {
        const newTimeline = await Timeline.create(timelineObj);
        return res.status(201).json({
            success: true,
            message: "Timeline Added",
            newTimeline,
        });
    }

    const newTimeline = DataStore.addTimeline(timelineObj);
    res.status(201).json({
        success: true,
        message: "Timeline Added",
        newTimeline,
    });
});

export const getAllTimelines = catchAsyncErrors(async (req, res, next) => {
    if (isDbConnected()) {
        const timelines = await Timeline.find();
        return res.status(200).json({
            success: true,
            timelines,
        });
    }

    const timelines = DataStore.getTimeline();
    res.status(200).json({
        success: true,
        timelines,
    });
});

export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (isDbConnected()) {
        const timeline = await Timeline.findById(id);
        if (!timeline) return next(new ErrorHandler("Timeline not found", 404));
        await timeline.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Timeline Deleted",
        });
    }

    const deleted = DataStore.deleteTimeline(id);
    if (!deleted) return next(new ErrorHandler("Timeline not found", 404));
    res.status(200).json({
        success: true,
        message: "Timeline Deleted",
    });
});
