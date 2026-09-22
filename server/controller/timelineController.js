import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Timeline } from "../models/timelineSchema.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";
import { resolveTargetUserId } from "../utils/userResolver.js";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const postTimeline = catchAsyncErrors(async (req, res, next) => {
    const { title, company, description, type, period, tags, from, to } = req.body;
    if (!title || !description) {
        return next(new ErrorHandler("Title and Description are required", 400));
    }

    const userId = req.user?._id || req.user?.id;
    const cleanType = type === "education" ? "education" : "work";

    const timelineObj = {
        userId,
        title,
        company: company || "",
        description,
        type: cleanType,
        period: period || (from && to ? `${from} - ${to}` : (from || to || "Present")),
        tags: tags || "",
        timeline: {
            from: from || "",
            to: to || "",
        },
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

export const updateTimeline = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { title, company, description, type, period, tags, from, to } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type === "education" ? "education" : "work";
    if (period !== undefined) updateData.period = period;
    if (tags !== undefined) updateData.tags = tags;
    if (from !== undefined || to !== undefined) {
        updateData.timeline = {
            from: from || "",
            to: to || "",
        };
    }

    if (isDbConnected()) {
        const updatedTimeline = await Timeline.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedTimeline) {
            return next(new ErrorHandler("Timeline not found", 404));
        }
        return res.status(200).json({
            success: true,
            message: "Timeline Updated",
            timeline: updatedTimeline,
        });
    }

    const updatedTimeline = DataStore.updateTimeline(id, updateData);
    if (!updatedTimeline) {
        return next(new ErrorHandler("Timeline not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Timeline Updated",
        timeline: updatedTimeline,
    });
});

export const getAllTimelines = catchAsyncErrors(async (req, res, next) => {
    const targetUserId = await resolveTargetUserId(req);

    if (!targetUserId) {
        return res.status(200).json({
            success: true,
            timelines: [],
        });
    }

    if (isDbConnected()) {
        const timelines = await Timeline.find({ userId: targetUserId });
        return res.status(200).json({
            success: true,
            timelines,
        });
    }

    const timelines = DataStore.getTimeline(targetUserId);
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
