const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

/* =====================
   HEALTH CHECK
===================== */
router.get("/", (req, res) => {
  res.json({ status: "Auth API running" });
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({
      username: username || email.split("@")[0],
      email,
      password
    });

    await user.save();

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Auto-login failed" });
      }

      res.status(201).json({
        message: "Registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    });
  } catch (err) {
    console.error(err);
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

    req.login(user, (err) => {
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
      res.clearCookie("mindmate.sid", {
        sameSite: "none",
        secure: true
      });
      res.json({ message: "Logged out successfully" });
    });
  });
});

/* =====================
   AUTH CHECK
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
