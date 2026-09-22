import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { processUploadedFile } from "../utils/fileHandler.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";
import { resolveTargetUserId } from "../utils/userResolver.js";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
    const { name, category, categoryFullName, description, tags, toolUrl, svgUrl } = req.body;
    if (!name) {
        return next(new ErrorHandler("Software Application Name is Required!", 400));
    }

    const userId = req.user?._id || req.user?.id;

    let svgData = {
        public_id: "software_" + Date.now(),
        url: svgUrl || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    };

    if (req.files && req.files.svg) {
        const uploaded = await processUploadedFile(req.files.svg, "software");
        if (uploaded) svgData = uploaded;
    }

    const applicationPayload = {
        userId,
        name,
        category: category || "IDE",
        categoryFullName: categoryFullName || "",
        description: description || "",
        tags: tags || "",
        toolUrl: toolUrl || "",
        svg: svgData,
    };

    if (isDbConnected()) {
        const softwareApplication = await SoftwareApplication.create(applicationPayload);
        return res.status(201).json({
            success: true,
            message: "New Software Application Added!",
            softwareApplication,
        });
    }

    const softwareApplication = DataStore.addSoftware(applicationPayload);

    res.status(201).json({
        success: true,
        message: "New Software Application Added!",
        softwareApplication,
    });
});

export const updateApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, categoryFullName, description, tags, toolUrl, svgUrl } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (category !== undefined) updateFields.category = category;
    if (categoryFullName !== undefined) updateFields.categoryFullName = categoryFullName;
    if (description !== undefined) updateFields.description = description;
    if (tags !== undefined) updateFields.tags = tags;
    if (toolUrl !== undefined) updateFields.toolUrl = toolUrl;

    if (req.files && req.files.svg) {
        const uploaded = await processUploadedFile(req.files.svg, "software");
        if (uploaded) updateFields.svg = uploaded;
    } else if (svgUrl !== undefined && svgUrl.trim() !== "") {
        updateFields.svg = {
            public_id: "software_" + Date.now(),
            url: svgUrl.trim(),
        };
    }

    if (isDbConnected()) {
        const softwareApplication = await SoftwareApplication.findById(id);
        if (!softwareApplication) return next(new ErrorHandler("Application not found", 404));

        Object.assign(softwareApplication, updateFields);
        await softwareApplication.save();

        return res.status(200).json({
            success: true,
            message: "Software Application Updated!",
            softwareApplication,
        });
    }

    const updated = DataStore.updateSoftware(id, updateFields);
    if (!updated) return next(new ErrorHandler("Application not found", 404));

    res.status(200).json({
        success: true,
        message: "Software Application Updated!",
        softwareApplication: updated,
    });
});

export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
    const targetUserId = await resolveTargetUserId(req);

    if (!targetUserId) {
        return res.status(200).json({
            success: true,
            softwareApplications: [],
        });
    }

    if (isDbConnected()) {
        const softwareApplications = await SoftwareApplication.find({ userId: targetUserId });
        return res.status(200).json({
            success: true,
            softwareApplications,
        });
    }

    const softwareApplications = DataStore.getSoftware(targetUserId);
    res.status(200).json({
        success: true,
        softwareApplications,
    });
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (isDbConnected()) {
        const softwareApplication = await SoftwareApplication.findById(id);
        if (!softwareApplication) return next(new ErrorHandler("Application not found", 404));
        await softwareApplication.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Software Application Deleted!",
        });
    }

    const deleted = DataStore.deleteSoftware(id);
    if (!deleted) return next(new ErrorHandler("Application not found", 404));
    res.status(200).json({
        success: true,
        message: "Software Application Deleted!",
    });
});
