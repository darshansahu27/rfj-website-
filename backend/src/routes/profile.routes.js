import express from "express";
import { randomUUID } from "crypto";
import supabaseAdmin from "../config/supabaseAdmin.js";
import firebaseAdminAuth from "../config/firebaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG, and WebP images are allowed.")
      );
    }

    callback(null, true);
  },
});

// --------------------------------------------------
// HELPER: Verify that the authenticated user is owner
// --------------------------------------------------
async function getOwnerProfile(firebaseUid) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role, firebase_uid")
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data || data.role !== "owner") {
    return null;
  }

  return data;
}

// --------------------------------------------------
// HELPER: Find the single existing manager
// --------------------------------------------------
async function getSingleManagerProfile() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, role, firebase_uid")
    .eq("role", "manager");

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      manager: null,
      error: "NOT_FOUND",
    };
  }

  if (data.length !== 1) {
    return {
      manager: null,
      error: "MULTIPLE_MANAGERS",
    };
  }

  if (!data[0].firebase_uid) {
    return {
      manager: null,
      error: "MISSING_UID",
    };
  }

  return {
    manager: data[0],
    error: null,
  };
}

// --------------------------------------------------
// OWNER: Upload profile avatar
// POST /api/profile/owner/avatar
// --------------------------------------------------
router.post(
  "/owner/avatar",
  verifyFirebaseToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const firebaseUid = req.firebaseUser.uid;

      const { data: profile, error: lookupError } =
        await supabaseAdmin
          .from("profiles")
          .select("id, role")
          .eq("firebase_uid", firebaseUid)
          .maybeSingle();

      if (lookupError) {
        console.error(
          "Owner profile lookup failed:",
          lookupError.message
        );

        return res.status(500).json({
          success: false,
          message: "Unable to verify owner profile.",
        });
      }

      if (!profile || profile.role !== "owner") {
        return res.status(403).json({
          success: false,
          message:
            "Only authorized owners can update their profile photo.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image to upload.",
        });
      }

      const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rfj/owner-profiles",
            public_id: firebaseUid,
            overwrite: true,
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result.secure_url);
          }
        );

        stream.end(req.file.buffer);
      });

      const { data: updatedProfile, error: updateError } =
        await supabaseAdmin
          .from("profiles")
          .update({
            avatar_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("firebase_uid", firebaseUid)
          .eq("role", "owner")
          .select("avatar_url")
          .single();

      if (updateError) {
        console.error(
          "Owner avatar update failed:",
          updateError.message
        );

        return res.status(500).json({
          success: false,
          message:
            "Image uploaded, but the profile could not be updated.",
        });
      }

      return res.json({
        success: true,
        avatarUrl: updatedProfile.avatar_url,
        message: "Profile photo updated successfully.",
      });
    } catch (error) {
      console.error("Owner avatar upload failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to upload profile photo.",
      });
    }
  }
);

