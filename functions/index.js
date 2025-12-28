const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* =====================
   Middleware
===================== */
app.use(cors({ origin: true }));
app.use(express.json());

/* =====================
   MongoDB Connection
===================== */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  // ✅ CORRECT WAY TO READ FIREBASE CONFIG
  const mongoUri = functions.config().mongodb.uri;

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  logger.info("MongoDB connected");
}

/* =====================
   DB Connection Middleware
===================== */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    logger.error("MongoDB connection failed", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* =====================
   Routes
===================== */
app.get("/", (req, res) => {
  res.send("MindMate Backend running on Firebase Functions");
});

// Example:
// const authRoutes = require("./routes/auth");
// app.use("/api/auth", authRoutes);

/* =====================
   Export Cloud Function
===================== */
exports.api = onRequest(
  {
    region: "asia-south1",
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  app
);
