import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    return true;
  }
  return false;
}

export async function processUploadedFile(file, folder = "portfolio") {
  if (!file) return null;

  const hasCloudinary = getCloudinaryConfig();

  if (hasCloudinary && file.tempFilePath && fs.existsSync(file.tempFilePath)) {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: `PORTFOLIO_${folder.toUpperCase()}`,
        resource_type: "auto",
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
    let fileBuffer = null;
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fileBuffer = fs.readFileSync(file.tempFilePath);
    } else if (file.data) {
      fileBuffer = file.data;
    }

    if (!fileBuffer) {
      console.warn("processUploadedFile: No file buffer available for upload");
      return null;
    }

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

export async function deleteUploadedFile(public_id) {
  if (!public_id || public_id.startsWith("default_") || public_id.startsWith("local_")) {
    return;
  }
  const hasCloudinary = getCloudinaryConfig();
  if (hasCloudinary) {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (err) {
      console.warn("Cloudinary asset deletion warning:", err.message);
    }
  }
}
