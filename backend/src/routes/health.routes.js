import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/supabase", async (req, res) => {
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

export default router;