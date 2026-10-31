
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
