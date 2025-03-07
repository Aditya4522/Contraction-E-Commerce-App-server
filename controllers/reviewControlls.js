import { json } from "express";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { ROLES } from "../utils/constants.js";

export const createReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({
      succuss: false,
      message: "Access denied",
    });
  }

  const userId = req.id;

  try {
    const { productId, review, rating } = req.body;
    const newReivew = await Review.create({
      productId,
      review,
      rating,
      userId,
    });

    newReivew.populate("userId", "name");

    let product = await Product.findByIdAndUpdate(productId, {
      $push: {
        reviews: newReivew._id,
      },
    });

    await product.calculateRating();

    res.status(200),
      json({
        succuss: true,
        message: "Thank for the Review",
        data: newReivew,
      });
  } catch (error) {
    return res.status(500).json({
      succuss: false,
      message: message.error,
    });
  }
};

export const updateReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    const { id } = req.params;

    const { updateReview } = req.body;

    let review = await findByIdAndUpdate(
      id,
      { review: updateReview },
      { new: true }
    );

    await review.populate("userId", "name");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: existingReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const replyReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  const { id } = req.params; // ✅ Move this outside
  const userId = req.id;

  try {
    const { review } = req.body;

    let foundReview = await Review.findByIdAndUpdate(
      id, // ✅ Pass ID directly
      { $push: { replies: { userId, review } } },
      { new: true }
    )
      .populate("replies.userId", "name")
      .populate("userId", "name");

    if (!foundReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: foundReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  if (req.role !== ROLES.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    const { id } = req.params;

    let review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    let product = await Product.findByIdAndUpdate(
      review.productId,
      { $pull: { reviews: review._id } },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await product.calculateRating();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReveiw = async (req,res) => {

    try {
        const {id} = req.params;

        const review = await Review.findById({productId:id})
        .populate({
            path : "userId",
            select:"name"
        })
        .populate({
            path:"replies.userId",
            select:"name"
        })
        if(!review) return res.status(404).json({
            success:false,
            message:"review not found"
        })
        return res.status(200).json({
            success:true,
            message:"Review Found",
            data:reviews
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}