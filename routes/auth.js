const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

/* =====================
   HEALTH CHECK
===================== */
router.get("/", (req, res) => {
  res.send("Auth API is running");
});

/* =====================
   REGISTER
===================== */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Auto-login failed" });
      }
      res.json({
        message: "Registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

/* =====================
   LOGIN
===================== */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    });
  })(req, res, next);
});

/* =====================
   LOGOUT
===================== */
router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("mindmate.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

/* =====================
   SESSION CHECK
===================== */
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email
  });
});

module.exports = router;
