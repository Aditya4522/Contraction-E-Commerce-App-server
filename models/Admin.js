import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Admin Schema
const adminSchema = Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: "admin",
        enum: ["admin"],
    }
}, {timestamps: true});


const Admin = mongoose.model("Admin", adminSchema);

export default Admin