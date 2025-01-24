import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";

import heroRoutes from "./routes/hero.routes";

import "./database";

const appDirectory = fs.realpathSync(process.cwd());
const sourceFolder = path.resolve(appDirectory, "src");
const assetsFolder = path.resolve(sourceFolder, "assets");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", // Adresse de votre client
    methods: "GET,POST,PUT,DELETE", // Méthodes autorisées
    allowedHeaders: "Content-Type,Authorization", // En-têtes autorisées
  })
);

app.use(express.json());
app.use("/assets", express.static(assetsFolder));
app.use("/api/hero", heroRoutes);

export default app;
