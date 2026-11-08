import profileRoutes from "./routes/profile.routes.js";
import express from "express";
import cors from "cors";
import supabase from "./supabase.js";
import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RFJ backend is running",
    service: "backend",
  });
});



app.use(cors());

// Razorpay webhook must receive the original raw request body.
// This must be registered BEFORE express.json().
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// Parse JSON for all other API routes.
app.use(express.json());

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payments", paymentRoutes);


app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "RFJ backend is working!",
  });
});

app.get("/api/supabase-test", async (req, res) => {
  try {
    const { error } = await supabase.auth.getSession();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Supabase connection failed",
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Supabase connection is working!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Supabase connection failed",
      error: error.message,
    });
  }
});

export default app;