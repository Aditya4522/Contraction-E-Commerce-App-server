import mongoose from 'mongoose';

const { Schema } = mongoose;

const repliesSchema = new Schema(
  {
    review: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
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
      ref: 'User',
      required: true,
    },
    replies: [repliesSchema],
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
