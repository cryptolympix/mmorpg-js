import express from "express";
import * as chatController from "../controllers/chat.controller";

const router = express.Router();

router.get("/", chatController.getChatMessages);
router.post("/", chatController.postChatMessage);
router.delete("/", chatController.deleteChatMessages);

export default router;
