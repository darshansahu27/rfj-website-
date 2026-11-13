
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { randomUUID } from "node:crypto";
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import firebaseAdminAuth from "../config/firebaseAdmin.js";

const router = express.Router();

// Image upload configuration.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPEG, PNG, and WebP images are allowed.")
      );
    }

    cb(null, true);
  },
});

// Existing owner/manager profile endpoint.
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, firebase_uid, avatar_url")
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
        avatarUrl: profile.avatar_url || "",
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

// Upload owner profile photo to Cloudinary.
router.post(
  "/owner/avatar",
  verifyFirebaseToken,
  (req, res, next) => {
    upload.single("avatar")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Image must be 5 MB or smaller."
              : error.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const firebaseUid = req.firebaseUser.uid;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      // Verify that the authenticated user is the owner.
      const { data: profile, error: profileError } =
        await supabaseAdmin
          .from("profiles")
          .select("id, role")
          .eq("firebase_uid", firebaseUid)
          .maybeSingle();

      if (profileError) throw profileError;

      if (!profile || profile.role !== "owner") {
        return res.status(403).json({
          success: false,
          message: "Only the owner can update this profile photo.",
        });
      }

      // Upload image to Cloudinary.
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rfj/owner-avatars",
            public_id: `owner-${profile.id}`,
            overwrite: true,
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      const avatarUrl = uploadResult.secure_url;

      // Save Cloudinary URL in the existing profiles table.
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      return res.json({
        success: true,
        avatarUrl,
        message: "Profile photo updated successfully.",
      });
    } catch (error) {
      console.error("Owner avatar upload failed:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to upload profile photo.",
      });
    }
  }
);

// Get the logged-in customer's profile.

// Get the existing manager's account details (owner only).
router.get("/owner/manager", verifyFirebaseToken, async (req, res) => {
  try {
    const ownerUid = req.firebaseUser.uid;

    const { data: owner, error: ownerError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("firebase_uid", ownerUid)
      .maybeSingle();

    if (ownerError) throw ownerError;

    if (!owner || owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the owner can view manager details.",
      });
    }

    const { data: manager, error: managerError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, firebase_uid")
      .eq("role", "manager")
      .maybeSingle();

    if (managerError) throw managerError;

    if (!manager || !manager.firebase_uid) {
      return res.status(404).json({
        success: false,
        message: "Manager account not found.",
      });
    }

    const firebaseManager = await firebaseAdminAuth.getUser(
      manager.firebase_uid
    );

    return res.json({
      success: true,
      manager: {
        name: manager.full_name,
        email: firebaseManager.email || "",
      },
    });
  } catch (error) {
    console.error("Manager lookup failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load manager details.",
    });
  }
});


// Update the existing manager's Firebase account (owner only).
router.patch("/owner/manager", verifyFirebaseToken, async (req, res) => {
  try {
    const ownerUid = req.firebaseUser.uid;

    const { data: owner, error: ownerError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("firebase_uid", ownerUid)
      .maybeSingle();

    if (ownerError) throw ownerError;

    if (!owner || owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the owner can update manager credentials.",
      });
    }

    const name =
      typeof req.body?.name === "string"
        ? req.body.name.trim()
        : "";

    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim()
        : "";

    const password = req.body?.password;

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Manager name must be between 2 and 100 characters.",
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid manager email address.",
      });
    }

    if (
      password !== undefined &&
      password !== null &&
      password !== "" &&
      (typeof password !== "string" || password.length < 6)
    ) {
      return res.status(400).json({
        success: false,
        message: "The new password must contain at least 6 characters.",
      });
    }

    const { data: manager, error: managerError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, firebase_uid")
      .eq("role", "manager")
      .maybeSingle();

    if (managerError) throw managerError;

    if (!manager || !manager.firebase_uid) {
      return res.status(404).json({
        success: false,
        message: "Existing manager account not found.",
      });
    }

    const firebaseUpdate = {
      displayName: name,
      email,
    };

    if (password) {
      firebaseUpdate.password = password;
    }

    // Update the existing Firebase user. Never create a new account.
    await firebaseAdminAuth.updateUser(
  manager.firebase_uid,
  firebaseUpdate
);

    // Keep the existing Supabase profile synchronized.
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", manager.id);

    if (profileUpdateError) {
      console.error(
        "Manager profile synchronization failed:",
        profileUpdateError
      );

      return res.status(500).json({
        success: false,
        message:
          "Firebase credentials were updated, but the profile name could not be synchronized. Please contact the administrator.",
      });
    }

    return res.json({
      success: true,
      message: "Manager credentials updated successfully.",
      manager: {
        name: name,
        email: updatedFirebaseUser.email || email,
      },
    });
  } catch (error) {
    console.error("Manager credential update failed:", error);

    const status =
      error.code === "auth/email-already-exists" ? 409 :
      error.code === "auth/invalid-email" ? 400 :
      error.code === "auth/weak-password" ? 400 :
      error.code === "auth/user-not-found" ? 404 :
      500;

    const message =
      error.code === "auth/email-already-exists"
        ? "This email address is already used by another account."
        : error.code === "auth/invalid-email"
        ? "The manager email address is invalid."
        : error.code === "auth/weak-password"
        ? "The new password is too weak."
        : "Unable to update manager credentials.";

    return res.status(status).json({
      success: false,
      message,
    });
  }
});

