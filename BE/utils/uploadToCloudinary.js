import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import axios from "axios";

export const uploadToCloudinary = (fileBuffer, folder, mimeType) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("file buffer is empty"));
    }
    const resourceType = mimeType.startsWith("image/")
      ? "image"
      : mimeType.startsWith("video/")
      ? "video"
      : null;

    if (!resourceType) {
      return reject(new Error("Only images and videos are allowed"));
    }

    console.log(
      `Uploading to cloudinary, folder: ${folder},resourceType: ${resourceType}`
    );

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload Error:", err);
          reject(new Error(`Cloudinary upload failed: ${err.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const isValidImageUrl = (url) => {
  return /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|cdn\.example\.com)\//.test(
    url
  );
};

export const downloadAndUploadImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const mimeType = response.headers["content-type"];
    if (!mimeType.startsWith("image/")) {
      throw new Error("invalid image format");
    }

    return uploadToCloudinary(Buffer.from(response.data), "profiles", mimeType);
  } catch (error) {
    console.log("Error downloading image:", error);
    throw new Error("Failed to download and upload image");
  }
};
