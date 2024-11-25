require("dotenv").config(); // Load environment variables from .env file
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const cloudStorage = multer.memoryStorage(); // Memory storage for Cloudinary
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadMiddleware = (strategy) => {
  const storage = strategy === "local" ? localStorage : cloudStorage;
  return multer({ storage });
};

async function imageUploadUtil(req, file, strategy = "cloud") {
  if (strategy === "cloud") {
    // Cloudinary upload
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return result;
  } else if (strategy === "local") {
    // Return local file path for the uploaded file
    // Generate public URL for the uploaded file
    const publicUrl = `${req.protocol}://${req.get("host")}/assets/${path.basename(file)}`;
    result = {
      format: null,
      url: publicUrl,
    };

    return result;
  } else {
    throw new Error("Invalid strategy. Use 'cloud' or 'local'.");
  }
}

async function downloadUtil(req, source, strategy = "cloud") {
  try {
    // Download the image from the provided source URL
    const response = await axios({
      url: source,
      method: "GET",
      responseType: "stream",
    });

    if (strategy === "cloud") {
      // Create a temporary file to upload to Cloudinary
      const tempPath = path.join(__dirname, "../temp", `${Date.now()}-${path.basename(source)}`);
      const writer = fs.createWriteStream(tempPath);
      response.data.pipe(writer);

      // Wait for the file to be written
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(tempPath, {
        resource_type: "image",
        folder: "product_images", // Optional: Set Cloudinary folder
      });

      // Clean up the temporary file
      fs.unlinkSync(tempPath);

      return result; // Return the Cloudinary result
    } else if (strategy === "local") {
      // Save the file locally
      const uploadPath = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const filePath = path.join(uploadPath, `${Date.now()}-${path.basename(source)}`);
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      // Wait for the write operation to finish
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Generate public URL for the file
      const publicUrl = `${req.protocol}://${req.get("host")}/assets/${path.basename(filePath)}`;
      return { format: null, url: publicUrl }; // Return public URL
    } else {
      throw new Error("Invalid strategy. Use 'cloud' or 'local'.");
    }
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error;
  }
}

module.exports = { uploadMiddleware, imageUploadUtil, downloadUtil };