// --------------------------------------------------
// GET: Owner or manager's own profile
// GET /api/profile/me
// --------------------------------------------------
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, full_name, role, firebase_uid, phone, avatar_url"
      )
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error) {
      console.error("Profile lookup failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to look up user profile.",
      });
    }

    if (!profile || !["owner", "manager"].includes(profile.role)) {
      return res.status(403).json({
        success: false,
        message: "No authorized owner or manager profile found.",
      });
    }

    return res.json({
      success: true,
      profile: {
        fullName: profile.full_name,
        email: req.firebaseUser.email || "",
        phone: profile.phone || "",
        avatarUrl: profile.avatar_url || "",
        role: profile.role,
      },
    });
  } catch (error) {
    console.error("Profile route error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// --------------------------------------------------
// PATCH: Update the logged-in owner's profile
// PATCH /api/profile/owner
// --------------------------------------------------
router.patch("/owner", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const fullName =
      typeof req.body.fullName === "string"
        ? req.body.fullName.trim()
        : "";

    const phone =
      typeof req.body.phone === "string"
        ? req.body.phone.trim()
        : "";

    if (fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Full name must be between 2 and 100 characters.",
      });
    }

    if (phone.length > 25) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 25 characters or fewer.",
      });
    }

    const { data: existingProfile, error: lookupError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, role")
        .eq("firebase_uid", firebaseUid)
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Owner profile lookup failed:",
        lookupError.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to verify owner profile.",
      });
    }

    if (!existingProfile || existingProfile.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only an authorized owner can update this profile.",
      });
    }

    const { data: updatedProfile, error: updateError } =
      await supabaseAdmin
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("firebase_uid", firebaseUid)
        .eq("role", "owner")
        .select("full_name, phone, avatar_url")
        .single();

    if (updateError) {
      console.error(
        "Owner profile update failed:",
        updateError.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to save profile changes.",
      });
    }

    return res.json({
      success: true,
      message: "Owner profile updated successfully.",
      profile: {
        fullName: updatedProfile.full_name,
        phone: updatedProfile.phone || "",
        avatarUrl: updatedProfile.avatar_url || "",
      },
    });
  } catch (error) {
    console.error("Owner profile update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

// --------------------------------------------------
// GET: Fetch the existing manager's details
// GET /api/profile/owner/manager
// OWNER ACCESS ONLY
// --------------------------------------------------
router.get(
  "/owner/manager",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const owner = await getOwnerProfile(req.firebaseUser.uid);

      if (!owner) {
        return res.status(403).json({
          success: false,
          message: "Only the owner can access manager details.",
        });
      }

      const result = await getSingleManagerProfile();

      if (result.error === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "No manager profile was found.",
        });
      }

      if (result.error === "MULTIPLE_MANAGERS") {
        return res.status(409).json({
          success: false,
          message:
            "Multiple manager profiles exist. Please specify the manager account.",
        });
      }

      if (result.error === "MISSING_UID") {
        return res.status(409).json({
          success: false,
          message:
            "The manager profile is not linked to a Firebase account.",
        });
      }

      const managerUser = await firebaseAdminAuth.getUser(
        result.manager.firebase_uid
      );

      return res.json({
        success: true,
        manager: {
          name:
            result.manager.full_name ||
            managerUser.displayName ||
            "",
          email: managerUser.email || "",
        },
      });
    } catch (error) {
      console.error(
        "Fetch manager details error:",
        error.code || error.message
      );

      if (error.code === "auth/user-not-found") {
        return res.status(404).json({
          success: false,
          message: "The manager's Firebase account was not found.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to retrieve manager details.",
      });
    }
  }
);

// --------------------------------------------------
// PATCH: Update the existing manager's credentials
// PATCH /api/profile/owner/manager
// OWNER ACCESS ONLY
// --------------------------------------------------
router.patch(
  "/owner/manager",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const owner = await getOwnerProfile(req.firebaseUser.uid);

      if (!owner) {
        return res.status(403).json({
          success: false,
          message:
            "Only an authorized owner can update manager credentials.",
        });
      }

      const name =
        typeof req.body.name === "string"
          ? req.body.name.trim()
          : "";

      const email =
        typeof req.body.email === "string"
          ? req.body.email.trim()
          : "";

      const password = req.body.password;

      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Manager name must be between 2 and 100 characters.",
        });
      }

      if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid manager email address.",
        });
      }

      if (
        password !== undefined &&
        password !== "" &&
        (typeof password !== "string" || password.length < 6)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The new password must contain at least 6 characters.",
        });
      }

      const result = await getSingleManagerProfile();

      if (result.error === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "No manager profile was found.",
        });
      }

      if (result.error === "MULTIPLE_MANAGERS") {
        return res.status(409).json({
          success: false,
          message:
            "Multiple manager profiles exist. Please specify the manager account.",
        });
      }

      if (result.error === "MISSING_UID") {
        return res.status(409).json({
          success: false,
          message:
            "The manager profile is not linked to a Firebase account.",
        });
      }

      const managerProfile = result.manager;

      // Never change the Firebase UID or the manager's role.
      const firebaseUpdates = {
        displayName: name,
        email,
      };

      // A blank password means the existing password stays unchanged.
      if (password) {
        firebaseUpdates.password = password;
      }

      const updatedFirebaseUser = await firebaseAdminAuth.updateUser(
        managerProfile.firebase_uid,
        firebaseUpdates
      );

      // Update Supabase only after Firebase accepts the changes.
      const { error: profileUpdateError } = await supabaseAdmin
        .from("profiles")
        .update({
          full_name: name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", managerProfile.id)
        .eq("firebase_uid", managerProfile.firebase_uid)
        .eq("role", "manager");

      if (profileUpdateError) {
        console.error(
          "Manager profile synchronization failed:",
          profileUpdateError.message
        );

        return res.status(500).json({
          success: false,
          message:
            "Firebase credentials were updated, but the Supabase profile could not be synchronized. Contact the developer before retrying.",
        });
      }

      return res.json({
        success: true,
        message: "Manager credentials updated successfully.",
        manager: {
          name,
          email: updatedFirebaseUser.email || "",
        },
      });
    } catch (error) {
      console.error(
        "Update manager credentials error:",
        error.code || error.message
      );

      if (error.code === "auth/email-already-exists") {
        return res.status(409).json({
          success: false,
          message:
            "That email address is already used by another Firebase account.",
        });
      }

      if (error.code === "auth/invalid-email") {
        return res.status(400).json({
          success: false,
          message: "Firebase rejected the email address.",
        });
      }

      if (
        error.code === "auth/invalid-password" ||
        error.code === "auth/weak-password"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The new password does not meet Firebase requirements.",
        });
      }

      if (error.code === "auth/user-not-found") {
        return res.status(404).json({
          success: false,
          message: "The manager's Firebase account was not found.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to update manager credentials.",
      });
    }
  }
);

