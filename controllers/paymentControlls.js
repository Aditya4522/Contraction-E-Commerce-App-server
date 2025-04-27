import Razorpay from "razorpay";
import crypto from "crypto"; // Added missing import
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const generatePayment = async (req, res) => {
  const userId = req.id;

  try {
    const { amount } = req.body;
    console.log("Requested amount:", amount);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).slice(2, 10)}`,
    };

    const order = await instance.orders.create(options);

    console.log("Razorpay order created successfully:", order);

    return res.status(200).json({
      success: true,
      data: {
        ...order,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Server error in generatePayment:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const verifyPayment = async (req, res) => {
  const userId = req.id;

  try {
    const { razorpay_order_id, razorpay_payment_id, amount, productArray, address } = req.body; 

    const signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) 
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
      
    const validatePayment = Razorpay(
      { "order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, 
      signature, 
      process.env.RAZORPAY_KEY_SECRET
    );
    
    if (!validatePayment) {
      return res.status(400).json({
        success: false,
        message: "payment verification failed"
      });
    }

    for (const product of productArray) {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { purchasedProducts: product.id } }
      );
      
      await Product.findByIdAndUpdate(
        { _id: product.id },
        { $inc: { stock: -product.quantity } } // Changed $push to $inc for stock adjustment
      );
    }
    
    await Order.create({
      amount: amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: signature,
      products: productArray,
      address: address,
      userId: userId
    });

    return res.status(200).json({
      success: true,
      message: "payment verified"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}