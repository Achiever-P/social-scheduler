import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createFeedback, getFeedbacks, deleteFeedback } from "../controllers/feedbackController.js";
const feedbackRouter = express.Router();
feedbackRouter.get("/", getFeedbacks);
feedbackRouter.post("/", protect, createFeedback);
feedbackRouter.delete("/:id", protect, deleteFeedback);
export default feedbackRouter;
