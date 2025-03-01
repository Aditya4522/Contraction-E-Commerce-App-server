import mongoose, { Mongoose } from "mongoose";
import Review from "./Review";

const Schema = Mongoose.Schema;

const productSchema = Schema(
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
  },
  { timestamps: true }
);

productSchema.method.calculateRating = async ()=>{
const reviews = await Review.find({productId: this._id});
if(reviews.length === 0) return 0;
if(reviews.length >0){
  const totalRating = reviews.reduce((acc, review)=> acc + review.rating, 0);
  this.rating = totalRating/reviews.length;

  await this.save();
}
}



const Product = mongoose.model("Product", productSchema);
module.exports = Product;