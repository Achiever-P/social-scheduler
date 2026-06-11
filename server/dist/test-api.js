import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";
import path from "path";
import fs from "fs";
import FormData from "form-data";
dotenv.config({ path: path.resolve("server/.env") });
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: '30d' });
};
async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log("Connecting to Mongo...");
        await mongoose.connect(uri);
        console.log("Connected!");
        const users = await mongoose.connection.db.collection("users").find().toArray();
        if (users.length === 0) {
            console.log("No users found in database, cannot run tests.");
            await mongoose.disconnect();
            return;
        }
        const testUser = users[0];
        console.log(`Using user: ${testUser.email} (${testUser._id})`);
        const token = generateToken(testUser._id.toString());
        // 1. Test AI Image Generation fallback
        console.log("\n--- Testing AI Image Generation fallback ---");
        try {
            const genResponse = await axios.post("http://localhost:3001/api/posts/generate", {
                prompt: "A beautiful cup of cappuccino art on a workspace",
                tone: "Creative",
                generateImage: true,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("AI Generation Response mediaUrl:", genResponse.data.mediaUrl);
            if (genResponse.data.mediaUrl && genResponse.data.mediaUrl.includes("leonardo.ai")) {
                console.log("SUCCESS: Image generated and fell back to Leonardo URL!");
            }
            else if (genResponse.data.mediaUrl && genResponse.data.mediaUrl.includes("cloudinary")) {
                console.log("SUCCESS: Image generated and uploaded to Cloudinary!");
            }
            else {
                console.log("FAILED: mediaUrl is missing or invalid:", genResponse.data.mediaUrl);
            }
        }
        catch (err) {
            console.error("AI Generation request failed:", err?.response?.data || err.message);
        }
        // 2. Test Post Scheduling local file upload fallback
        console.log("\n--- Testing Post Scheduling local upload fallback ---");
        try {
            const form = new FormData();
            form.append("content", "Scheduling post with local image fallback test from script.");
            form.append("platforms", JSON.stringify(["linkedin"]));
            form.append("scheduledFor", new Date(Date.now() + 3600000).toISOString());
            form.append("status", "scheduled");
            // Use client img-1.jpg or a dummy buffer
            const imagePath = path.resolve("client/src/assets/img-1.jpg");
            if (fs.existsSync(imagePath)) {
                form.append("media", fs.createReadStream(imagePath));
            }
            else {
                form.append("media", Buffer.from("dummy image content"), {
                    filename: "test.jpg",
                    contentType: "image/jpeg",
                });
            }
            const scheduleResponse = await axios.post("http://localhost:3001/api/posts", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...form.getHeaders(),
                },
            });
            console.log("Schedule Post Response mediaUrl:", scheduleResponse.data.mediaUrl);
            if (scheduleResponse.data.mediaUrl && scheduleResponse.data.mediaUrl.includes("/uploads/")) {
                console.log("SUCCESS: Local storage fallback successfully used!");
                // Confirm the local file exists on disk
                const filename = path.basename(scheduleResponse.data.mediaUrl);
                const localPath = path.join(process.cwd(), "uploads", filename);
                if (fs.existsSync(localPath)) {
                    console.log(`SUCCESS: File successfully written to disk at ${localPath}`);
                }
                else {
                    console.log(`FAILED: File was not found on disk at ${localPath}`);
                }
            }
            else if (scheduleResponse.data.mediaUrl && scheduleResponse.data.mediaUrl.includes("cloudinary")) {
                console.log("SUCCESS: Cloudinary upload successfully used!");
            }
            else {
                console.log("FAILED: mediaUrl is missing or invalid:", scheduleResponse.data.mediaUrl);
            }
        }
        catch (err) {
            console.error("Schedule Post request failed:", err?.response?.data || err.message);
        }
    }
    catch (err) {
        console.error("Verification failed:", err.message);
    }
    finally {
        await mongoose.disconnect();
    }
}
run();
