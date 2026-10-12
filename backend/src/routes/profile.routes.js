
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, firebase_uid")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error) {
      console.error("Profile lookup failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to look up user profile",
      });
    }

    if (!profile || !["owner", "manager"].includes(profile.role)) {
      return res.status(403).json({
        success: false,
        message: "No authorized owner or manager profile found",
      });
    }

    return res.json({
      success: true,
      profile: {
        fullName: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Profile route error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
