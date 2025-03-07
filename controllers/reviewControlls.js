import { json } from "express";
import Product from "../models/Product";
import Review from "../models/Review";
import { ROLES } from "../utils/constants";

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

    let review = await findByIdAndUpdate(id, 
        {review: updateReview}
        , {new:true}
    );

    await review.populate("userId","name");

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
