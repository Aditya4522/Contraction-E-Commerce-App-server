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
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 9;

    if (page < 1) page = 1;
    if (limit < 1) limit = 9;

    let query = {};

    if (category) {
      category = category.charAt(0).toUpperCase() + category.slice(1);
      if (category.toLowerCase() !== "all") {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') }; 
      }
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (!isNaN(price) && Number(price) > 0) {
      query.price = { $lte: Number(price) };
    }
    if (req.role !== ROLES.admin) {
      query.blacklisted = { $ne: true };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .select("name price description blacklisted images rating category")
      .skip(limit * (page - 1))
      .limit(limit);

    const newProductArray = products.map((product) => {
      const productObj = product.toObject();
      productObj.image = product.images?.[0]?.url || "default_image_url_here";  
      delete productObj.images;  
      return productObj;  
    });

    // console.log(newProductArray);

    if (!products.length) {
      return res.status(404).json({ success: false, message: "Products not found" });
    }

    // Return the fetched products with pagination details and rating
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: newProductArray,
      pagination: {
        totalPages,
        totalProducts,
        currentPage: page,
        pageSize: limit,
        category
      },
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getProductId = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product found", data: product });
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
