import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import axios from "axios";
import sanitizeSVG from "@mattkrick/sanitize-svg";

// sanitaze svg
const sanitizeSvgBuffer = async (svgBuffer) => {
  const rawSvg = svgBuffer.toString("utf-8");
  const sanitizedSvg = sanitizeSVG(rawSvg);
  return Buffer.from(sanitizedSvg, "utf-8");
};

export const uploadToCloudinary = (fileBuffer, folder, mimeType) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fileBuffer) return reject(new Error("File buffer is empty"));

      let resourceType = null;
      if (mimeType.startsWith("image/")) resourceType = "image";
      else if (mimeType.startsWith("video/")) resourceType = "video";

      if (!resourceType)
        return reject(new Error("Only images and videos are allowed"));

      // sanitize svg
      if (mimeType === "image/svg+xml") {
        fileBuffer = await sanitizeSvgBuffer(fileBuffer);
      }

      console.log(
        `Uploading to Cloudinary, folder ${folder}, resourceType ${resourceType}`
      );

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          use_filename: true,
          transformations: [{ quality: "auto" }, { fetch_format: "auto" }], // Add the transformations here
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return reject(`Error uploading to Cloudinary: ${error.message}`);
          }
          resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    } catch (error) {
      console.error("Upload to Cloudinary failed:", error);
      reject(error);
    }
  });
};

export const isValidImageUrl = (url) => {
  return /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|cdn\.example\.com)\//.test(
    url
  );
};

// Download image from URL and upload to Cloudinary
export const downloadAndUploadImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const mimeType = response.headers["content-type"];
    if (!mimeType.startsWith("image/")) {
      throw new Error("invalid image format");
    }
    let buffer = Buffer.from(response.data);

    if (mimeType === "image/svg+xml") {
      buffer = await sanitizeSvgBuffer(buffer);
    }

    return uploadToCloudinary(buffer, "profiles", mimeType);
  } catch (error) {
    console.log("Error downloading image:", error);
    throw new Error("Failed to download and upload image");
  }
};

// Download video from URL and upload to Cloudinary
export const downloadAndUploadVideo = async (videoUrl) => {
  try {
    const response = await axios.get(videoUrl, { responseType: "arraybuffer" });

    const mimeType = response.headers["content-type"];
    if (!mimeType.startsWith("video/")) {
      throw new Error("invalid video format");
    }
    let buffer = Buffer.from(response.data);

    return uploadToCloudinary(buffer, "profiles", mimeType);
  } catch (error) {
    console.log("Error downloading video:", error);
    throw new Error("Failed to download and upload video");
  }
};
