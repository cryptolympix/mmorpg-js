import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

import heroesRoutes from "./routes/heroes.routes";

const appDirectory = fs.realpathSync(process.cwd());
const sourceFolder = path.resolve(appDirectory, "src");
const assetsFolder = path.resolve(sourceFolder, "assets");

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
app.use("/api/heroes", heroesRoutes);

export default app;
