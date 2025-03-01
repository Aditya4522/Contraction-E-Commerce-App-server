import e from "express";
import mongoose from "mongoose";

const Schema = mongoose.Schema;
// User Schema
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    otp: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user"],
    },
    purchasedProduct: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
