import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Feedback } from "../models/Feedback.js";

const AVATAR_GRADIENTS = [
  "from-red-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-pink-500"
];

// GET /api/feedback
export const getFeedbacks = async (req: Request, res: Response): Promise<void> => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// POST /api/feedback
export const createFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, role, text, rating } = req.body;

    if (!name || !role || !text) {
      res.status(400).json({ message: "Name, role, and feedback text are required." });
      return;
    }

    // Pick a random gradient for avatarBg
    const randomGradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];

    const feedback = await Feedback.create({
      user: req.user._id,
      name,
      role,
      text,
      rating: rating || 5,
      avatarBg: randomGradient
    });

    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// DELETE /api/feedback/:id
export const deleteFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findOne({ _id: id, user: req.user._id });

    if (!feedback) {
      res.status(404).json({ message: "Feedback not found or unauthorized" });
      return;
    }

    await Feedback.deleteOne({ _id: id });
    res.json({ message: "Feedback deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};
