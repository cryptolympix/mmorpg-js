import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import heroRoutes from "./routes/hero.routes";

import "./database";

const appDirectory = fs.realpathSync(process.cwd());
const sourceFolder = path.resolve(appDirectory, "src");
const assetsFolder = path.resolve(sourceFolder, "assets");

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use("/assets", express.static(assetsFolder));
app.use("/api/heroes", heroRoutes);

export default app;
