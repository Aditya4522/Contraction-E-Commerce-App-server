import { model, Mongoose } from "mongoose";

const Schema = Mongoose.Schema;

const repliesSchema = Schema(
  {
    review: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const reviewSchema = Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [repliesSchema],
  },
  { timestamps: true }
);


const Review = Mongoose.model("Review", reviewSchema);

export default Review;