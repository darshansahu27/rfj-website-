import express from "express";
import { randomUUID } from "crypto";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

// Get the logged-in owner's or manager's profile
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

// Get the logged-in customer's profile
router.get("/customer", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, firebase_uid")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error) {
      console.error("Customer profile lookup failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to look up customer profile",
      });
    }

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "No authorized customer profile found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
        fullName: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Customer profile route error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Register a customer profile
router.post("/customer", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;
    const fullName =
      typeof req.body.fullName === "string"
        ? req.body.fullName.trim()
        : "";

    if (fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid full name",
      });
    }

    // Check whether this Firebase account already has a profile.
    const { data: existingProfile, error: lookupError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, full_name, role")
        .eq("firebase_uid", firebaseUid)
        .maybeSingle();

    if (lookupError) {
      console.error("Customer profile lookup failed:", lookupError.message);

      return res.status(500).json({
        success: false,
        message: "Unable to check customer profile",
      });
    }

    if (existingProfile) {
      if (existingProfile.role !== "customer") {
        return res.status(403).json({
          success: false,
          message: "This account is not authorized for customer registration",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customer profile already exists",
        profile: {
          fullName: existingProfile.full_name,
          role: existingProfile.role,
        },
      });
    }

    // Always assign the customer role on the server.
    const { data: profile, error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: randomUUID(),
        full_name: fullName,
        role: "customer",
        firebase_uid: firebaseUid,
      })
      .select("id, full_name, role")
      .single();

    if (insertError) {
      console.error("Customer profile creation failed:", insertError.message);

      return res.status(500).json({
        success: false,
        message: "Unable to create customer profile",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Customer profile created successfully",
      profile: {
        fullName: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Customer registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;