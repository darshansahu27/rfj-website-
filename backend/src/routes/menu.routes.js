
import express from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG, and WebP images are allowed.")
      );
    }

    callback(null, true);
  },
});

const MENU_ROLES = ["owner", "manager"];

const MENU_SELECT = `
  id,
  category_id,
  name,
  description,
  price,
  image_url,
  cloudinary_public_id,
  dietary_type,
  is_popular,
  is_available,
  created_at,
  updated_at,
  categories (
    id,
    name
  )
`;

function isValidUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

function mapFoodTypeToDatabase(value) {
  if (value === "Veg" || value === "vegetarian") {
    return "vegetarian";
  }

  if (value === "Non-Veg" || value === "non_vegetarian") {
    return "non_vegetarian";
  }

  throw new Error("Food type must be Veg or Non-Veg.");
}

function mapMenuItem(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description || "",
    category: item.categories?.name || "",
    categoryId: item.category_id,
    price: String(item.price),
    foodType:
      item.dietary_type === "vegetarian" ? "Veg" : "Non-Veg",
    available: item.is_available,
    image: item.image_url || "",
    cloudinaryPublicId: item.cloudinary_public_id || null,
    isPopular: item.is_popular,
  };
}

async function requireMenuRole(req, res, next) {
  try {
    const firebaseUid = req.firebaseUser?.uid;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (error) throw error;

    if (!profile || !MENU_ROLES.includes(profile.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Only authorized owners and managers can manage the menu.",
      });
    }

    req.menuProfile = profile;
    next();
  } catch (error) {
    console.error("Menu role verification failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify menu permissions.",
    });
  }
}

async function resolveCategory(categoryId, categoryName) {
  let query = supabaseAdmin
    .from("categories")
    .select("id, name")
    .eq("is_active", true);

  if (categoryId) {
    if (!isValidUuid(categoryId)) {
      throw new Error("Invalid category ID.");
    }

    query = query.eq("id", categoryId);
  } else if (categoryName?.trim()) {
    query = query.ilike("name", categoryName.trim());
  } else {
    throw new Error("A valid menu category is required.");
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("The selected category was not found or is inactive.");
  }

  return data;
}

