import express from "express";
import * as chatController from "../controllers/chat.controller";

const router = express.Router();

router.get("/", chatController.getMessages);
router.post("/", chatController.postMessage);

export default router;
