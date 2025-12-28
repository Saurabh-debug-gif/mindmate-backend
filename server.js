/**
 * MindMate Backend – Production Server
 * Works with:
 * - Firebase Hosting (Frontend)
 * - Render (Backend)
 * - Express Session + Passport
 */

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const moodRoutes = require("./routes/mood");

const app = express();

/* ======================================================
   🔒 TRUST PROXY (CRITICAL FOR RENDER + HTTPS COOKIES)
   MUST be before session middleware
====================================================== */
app.set("trust proxy", 1);

/* ======================================================
   🌍 CORS (Firebase → Render, Cookies Allowed)
====================================================== */
app.use(
  cors({
    origin: "https://mindmate-auth.web.app",
    credentials: true
  })
);

/* ======================================================
   📦 BODY PARSERS
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   🍪 SESSION (CROSS-DOMAIN, PRODUCTION-SAFE)
====================================================== */
app.use(
  session({
    name: "mindmate.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,        // HTTPS only (Render + Firebase)
      sameSite: "none"     // Required for cross-domain cookies
    }
  })
);

/* ======================================================
   🔐 PASSPORT AUTH
====================================================== */
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

/* ======================================================
   🚏 ROUTES
====================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mood", moodRoutes);

/* ======================================================
   🗄️ MONGODB CONNECTION
====================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ======================================================
   🚀 START SERVER (RENDER SAFE)
====================================================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
