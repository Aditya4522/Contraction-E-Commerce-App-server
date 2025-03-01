import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { readdirSync } from "fs";

// handling conection error
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT || 5000;

// Routes
app.get("/", (req, res) => {
  res.send(`<center> <h1> Welcome to the server on </h1> ${PORT} </center>`);
});


// Load all routes

const loadRoutes = async () => {
    const routeFiles = readdirSync("./routes");
  
    await Promise.all(
      routeFiles.map(async (file) => {
        const module = await import(`./routes/${file}`);
        app.use("/api", module.default); 
      })
    );
  };
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
