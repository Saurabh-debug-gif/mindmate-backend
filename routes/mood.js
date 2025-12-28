const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

// SAVE MOOD
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { mood, message } = req.body;

    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    const newMood = new Mood({
      user: req.user._id,
      mood,
      message
    });

    await newMood.save();
    res.json({ success: true });

  } catch (err) {
    console.error("Mood save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET SUMMARY
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id });

    const summary = { happy: 0, sad: 0, angry: 0, neutral: 0 };

    moods.forEach(m => {
      if (summary[m.mood] !== undefined) summary[m.mood]++;
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
