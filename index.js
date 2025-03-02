import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { readdirSync } from "fs";
import connectDB from "./db/Connection.js";

dotenv.config(); // ✅ Move dotenv.config() to the top

// Handling connection error
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const PORT = process.env.PORT || 5000;

// Routes
app.get("/", (req, res) => {
  res.send(`<center> <h1> Welcome to the server on </h1> ${PORT} </center>`);
});

// Load all routes
const loadRoutes = async () => {
  try {
    const routeFiles = readdirSync(new URL("./routes", import.meta.url));

    await Promise.all(
      routeFiles.map(async (file) => {
        const module = await import(`./routes/${file}`);
        app.use("/api", module.default);
      })
    );
    console.log("Routes loaded successfully");
  } catch (error) {
    console.error(`Error loading routes: ${error.message}`);
  }
};

(async () => {
  await loadRoutes(); // ✅ Ensure routes are loaded before server starts

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
