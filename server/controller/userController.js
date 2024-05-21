import catchSynchError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const register = catchSynchError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar & Resume are Required!", 400));
  }
  const { avatar, resume } = req.files;

  console.log(avatar, resume);
  //   Avatar configuration from cloudinary
  const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "AVATARS" }
  );

  //   cloudinary error getting if don't getting any response
  if (!cloudinaryResponseAvatar || cloudinaryResponseAvatar.error) {
    console.log(
      "Cloudinary Error: ",
      cloudinaryResponseAvatar.error || "Unknown Cloudinary Error"
    );
  }

  //   Resume configuration from cloudinary
  const cloudinaryResponseResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "RESUME" }
  );

  //   cloudinary error getting if don't getting any response
  if (!cloudinaryResponseResume || cloudinaryResponseResume.error) {
    console.log(
      "Cloudinary Error: ",
      cloudinaryResponseResume.error || "Unknown Cloudinary Error"
    );
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    twitterURL,
    linkedInURL,
  } = req.body;

  const User = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    facebookURL,
    twitterURL,
    linkedInURL,
    avatar:{
        public_id:cloudinaryResponseAvatar.public_id,
        url: cloudinaryResponseAvatar.secure_url,
    },
    resume: {
        public_id:cloudinaryResponseResume.public_id,
        url: cloudinaryResponseResume.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "User Registered ):"
  });
  
});
