
import supabaseAdmin from "../config/supabaseAdmin.js";

const requireManagerOrOwner = async (req, res, next) => {
  try {
    // This UID is set by verifyFirebaseToken middleware.
    const firebaseUid = req.firebaseUser?.uid;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Authenticated Firebase user not found",
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, firebase_uid")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error) {
      console.error("Role lookup failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to verify user permissions",
      });
    }

    if (!profile || !["owner", "manager"].includes(profile.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Owner or manager role required.",
      });
    }

    // Make the verified profile available to later handlers.
    req.profile = profile;

    next();
  } catch (error) {
    console.error("Authorization middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export default requireManagerOrOwner;
