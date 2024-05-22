import catchSynchError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateJwtToken } from "../utils/jwtToken.js";

// post api for user registration
export const register = catchSynchError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar & Resume are Required!", 400));
  }

  const { avatar, resume } = req.files;

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

  const user = await User.create({
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
    avatar: {
      public_id: cloudinaryResponseAvatar.public_id,
      url: cloudinaryResponseAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseResume.public_id,
      url: cloudinaryResponseResume.secure_url,
    },
  });

  generateJwtToken(user, "User Registered!", 201, res);
});

// implement Authentication features

export const login = catchSynchError(async (req, res, next) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    next(
      new ErrorHandler("Please Enter Email/Phone number & Password Required!")
    );
  }
  const user = await User.findOne({ email, phone }).select("+password");
  console.log("User & Password is: ", user);
  if (!user) {
    return next(ErrorHandler("Invalid Email/Phone or Password"));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(ErrorHandler("Invalid Email/Phone or Password"));
  }
  generateJwtToken(user, "Logged in", 200, res);
});

// user logged out
export const logout = catchSynchError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out",
    });
});

// get api for user profile
export const myProfile = catchSynchError(async (req, res, next) => {
  const userProfileDetails = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    userProfileDetails,
  });
});

export const updateProfile = catchSynchError(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    instagramURL: req.body.instagramURL,
    facebookURL: req.body.facebookURL,
    twitterURL: req.body.twitterURL,
    linkedInURL: req.body.linkedInURL,
  };

  // if user upload new avatar
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "AVATARS" }
    );
    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // if user upload new resume
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeId = user.resume.public_id;
    await cloudinary.uploader.destroy(resumeId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "RESUME" }
    );
    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile Updated!",
    user,
  });
});

// put api for update password
export const updatePassword = catchSynchError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    next(ErrorHandler("Please fill all field", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await User.comparePassword(currentPassword);
  if (isPasswordMatched) {
    next(ErrorHandler("Incorrect Current Password", 400));
  }
  if (newPassword !== confirmNewPassword) {
    next(ErrorHandler("New Password & Confirm Password do not Matched", 400));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
});

// reset/forgot Password
