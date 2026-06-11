import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    avatarBg: { type: String, default: "from-red-400 to-pink-400" },
    rating: { type: Number, default: 5 }
}, { timestamps: true });

export const Feedback = mongoose.model("Feedback", feedbackSchema);
