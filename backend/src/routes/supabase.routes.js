import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("test_connection")
      .select("*")
      .limit(1);

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
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;