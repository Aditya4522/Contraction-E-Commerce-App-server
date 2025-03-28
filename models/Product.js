import mongoose from "mongoose";
import Review from "./Review.js";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    colors: {
      type: Array,
      required: true,
    },
    blackListed: {
      type: Boolean,
      default: false,
    },
    category:{
      type : String,
      required: true
    }
  },
  { timestamps: true }
);

// Fix: Use 'methods' instead of 'method'
productSchema.methods.calculateRating = async function () {
  const reviews = await Review.find({ productId: this._id });

  if (reviews.length === 0) {
    this.rating = 0;
  } else {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = totalRating / reviews.length;
  }

  await this.save();
};

const Product = mongoose.model("Product", productSchema);
export default Product;
