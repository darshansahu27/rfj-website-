import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import verifyFirebaseToken from "./middleware/verifyFirebaseToken.js";
import profileRoutes from "./routes/profile.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/profile", profileRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/orders", ordersRoutes);

// Backend test
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "RFJ backend is working!",
  });
});

// Firebase authentication test
app.get("/api/auth/test", verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    message: "Firebase token verified successfully",
    uid: req.firebaseUser.uid,
  });
});

// Handle errors passed through middleware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof Error && error.name === "MulterError") {
    const isFileTooLarge = error.code === "LIMIT_FILE_SIZE";

    return res.status(isFileTooLarge ? 413 : 400).json({
      success: false,
      message: isFileTooLarge
        ? "Image must be 5 MB or smaller."
        : "Invalid image upload.",
    });
  }

  if (
    error.message ===
    "Only JPEG, PNG, and WebP images are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  console.error("Unhandled backend error:", error);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

export default app;