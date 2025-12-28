const express = require("express");
const ensureAuthenticated = require("../middleware/authMiddleware");
const { getGeminiResponse } = require("../services/gemini");

const router = express.Router();

/**
 * POST /api/chat/message
 * Save user message + bot reply
 */
router.post("/message", ensureAuthenticated, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.json({
        reply: "[NEUTRAL] Please type something so I can help you 🙂"
      });
    }

    // 1️⃣ SAVE USER MESSAGE
    req.user.chatHistory.push({
      sender: "user",
      message: message.trim()
    });

    // 2️⃣ GENERATE BOT RESPONSE (✅ await is REQUIRED)
    const reply = await getGeminiResponse(message.trim());

    // 3️⃣ SAVE BOT MESSAGE
    req.user.chatHistory.push({
      sender: "bot",
      message: reply
    });

    // 4️⃣ SAVE TO DB
    await req.user.save();

    // 5️⃣ RETURN RESPONSE
    res.json({ reply });

  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({
      reply: "[NEUTRAL] I'm here with you. Something went wrong."
    });
  }
});

/**
 * GET /api/chat/history
 * Load chat history
 */
router.get("/history", ensureAuthenticated, async (req, res) => {
  try {
    res.json(req.user.chatHistory || []);
  } catch (err) {
    console.error("❌ Load history error:", err);
    res.status(500).json([]);
  }
});

/**
 * DELETE /api/chat/history
 * Clear chat history
 */
router.delete("/history", ensureAuthenticated, async (req, res) => {
  try {
    req.user.chatHistory = [];
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Clear history error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
