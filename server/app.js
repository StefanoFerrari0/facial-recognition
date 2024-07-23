import express from "express";
import userRoutes from "./routes/user.route.js";
import faceRecognitionRoutes from "./routes/faceRecognition.route.js";
import dailyAttendanceRoutes from "./routes/dailyAttendance.route.js";
import cookieParser from "cookie-parser";
import { corsOptions } from "./utils/constants.js";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/face-recognition", faceRecognitionRoutes);
app.use("/api/daily-attendance", dailyAttendanceRoutes);

export default app;