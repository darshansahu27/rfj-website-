import express from "express";
import cors from "cors";
import supabase from "./supabase.js";
import menuRoutes from "./routes/menuRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/menu", menuRoutes);


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