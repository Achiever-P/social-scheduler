import mongoose from "mongoose";
import dotenv from "dotenv";

import path from "path";
dotenv.config({ path: path.resolve("server/.env") });

const postSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    content: { type: String, required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
    platforms: [{ type: String, enum: ["twitter", "linkedin", "facebook", "instagram", "facebook_page", "linkedin_page", "instagram_business"] }],
    scheduledFor: { type: Date, required: true },
    status: { type: String, enum: ["draft", "scheduled", "published", "failed"], default: "scheduled" },
}, {timestamps: true});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log("URI is:", uri);
        console.log("Connecting to Mongo...");
        await mongoose.connect(uri!);
        console.log("Connected!");

        const users = await mongoose.connection.db!.collection("users").find().toArray();
        console.log("Users in DB:", users.map(u => ({ id: u._id.toString(), email: u.email })));

        if (users.length === 0) {
            console.log("No users in DB");
            await mongoose.disconnect();
            return;
        }

        console.log("Creating test post...");
        const p = await Post.create({
            user: users[0]._id,
            content: "Test post from script",
            platforms: ["linkedin"],
            scheduledFor: new Date(),
            status: "scheduled"
        });
        console.log("Post created successfully:", p);
    } catch (err: any) {
        console.error("Error running test:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
