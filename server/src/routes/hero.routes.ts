import express from "express";
import * as heroController from "../controllers/hero.controller";

const router = express.Router();

router.get("/", heroController.getHeroes);
router.get("/:id", heroController.getHero);
router.post("/", heroController.createHero);
router.put("/:id", heroController.updateHero);
router.delete("/:id", heroController.deleteHero);
router.delete("/", heroController.deleteHeroes);

export default router;
