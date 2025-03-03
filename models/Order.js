import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = Schema({
                amount: {
                    type: Number,
                    required: true
                },
                address: {
                    type: String,
                    required: true
                },
                razorpayOrderId: {
                    type: String,
                    required: true
                },
                razorpayPaymentId: {
                    type: String,
                    required: true
                },
                razorpaySignature: {
                    type: String,
                    required: true
                },
                products:[
                        {
                            id:{
                                type: Schema.Types.ObjectId,
                                ref: "Product"
                            },
                            quantity:{
                                type: Number,
                                required: true
                            },
                            color:
                            {
                                type: String,
                                required: true
                            }
                        }
                ],
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                status: {
                    type: String,
                    enum: ["pending","packed", "delieverd", "failed", "success"],
                    default: "pending"
                }
}, {timestamps: true});



const Order = mongoose.model("Order", orderSchema);
 export default Order;