router.get("/customer", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "No authorized customer profile found.",
      });
    }

    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("phone")
      .eq("id", profile.id)
      .maybeSingle();

    if (customerError) throw customerError;

    const { data: addresses, error: addressError } = await supabaseAdmin
      .from("addresses")
      .select("address_line, landmark, updated_at")
      .eq("customer_id", profile.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (addressError) throw addressError;

    const savedAddress = addresses?.[0] || {};

    return res.json({
      success: true,
      profile: {
        id: profile.id,
        fullName: profile.full_name,
        role: profile.role,
        phone: customer?.phone || "",
        address: {
          addressLine: savedAddress.address_line || "",
          landmark: savedAddress.landmark || "",
        },
      },
    });
  } catch (error) {
    console.error("Customer profile lookup failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load customer profile.",
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
          message: "This account is not registered as a customer.",
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

// Update the logged-in customer's profile.
router.patch("/customer", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const fullName =
      typeof req.body?.fullName === "string"
        ? req.body.fullName.trim()
        : "";

    const phone =
      typeof req.body?.phone === "string"
        ? req.body.phone.trim()
        : "";

    const address =
      typeof req.body?.address === "string"
        ? req.body.address.trim()
        : "";

    if (fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Enter a name between 2 and 100 characters.",
      });
    }

    const { data: profile, error: lookupError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "No authorized customer profile found.",
      });
    }

    const { error: nameError } = await supabaseAdmin
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (nameError) throw nameError;

    if (phone) {
      // Update this customer's existing row first.
      const { data: existingCustomer, error: customerLookupError } =
        await supabaseAdmin
          .from("customers")
          .select("id, phone")
          .eq("id", profile.id)
          .maybeSingle();

      if (customerLookupError) throw customerLookupError;

      // A different customer may already own this unique phone number.
      const { data: phoneOwner, error: phoneLookupError } =
        await supabaseAdmin
          .from("customers")
          .select("id")
          .eq("phone", phone)
          .neq("id", profile.id)
          .maybeSingle();

      if (phoneLookupError) throw phoneLookupError;

      if (phoneOwner) {
        return res.status(409).json({
          success: false,
          message:
            "This phone number is already associated with another customer. Please use a different number.",
        });
      }

      if (existingCustomer) {
        const { error: phoneUpdateError } = await supabaseAdmin
          .from("customers")
          .update({
            phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (phoneUpdateError) throw phoneUpdateError;
      } else {
        const { error: phoneInsertError } = await supabaseAdmin
          .from("customers")
          .insert({
            id: profile.id,
            phone,
          });

        if (phoneInsertError) throw phoneInsertError;
      }
    }

    if (address) {
      const { data: existingAddresses, error: addressLookupError } =
        await supabaseAdmin
          .from("addresses")
          .select("id")
          .eq("customer_id", profile.id)
          .order("updated_at", { ascending: false })
          .limit(1);

      if (addressLookupError) throw addressLookupError;

      const existingAddress = existingAddresses?.[0];

      if (existingAddress) {
        const { error: addressUpdateError } = await supabaseAdmin
          .from("addresses")
          .update({
            address_line: address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAddress.id);

        if (addressUpdateError) throw addressUpdateError;
      } else {
        const { error: addressInsertError } = await supabaseAdmin
          .from("addresses")
          .insert({
            id: randomUUID(),
            customer_id: profile.id,
            address_line: address,
            landmark: "",
          });

        if (addressInsertError) throw addressInsertError;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Customer profile updated successfully.",
    });
  } catch (error) {
    console.error("Customer profile update failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update customer profile.",
    });
  }
});

export default router;