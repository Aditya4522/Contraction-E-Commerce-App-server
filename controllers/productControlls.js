import { ROLES } from "../utils/constants.js";
import  Product  from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
export const createProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { name, price, category, description, colors, stock } = req.body;
    
    const uploadedImages = []; // Fixed variable name

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
      uploadedImages.push({ 
        url: result.secure_url, 
        id: result.public_id 
      });
    }

    const product = new Product({
      name,
      description,
      category,
      price,
      colors,
      stock,
      image: uploadedImages,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    res.status(401).json({
      success: true,
      message: "Access denied",
    });
  }

  try {
    const { ...data } = req.body;

    const { id } = req.params;

    const prodcut = await findByIdAndUpdate(id, data, { new: true });
    if (!prodcut)
      return res.status(404).json({
        success: false,
        message: "product not found",
      });

    return res.status(2001).json({
      success: true,
      message: "product update successfully",
      data: prodcut,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    const { id } = req.params;

    const product = await findByIdAndDelete(id);

    if (!product)
      return res.status(401).json({
        success: false,
        message: "product not found",
      });

    return res.status(200).json({
      success: true,
      message: "product successfully delete",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    let { page, limit, search, price, category } = req.body;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 9;

    let query = {};

    if (category && category !== "all") {
      query.category = category.charAt(0).toUpperCase() + category.slice(1);
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (price > 0) {
      query.price = { $lte: price };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .select("name price images rating description blacklisted")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }

    let newProductArray = products.map((product) => {
      const productObj = product.toObject();
      productObj.image = productObj.images?.[0]?.url || null;
      delete productObj.images;
      return productObj;
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: newProductArray,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductbyName = async (req, res) => {
  const { name } = req.params;

  try {
    const product = await Product.findOne({ name });

    if (!product)
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    return res.status(200).json({
      success: true,
      message: "product found",
      data: prodcut,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const blacklistedProduct = async (req,res)=>{

  if(req.role !== ROLES.admin){
    return res.status(401).json({
      success:false,
      message:"Access denied"
    });
  }
    const {id} = req.params;

    try {
      
      const prodcut = await findByIdAndUpdate(id,{blacklisted:true},{new:true});
      if(!prodcut){
        return res.status(404).json({
          success:false,
          message:"product not found"
        })
      }
      return res.status(200).json({
        success:true,
        message:`the producted ${prodcut.name} has been blacklist`,
        data:prodcut

      })

    } catch (error) {
      res.status(500).json({
        success:false,
        message: error.message
      })
    }

}
export const reoveFromBlacklist = async (req,res)=>{

  if(req.role !== ROLES.admin){
    return res.status(401).json({
      success:false,
      message:"Access denied"
    })
  }

  const {id} = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id,{blacklisted:false},{new:true});
    if(!product) return res.status(404).json({
      success:false,
      message:"product not found"
    });
    return res.status(200).json({
      false:true,
      message:"remove to blacklist product "
    })


  } catch (error) {
    res.status(500).json({
      success:false
      ,message:error.message
    })
  }

}