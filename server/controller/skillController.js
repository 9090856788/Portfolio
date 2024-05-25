import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Skill } from "../models/skillSchema.js";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Skill Icon/SVG is Required!", 400));
  }
  const { svg } = req.files;
  const { title, proficiency } = req.body;

  if (!title || !proficiency) {
    return next(ErrorHandler("Skill Title & Proficiency is Required", 400));
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
    },
    url: cloudinaryResponse.secure_url,
  });
  res.status(200).json({
    success: true,
    message: "Skill Added",
    skill,
  });
});

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const skill = await Skill.findById();
  res.status(200).json({
    success: true,
    skill,
  });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const newUpdateSkillData = {
    title: req.body.title,
    proficiency: req.body.proficiency,
  };

  if (req.files && req.files.svg) {
    const svg = req.files.svg;
    const skill = await User.findById(req.skill.id);
    const skillImageId = skill.svg.public_id;
    await cloudinary.uploader.destroy(skillImageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      svg.tempFilePath,
      { folder: "PORTFOLIO_SKILL" }
    );
    newUpdateSkillData.svg = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
    newUpdateSkillData.url = cloudinaryResponse.secure_url;
  }

  const skill = await Skill.findByIdAndUpdate(req.skill.id, newUpdateSkillData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Skill Updated",
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
