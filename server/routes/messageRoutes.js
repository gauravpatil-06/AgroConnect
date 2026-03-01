const express = require("express");
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  clearConversation,
} = require("../controllers/messageController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/", verifyToken, getConversations);
router.delete("/conversation/:userId", verifyToken, clearConversation);
router.get("/:userId", verifyToken, getConversation);
router.put("/read/:userId", verifyToken, markAsRead);

module.exports = router;
