import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

export async function processUploadedFile(file, folder = "portfolio") {
  if (!file) return null;

  // Check if Cloudinary is fully configured
  const hasCloudinary =
    Boolean(process.env.CLOUDINARY_NAME) &&
    Boolean(process.env.CLOUDINARY_API_KEY) &&
    Boolean(process.env.CLOUDINARY_API_SECRET);

  if (hasCloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: `PORTFOLIO_${folder.toUpperCase()}`,
      });
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (err) {
      console.warn("Cloudinary upload failed, falling back to data URI:", err.message);
    }
  }

  // Fallback: convert to base64 Data URI
  try {
    const fileBuffer = fs.readFileSync(file.tempFilePath);
    const mimeType = file.mimetype || "image/jpeg";
    const base64Data = fileBuffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64Data}`;
    return {
      public_id: "local_" + Date.now(),
      url: dataUri,
    };
  } catch (err) {
    console.error("Error reading file buffer:", err);
    return null;
  }
}
