
import { randomUUID } from "node:crypto";
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

// Existing owner/manager profile endpoint.
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
// Get the logged-in customer's profile.
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
        message: "Unable to look up customer profile.",
      });
    }

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "No authorized customer profile found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
        id: profile.id,
        fullName: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Customer profile route error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});
// Create or retrieve the profile for a signed-in customer.
// The role is assigned by the backend, never by the client.
router.post("/customer", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;
    const suppliedName =
      typeof req.body?.fullName === "string"
        ? req.body.fullName.trim()
        : "";

    const tokenName =
      typeof req.firebaseUser.name === "string"
        ? req.firebaseUser.name.trim()
        : "";

    const emailName =
      typeof req.firebaseUser.email === "string"
        ? req.firebaseUser.email.split("@")[0]
        : "";

    const fullName = suppliedName || tokenName || emailName;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name.",
      });
    }

    const { data: existingProfile, error: lookupError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, full_name, role, firebase_uid")
        .eq("firebase_uid", firebaseUid)
        .maybeSingle();

    if (lookupError) throw lookupError;

    if (existingProfile) {
      if (existingProfile.role !== "customer") {
        return res.status(403).json({
          success: false,
          message:
            "This account is not registered as a customer.",
        });
      }

      return res.json({
        success: true,
        profile: {
          id: existingProfile.id,
          fullName: existingProfile.full_name,
          role: existingProfile.role,
        },
      });
    }

    const { data: profile, error: insertError } =
      await supabaseAdmin
        .from("profiles")
        .insert({
          id: randomUUID(),
          full_name: fullName,
          role: "customer",
          firebase_uid: firebaseUid,
        })
        .select("id, full_name, role, firebase_uid")
        .single();

    if (insertError) {
      // If a simultaneous request created the profile, retrieve it.
      if (insertError.code === "23505") {
        const { data: concurrentProfile, error: retryError } =
          await supabaseAdmin
            .from("profiles")
            .select("id, full_name, role, firebase_uid")
            .eq("firebase_uid", firebaseUid)
            .maybeSingle();

        if (retryError) throw retryError;

        if (concurrentProfile?.role === "customer") {
          return res.json({
            success: true,
            profile: {
              id: concurrentProfile.id,
              fullName: concurrentProfile.full_name,
              role: concurrentProfile.role,
            },
          });
        }

        return res.status(409).json({
          success: false,
          message: "Unable to create this customer profile.",
        });
      }

      throw insertError;
    }

    return res.status(201).json({
      success: true,
      profile: {
        id: profile.id,
        fullName: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Customer profile creation failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create or retrieve customer profile.",
    });
  }
});

export default router;
