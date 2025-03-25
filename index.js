dotenv.config({ path: '.env' });

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



const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT ;

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api", pincodeRoutes);
app.use("/api", settingRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", orderRoutes);

app.options("*", cors());

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
