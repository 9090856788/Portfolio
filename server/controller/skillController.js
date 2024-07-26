import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Skill } from "../models/skillSchema.js";
import { v2 as cloudinary } from "cloudinary";

// post api for add skill
export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Skill Icon/SVG is Required!", 400));
    }
    const { svg } = req.files;
    const { title, proficiency } = req.body;

    if (!title || !proficiency) {
        return next(new ErrorHandler("Skill Title & Proficiency is Required", 400));
    }

    //POSTING SVG
    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: "PORTFOLIO_SKILL" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
            new ErrorHandler("Failed to upload SVG/Icon to Cloudinary", 500)
        );
    }

    const skill = await Skill.create({
        title,
        proficiency,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "Skill Added",
        skill,
    });
});

// get api for gettAll Skills
export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
    const skill = await Skill.find();
    res.status(200).json({
        success: true,
        skill,
    });
});

// put api for update skill
export const updateSkill = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let skill = await Skill.findById(id);
    if (!skill) {
        return next(new ErrorHandler("Skill not found!", 404));
    }
    const { title, proficiency } = req.body;
    skill = await Skill.findByIdAndUpdate(
        id,
        { title, proficiency },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );
    res.status(200).json({
        success: true,
        message: "Skill Updated!",
        skill,
    });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) {
        return next(ErrorHandler("Skill Icon/SVG not found", 400));
    }
    const skillSvgId = skill.svg.public_id;
    await cloudinary.uploader.destroy(skillSvgId);
    await skill.deleteOne();
    res.status(200).json({
        success: true,
        message: "Skill Deleted",
    });
});
