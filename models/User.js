import mongoose from "mongoose";

const { Schema } = mongoose;

// User Schema
const userSchema = new Schema(
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

export default User;
