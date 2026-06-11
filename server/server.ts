import "./config/env.js";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import { initScheduler } from "./services/schedulerService.js";

const app = express();

//Database connection
await connectDB()
 
// Middleware
app.use(cors())
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authRouter)
app.use("/api/oauth", socialAuthRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/posts", postRouter)
app.use("/api/activity", activityRouter)
app.use("/api/feedback", feedbackRouter)

//Intialized Scheduler
initScheduler()

//Global Error Handler 
app.use((err: any, _req: Request, res: Response, _next: NextFunction)=>{
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});