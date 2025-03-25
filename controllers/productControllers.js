import { ROLES } from "../utils/constants.js";
import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { name, price, category, description, colors, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product images are required" });
    }
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      uploadedImages.push({
        id: result.public_id,
        url: result.secure_url,
      });
    }
    const product = new Product({
      name,
      description,
      category,
      price,
      colors,
      stock,
      images: uploadedImages,
    });

    await product.save();

    return res
      .status(201)
      .json({
        success: true,
        message: "Product added successfully",
        data: product,
      });
  } catch (error) {
    console.error("Error in createProduct:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const data = req.body;
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "update error of product" });
    console.log("Error in updateProduct:", error);
  }
};

export const deleteProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Product successfully deleted",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    let { page, limit, search, price, category } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 9;

    let query = {};
    if (category) {
      query.category = category.charAt(0).toUpperCase() + category.slice(1);
    }
    if (category == "all") delete query.category;
    if (search) query.name = { $regex: search, $options: "i" };
    if (price > 0) query.price = { $lte: price };
    if (req.role !== ROLES.admin) query.blacklisted = { $ne: true };

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(query)
      .select("name price description and blacklist")
      .skip(limit * (page - 1))
      .limit(limit);

    let newProductAarry = [];

    products.forEach((product) => {
      const ProductObj = product.toObject();
      ProductObj.image = product.images[0].url;
      delete ProductObj.images;
      newProductAarry.push(ProductObj);
    });

    if (!products.length) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: newProductAarry,
      pagination: {
        totalPages,
        totalProducts,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

      return res
      .status(200)
      .json({ success: true, message: "Product found", data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const blacklistProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { blacklisted: true },
      { new: true }
    );

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found backand" });
    return res.status(200).json({
      success: true,
      message: `The product "${product.name}" has been blacklisted`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromBlacklist = async (req, res) => {

  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { blacklisted: false },
      { new: true }
    );

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res.status(200).json({
      success: true,
      message: "Product removed from blacklist",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
