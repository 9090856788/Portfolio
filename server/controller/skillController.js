import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Skill } from "../models/skillSchema.js";
import { processUploadedFile } from "../utils/fileHandler.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
    const { title, proficiency, svgUrl } = req.body;
    if (!title || !proficiency) {
        return next(new ErrorHandler("Skill Title and Proficiency are required", 400));
    }

    let svgData = {
        public_id: "default_skill_" + Date.now(),
        url: svgUrl || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    };

    if (req.files && req.files.svg) {
        const uploaded = await processUploadedFile(req.files.svg, "skills");
        if (uploaded) svgData = uploaded;
    }

    if (isDbConnected()) {
        const skill = await Skill.create({
            title,
            proficiency: Number(proficiency),
            svg: svgData,
        });
        return res.status(201).json({
            success: true,
            message: "Skill Added",
            skill,
        });
    }

    const skill = DataStore.addSkill({
        title,
        proficiency: Number(proficiency),
        svg: svgData,
    });

    res.status(201).json({
        success: true,
        message: "Skill Added",
        skill,
    });
});

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
    if (isDbConnected()) {
        const skill = await Skill.find();
        return res.status(200).json({
            success: true,
            skill,
        });
    }

    const skill = DataStore.getSkills();
    res.status(200).json({
        success: true,
        skill,
    });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { proficiency, title, svgUrl } = req.body;

    const updates = {};
    if (proficiency !== undefined) updates.proficiency = Number(proficiency);
    if (title !== undefined) updates.title = title;
    if (svgUrl) updates.svg = { public_id: "svg_" + Date.now(), url: svgUrl };

    if (req.files && req.files.svg) {
        const uploaded = await processUploadedFile(req.files.svg, "skills");
        if (uploaded) updates.svg = uploaded;
    }

    if (isDbConnected()) {
        const skill = await Skill.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        if (!skill) return next(new ErrorHandler("Skill not found", 404));
        return res.status(200).json({
            success: true,
            message: "Skill Updated",
            skill,
        });
    }

    const skill = DataStore.updateSkill(id, updates);
    if (!skill) return next(new ErrorHandler("Skill not found", 404));
    res.status(200).json({
        success: true,
        message: "Skill Updated",
        skill,
    });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (isDbConnected()) {
        const skill = await Skill.findById(id);
        if (!skill) return next(new ErrorHandler("Skill not found", 404));
        await skill.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Skill Deleted",
        });
    }

    const deleted = DataStore.deleteSkill(id);
    if (!deleted) return next(new ErrorHandler("Skill not found", 404));
    res.status(200).json({
        success: true,
        message: "Skill Deleted",
    });
});