async function uploadMenuImage(file) {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const publicId = `menu-${randomUUID()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "rfj/menu-items",
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error("Cloudinary returned an invalid image result."));
        }

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.on("error", reject);
    stream.end(file.buffer);
  });
}

async function deleteCloudinaryImage(publicId) {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary image cleanup failed:", error.message);
  }
}

function isClientValidationError(message) {
  return [
    "Menu item name is required.",
    "Menu item name cannot be empty.",
    "Price must be a number greater than or equal to zero.",
    "Food type must be Veg or Non-Veg.",
    "A valid menu category is required.",
    "Invalid category ID.",
    "The selected category was not found or is inactive.",
    "Only JPEG, PNG, and WebP images are allowed.",
  ].includes(message);
}

function handleRouteError(res, error, operation) {
  console.error(`${operation} failed:`, error.message);

  const message = error.message || "An unexpected server error occurred.";

  const status = error instanceof multer.MulterError
    ? error.code === "LIMIT_FILE_SIZE"
      ? 413
      : 400
    : isClientValidationError(message)
      ? 400
      : 500;

  return res.status(status).json({
    success: false,
    message:
      status === 500
        ? "A server error occurred while processing the menu request."
        : message,
  });
}

// GET /api/menu
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("menu_items")
      .select(MENU_SELECT)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      items: (data || []).map(mapMenuItem),
    });
  } catch (error) {
    console.error("Menu retrieval failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load menu items.",
    });
  }
});

// POST /api/menu
router.post(
  "/",
  verifyFirebaseToken,
  requireMenuRole,
  upload.single("image"),
  async (req, res) => {
    let uploadedImage = null;
    let databaseInsertSucceeded = false;

    try {
      const {
        name,
        description,
        category,
        categoryId,
        price,
        foodType,
        available,
      } = req.body;

      if (!name?.trim()) {
        throw new Error("Menu item name is required.");
      }

      const parsedPrice = Number(price);

      if (
        price === undefined ||
        price === "" ||
        !Number.isFinite(parsedPrice) ||
        parsedPrice < 0
      ) {
        throw new Error(
          "Price must be a number greater than or equal to zero."
        );
      }

      const categoryRecord = await resolveCategory(categoryId, category);
      const dietaryType = mapFoodTypeToDatabase(foodType);

      if (req.file) {
        uploadedImage = await uploadMenuImage(req.file);
      }

      const { data, error } = await supabaseAdmin
        .from("menu_items")
        .insert({
          category_id: categoryRecord.id,
          name: name.trim(),
          description: description?.trim() || null,
          price: parsedPrice,
          image_url: uploadedImage?.imageUrl || null,
          cloudinary_public_id: uploadedImage?.publicId || null,
          dietary_type: dietaryType,
          is_popular: false,
          is_available: available !== "false",
        })
        .select(MENU_SELECT)
        .single();

      if (error) throw error;

      databaseInsertSucceeded = true;

      return res.status(201).json({
        success: true,
        item: mapMenuItem(data),
      });
    } catch (error) {
      if (uploadedImage && !databaseInsertSucceeded) {
        await deleteCloudinaryImage(uploadedImage.publicId);
      }

      return handleRouteError(res, error, "Menu item creation");
    }
  }
);

// PATCH /api/menu/:id
router.patch(
  "/:id",
  verifyFirebaseToken,
  requireMenuRole,
  upload.single("image"),
  async (req, res) => {
    let uploadedImage = null;
    let databaseUpdateSucceeded = false;

    try {
      const { id } = req.params;

      if (!isValidUuid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item ID.",
        });
      }

      const { data: existingItem, error: lookupError } =
        await supabaseAdmin
          .from("menu_items")
          .select("id, cloudinary_public_id")
          .eq("id", id)
          .maybeSingle();

      if (lookupError) throw lookupError;

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found.",
        });
      }

      const updates = {};

      if (req.body.name !== undefined) {
        if (!req.body.name.trim()) {
          throw new Error("Menu item name cannot be empty.");
        }

        updates.name = req.body.name.trim();
      }

      if (req.body.description !== undefined) {
        updates.description = req.body.description.trim() || null;
      }

      if (req.body.price !== undefined) {
        const parsedPrice = Number(req.body.price);

        if (
          req.body.price === "" ||
          !Number.isFinite(parsedPrice) ||
          parsedPrice < 0
        ) {
          throw new Error(
            "Price must be a number greater than or equal to zero."
          );
        }

        updates.price = parsedPrice;
      }

      if (req.body.categoryId || req.body.category) {
        const categoryRecord = await resolveCategory(
          req.body.categoryId,
          req.body.category
        );

        updates.category_id = categoryRecord.id;
      }

      if (req.body.foodType !== undefined) {
        updates.dietary_type = mapFoodTypeToDatabase(req.body.foodType);
      }

      if (req.body.available !== undefined) {
        if (!["true", "false", true, false].includes(req.body.available)) {
          throw new Error("Availability must be true or false.");
        }

        updates.is_available =
          req.body.available === true || req.body.available === "true";
      }

      if (req.file) {
        uploadedImage = await uploadMenuImage(req.file);
        updates.image_url = uploadedImage.imageUrl;
        updates.cloudinary_public_id = uploadedImage.publicId;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No menu item changes were provided.",
        });
      }

      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabaseAdmin
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select(MENU_SELECT)
        .single();

      if (error) throw error;

      databaseUpdateSucceeded = true;

      if (
        uploadedImage &&
        existingItem.cloudinary_public_id &&
        existingItem.cloudinary_public_id !== uploadedImage.publicId
      ) {
        await deleteCloudinaryImage(existingItem.cloudinary_public_id);
      }

      return res.json({
        success: true,
        item: mapMenuItem(data),
      });
    } catch (error) {
      if (uploadedImage && !databaseUpdateSucceeded) {
        await deleteCloudinaryImage(uploadedImage.publicId);
      }

      return handleRouteError(res, error, "Menu item update");
    }
  }
);

// Handle Multer errors that occur before route handlers execute.
router.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(status).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image size must be 5 MB or less."
          : error.message,
    });
  }

  if (
    error.message ===
    "Only JPEG, PNG, and WebP images are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return next(error);
});

export default router;
