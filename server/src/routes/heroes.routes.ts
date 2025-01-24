import express from "express";
import * as heroesController from "../controllers/heroes.controller";

const router = express.Router();

router.get("/", heroesController.getHeroes);
router.get("/:id", heroesController.getHero);
router.post("/", heroesController.createHero);
router.put("/:id", heroesController.updateHero);
router.delete("/:id", heroesController.deleteHero);
router.delete("/", heroesController.deleteHeroes);

export default router;
