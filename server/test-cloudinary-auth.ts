import { cloudinary } from "./config/cloudinary.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("server/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    console.log("Config is:", cloudinary.config());
    
    console.log("Pinging Cloudinary via uploader...");
    // Attempting a simple search or ping
    const result = await cloudinary.api.ping();
    console.log("Ping successful! Result:", result);
  } catch (err: any) {
    console.error("Cloudinary ping/auth failed:");
    console.error(err);
  }
}

run();
