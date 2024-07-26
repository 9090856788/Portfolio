import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Project Banner is Required!", 400));
    }
    const { projectBanner } = req.files;
    const {
        title,
        description,
        gitRepoLink,
        projectLink,
        technology,
        stack,
        deploy,
    } = req.body;

    if (
        !title ||
        !description ||
        !gitRepoLink ||
        !projectLink ||
        !technology ||
        !stack ||
        !deploy
    ) {
        return next(
            new ErrorHandler(
                "Project Title, Description, Git Repository Link, Project Link, Technology, Tech Stack, & Deploy Field is Required",
                400
            )
        );
    }

    //POSTING SVG
    const cloudinaryResponse = await cloudinary.uploader.upload(
        projectBanner.tempFilePath,
        { folder: "PORTFOLIO_PROJECT_BANNER" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
            new ErrorHandler("Failed to upload Project Banner to Cloudinary", 500)
        );
    }
    const project = await Project.create({
        title,
        description,
        gitRepoLink,
        projectLink,
        technology,
        stack,
        deploy,
        projectBanner: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "Project Added",
        project,
    });
});

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
    const project = await Project.find();
    res.status(200).json({
        success: true,
        project,
    });
});

export const updateProject = catchAsyncErrors(async (req, res, next) => {
    const newUpdateProjectData = {
        title: req.body.title,
        description: req.body.description,
        gitRepoLink: req.body.gitRepoLink,
        projectLink: req.body.projectLink,
        technology: req.body.technology,
        stack: req.body.stack,
        deploy: req.body.deploy,
    };
    if (req.files && req.files.projectBanner) {
        const projectBanner = req.files.projectBanner;
        const project = await Project.findById(req.project.id);
        const projectImageId = project.projectBanner.public_id;
        await cloudinary.uploader.destroy(projectImageId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            projectBanner.tempFilePath,
            { folder: "PORTFOLIO_PROJECT_BANNER" }
        );
        newUpdateProjectData.projectBanner = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
        newUpdateProjectData.url = cloudinaryResponse.secure_url;
    }
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        newUpdateProjectData,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );
    res.status(200).json({
        success: true,
        message: "Project Updated",
        project,
    });
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
        return next(ErrorHandler("Project Not Found", 400));
    }
    const projectBannerId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectBannerId);
    await project.deleteOne();
    res.status(200).json({
        success: true,
        message: "Project Deleted",
    });
});


export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
});
