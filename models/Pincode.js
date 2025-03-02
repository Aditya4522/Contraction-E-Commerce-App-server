import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema({
    pincode:{
        type: String,
        required: true,
        unique: true,
    }
},{timestamps:true});

const Pincode = mongoose.model("Pincode", PincodeSchema);
module.exports = Pincode;