import User from "../models/User";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ error: "User already exists and can you try another email" });
    }

    // password hashing
    const hesshedPassword = await bcrypt.hash(password, 15);

    user = new User({
      name,
      email,
      password: hesshedPassword,
      phone,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(`Error signing up user: ${error.message}`);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, message: "invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const securePassword = bcrypt.hash(password, 15);

    admin = new Admin({
      username,
      password: securePassword,
    });

    await admin.save();

    return res
      .status(200)
      .json({ success: true, message: "admin signup successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    let admin = Admin.findOne({ username });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const comparePassword = bcrypt.compare(password, admin.password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "invalid password",
      });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "admin login successfully",
      token,
      admin: {
        id: admin._id,
        role: admin.role,
        username: admin.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, login, adminSignup,adminLogin };
