import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/Connection.js";
import authRouter from "./routes/authRoutes.js";
import pincodeRoutes from "./routes/pincodeRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";

dotenv.config();

const app = express();

// 🔥 Proper CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // ✅ Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
    credentials: true, // ✅ Allow cookies & authentication headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT || 5001;

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api", pincodeRoutes);
app.use("/api", settingRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", orderRoutes);

// ✅ Handle preflight requests properly
app.options("*", cors()); // Handles CORS for all routes

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
