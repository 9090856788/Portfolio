import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { v2 as cloudinary } from "cloudinary";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";

// post api for adding new software application to the database
export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("Software Application Icon/SVG Required!", 400)
    );
  }
  const { svg } = req.files;
  const { name } = req.body;
  if (!name) {
    return next(ErrorHandler("Software Application Name is Required", 400));
  }

  //POSTING SVG
  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    { folder: "PORTFOLIO_SOFTWARE APPLICATIONS " }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  const softwareApplication = await SoftwareApplication.create({
    name,
    svg: {
      public_id: cloudinaryResponse.public_id,
    },
    url: cloudinaryResponse.secure_url,
  });
  res.status(200).json({
    success: true,
    message: "Software Application Added",
    softwareApplication,
  });
});

// get api for fetAllApplications Icons
export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  const softwareApplication = await SoftwareApplication.find();
  res.status(200).json({
    success: true,
    softwareApplication,
  });
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const softwareApplication = await SoftwareApplication.findById(id);
  if (!softwareApplication) {
    return next(ErrorHandler("Software Application Icon/SVG not found", 400));
  }
  const softwareApplicationSvgId = softwareApplication.svg.public_id;
  await cloudinary.uploader.destroy(softwareApplicationSvgId);
  await softwareApplication.deleteOne();
  res.status(200).json({
    success: true,
    message: "Software Application Deleted",
  });
});
