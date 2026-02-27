import express from "express";
import subjectRoute from "./routes/subject.route.js";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import stdRoute from "./routes/std.route.js";
import pRouter from "./routes/professor.route.js";
import dbRouter from "./routes/dashboard.route.js";

dotenv.config();

const app = express();

// สำหรับ ES Modules ต้องสร้าง __dirname เอง
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== middleware =====
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ===== API routes =====
app.use(subjectRoute);
app.use(stdRoute);
app.use(pRouter);
app.use(dbRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== health check =====
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// ===== serve frontend (React/Vite dist) =====
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server start at port :", PORT);
});