// --------------------------------------------------
// GET: Fetch the logged-in customer's profile
// GET /api/profile/customer
// --------------------------------------------------

router.get(
  "/customer",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const firebaseUid = req.firebaseUser.uid;

      const { data: profile, error: profileError } =
        await supabaseAdmin
          .from("profiles")
          .select("id, full_name, role")
          .eq("firebase_uid", firebaseUid)
          .maybeSingle();

      if (profileError) {
        console.error(
          "Customer profile lookup failed:",
          profileError.message
        );

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

      const { data: customer, error: customerError } =
        await supabaseAdmin
          .from("customers")
          .select("id, phone")
          .eq("id", profile.id)
          .maybeSingle();

      if (customerError) {
        console.error(
          "Customer details lookup failed:",
          customerError.message
        );

        return res.status(500).json({
          success: false,
          message: "Unable to load customer details.",
        });
      }

      let address = null;

      if (customer) {
        const { data: savedAddress, error: addressError } =
          await supabaseAdmin
            .from("addresses")
            .select(
              "id, address_line, city, state, postal_code, landmark"
            )
            .eq("customer_id", customer.id)
            .maybeSingle();

        if (addressError) {
          console.error(
            "Customer address lookup failed:",
            addressError.message
          );

          return res.status(500).json({
            success: false,
            message: "Unable to load the saved delivery address.",
          });
        }

        if (savedAddress) {
          address = {
            id: savedAddress.id,
            addressLine: savedAddress.address_line,
            city: savedAddress.city,
            state: savedAddress.state,
            postalCode: savedAddress.postal_code,
            landmark: savedAddress.landmark || "",
          };
        }
      }

      return res.status(200).json({
        success: true,
        profile: {
          fullName: profile.full_name || "",
          phone: customer?.phone || "",
          email: req.firebaseUser.email || "",
          role: profile.role,
          address,
        },
      });
    } catch (error) {
      console.error(
        "Customer profile route error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);


// --------------------------------------------------
// POST: Register a customer profile
// POST /api/profile/customer
// --------------------------------------------------
router.post(
  "/customer",
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const firebaseUid = req.firebaseUser.uid;

      const fullName =
        typeof req.body.fullName === "string"
          ? req.body.fullName.trim()
          : "";

      if (fullName.length < 2 || fullName.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid full name.",
        });
      }

      const { data: existingProfile, error: lookupError } =
        await supabaseAdmin
          .from("profiles")
          .select("id, full_name, role")
          .eq("firebase_uid", firebaseUid)
          .maybeSingle();

      if (lookupError) {
        console.error(
          "Customer profile lookup failed:",
          lookupError.message
        );

        return res.status(500).json({
          success: false,
          message: "Unable to check customer profile.",
        });
      }

      if (existingProfile) {
        if (existingProfile.role !== "customer") {
          return res.status(403).json({
            success: false,
            message:
              "This account is not authorized for customer registration.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Customer profile already exists.",
          profile: {
            fullName: existingProfile.full_name,
            role: existingProfile.role,
          },
        });
      }

      // The server always assigns the customer role.
      const { data: profile, error: insertError } =
        await supabaseAdmin
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
        console.error(
          "Customer profile creation failed:",
          insertError.message
        );

        return res.status(500).json({
          success: false,
          message: "Unable to create customer profile.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Customer profile created successfully.",
        profile: {
          fullName: profile.full_name,
          role: profile.role,
        },
      });
    } catch (error) {
      console.error(
        "Customer registration error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

export default router;