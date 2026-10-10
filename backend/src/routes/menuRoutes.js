
import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// TEMPORARY TEST: GET /api/menu/test-categories
router.get("/test-categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");

    if (error) {
      console.error("Category test error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      categories: data,
    });
  } catch (error) {
    console.error("Category test failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/menu — Get all menu items
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase menu error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Menu API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PATCH /api/menu/:id — Update an existing menu item
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("PATCH menu request:", {
      requestedId: id,
      requestBody: req.body,
    });

    const allowedFields = [
      "name",
      "description",
      "price",
      "is_available",
      "dietary_type",
      "is_popular",
      "image_url",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    if (
      "name" in updates &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string.",
      });
    }

    if (
      "description" in updates &&
      updates.description !== null &&
      typeof updates.description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be text or null.",
      });
    }

    if (
      "price" in updates &&
      (
        updates.price === "" ||
        updates.price === null ||
        !Number.isFinite(Number(updates.price)) ||
        Number(updates.price) < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number.",
      });
    }

    if (
      "is_available" in updates &&
      typeof updates.is_available !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "is_available must be true or false.",
      });
    }

    if (
      "is_popular" in updates &&
      typeof updates.is_popular !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "is_popular must be true or false.",
      });
    }

    if (
      "dietary_type" in updates &&
      !["vegetarian", "non_vegetarian"].includes(updates.dietary_type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dietary type.",
      });
    }

    if (
      "image_url" in updates &&
      updates.image_url !== null &&
      typeof updates.image_url !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Image URL must be text or null.",
      });
    }

    if ("name" in updates) {
      updates.name = updates.name.trim();
    }

    if ("price" in updates) {
      updates.price = Number(updates.price);
    }

    const { data, error } = await supabase
      .from("menu_items")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Supabase menu update error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      console.error("Menu update returned no row:", {
        requestedId: id,
        updates,
      });

      const {
        data: existingItem,
        error: checkError,
      } = await supabase
        .from("menu_items")
        .select("id, name")
        .eq("id", id)
        .maybeSingle();

      console.error("Menu item lookup after failed update:", {
        existingItem,
        checkError,
      });

      return res.status(404).json({
        success: false,
        message:
          "No row was updated. Check the backend terminal for diagnostic details.",
      });
    }

    console.log("Menu item updated successfully:", data.id);

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Menu update API error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/menu — Create a new menu item
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      foodType,
      available,
      image,
    } = req.body;

    // Validate dish name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Dish name is required.",
      });
    }

    // Validate price
    if (
      price === "" ||
      price === null ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid non-negative price.",
      });
    }

    // Validate category
    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a category.",
      });
    }

    // Validate food type
    if (!["Veg", "Non-Veg"].includes(foodType)) {
      return res.status(400).json({
        success: false,
        message: "Please select Veg or Non-Veg.",
      });
    }

    // Validate availability
    if (typeof available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Availability must be true or false.",
      });
    }

    // Map frontend labels to Supabase category names.
    const categoryMap = {
      biryani: "rice and biryani",
      beverages: "beverages",
      drinks: "drinks",
      breads: "breads",
      "main course": "main course",
      starters: "starters",
      tandoor: "tandoor",
      chinese: "chinese",
      desserts: "desserts",
    };

    const requestedCategory = category.trim().toLowerCase();

    const categoryName =
      categoryMap[requestedCategory] || requestedCategory;

    console.log("Category received from frontend:", category);
    console.log("Category being searched:", categoryName);

    // Fetch all categories, then match case-insensitively.
    const {
      data: allCategories,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id, name");

    if (categoryError) {
      console.error("Category lookup error:", categoryError);

      return res.status(500).json({
        success: false,
        message: categoryError.message,
      });
    }

    console.log(
      "Categories returned by Supabase:",
      allCategories.map((item) => item.name)
    );

    const categoryData = allCategories.find(
      (item) =>
        typeof item.name === "string" &&
        item.name.trim().toLowerCase() ===
          categoryName.trim().toLowerCase()
    );

    console.log(
      "Matched category:",
      categoryData || "NO MATCH"
    );

    if (!categoryData) {
      return res.status(400).json({
        success: false,
        message: `Category "${categoryName}" was not found in Supabase.`,
        requestedCategory: category,
        availableCategories: allCategories.map((item) => item.name),
      });
    }

    // Build the new menu item using the matched category UUID.
    const newItem = {
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      category_id: categoryData.id,
      price: Number(price),
      dietary_type:
        foodType === "Veg" ? "vegetarian" : "non_vegetarian",
      is_available: available,
      image_url:
        typeof image === "string" && /^https?:\/\//i.test(image.trim())
          ? image.trim()
          : null,
      is_popular: false,
    };

    // Insert into Supabase.
    const { data, error } = await supabase
      .from("menu_items")
      .insert(newItem)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase menu insert error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("Menu item created successfully:", data.id);

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully.",
      data,
    });
  } catch (error) {
    console.error("Create menu item API error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export default router;