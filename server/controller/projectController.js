import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Project } from "../models/projectSchema.js";
import { processUploadedFile } from "../utils/fileHandler.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";
import { resolveTargetUserId } from "../utils/userResolver.js";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
    const {
        title,
        description,
        gitRepoLink,
        projectLink,
        technology,
        stack,
        deploy,
    } = req.body;

    if (!title || !description) {
        return next(
            new ErrorHandler("Project Title and Description are required", 400)
        );
    }

    const userId = req.user?._id || req.user?.id;

    let bannerData = {
        public_id: "default_banner_" + Date.now(),
        url: "/src/img/frontendImage.jpg",
    };

    if (req.files && req.files.projectBanner) {
        const uploaded = await processUploadedFile(req.files.projectBanner, "projects");
        if (uploaded) bannerData = uploaded;
    } else if (req.body.projectBannerUrl) {
        bannerData = {
            public_id: "banner_" + Date.now(),
            url: req.body.projectBannerUrl,
        };
    }

    if (isDbConnected()) {
        const project = await Project.create({
            userId,
            title,
            description,
            gitRepoLink: gitRepoLink || "",
            projectLink: projectLink || "",
            technology: technology || "React, JavaScript",
            stack: stack || "Frontend",
            deploy: deploy || "Live",
            projectBanner: bannerData,
        });
        return res.status(201).json({
            success: true,
            message: "Project Added Successfully",
            project,
        });
    }

    const project = DataStore.addProject({
        userId,
        title,
        description,
        gitRepoLink: gitRepoLink || "https://github.com",
        projectLink: projectLink || "https://example.com",
        technology: technology || "React, JavaScript",
        stack: stack || "Frontend",
        deploy: deploy || "Live",
        projectBanner: bannerData,
    });

    res.status(201).json({
        success: true,
        message: "Project Added Successfully",
        project,
    });
});

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
    const targetUserId = await resolveTargetUserId(req);

    // If no target user resolved (unauthenticated visitor and no username in URL), return empty array
    if (!targetUserId) {
        return res.status(200).json({
            success: true,
            project: [],
        });
    }

    if (isDbConnected()) {
        const project = await Project.find({ userId: targetUserId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            project,
        });
    }

    const project = DataStore.getProjects(targetUserId);
    res.status(200).json({
        success: true,
        project,
    });
});

export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (isDbConnected()) {
        const project = await Project.findById(id);
        if (!project) return next(new ErrorHandler("Project not found", 404));
        return res.status(200).json({
            success: true,
            project,
        });
    }

    const project = DataStore.getProjectById(id);
    if (!project) return next(new ErrorHandler("Project not found", 404));
    res.status(200).json({
        success: true,
        project,
    });
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const newUpdateProjectData = {
        title: req.body.title,
        description: req.body.description,
        gitRepoLink: req.body.gitRepoLink,
        projectLink: req.body.projectLink,
        technology: req.body.technology,
        stack: req.body.stack,
        deploy: req.body.deploy,
    };

    // Remove undefined values
    Object.keys(newUpdateProjectData).forEach(
        (key) => newUpdateProjectData[key] === undefined && delete newUpdateProjectData[key]
    );

    if (req.files && req.files.projectBanner) {
        const uploaded = await processUploadedFile(req.files.projectBanner, "projects");
        if (uploaded) {
            newUpdateProjectData.projectBanner = uploaded;
        }
    } else if (req.body.projectBannerUrl) {
        newUpdateProjectData.projectBanner = {
            public_id: "banner_" + Date.now(),
            url: req.body.projectBannerUrl,
        };
    }

    if (isDbConnected()) {
        const project = await Project.findByIdAndUpdate(id, newUpdateProjectData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        if (!project) return next(new ErrorHandler("Project not found", 404));
        return res.status(200).json({
            success: true,
            message: "Project Updated Successfully",
            project,
        });
    }

    const project = DataStore.updateProject(id, newUpdateProjectData);
    if (!project) return next(new ErrorHandler("Project not found", 404));
    res.status(200).json({
        success: true,
        message: "Project Updated Successfully",
        project,
    });
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (isDbConnected()) {
        const project = await Project.findById(id);
        if (!project) return next(new ErrorHandler("Project not found", 404));
        await project.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Project Deleted Successfully",
        });
    }

    const deleted = DataStore.deleteProject(id);
    if (!deleted) return next(new ErrorHandler("Project not found", 404));
    res.status(200).json({
        success: true,
        message: "Project Deleted Successfully",
    });
});
