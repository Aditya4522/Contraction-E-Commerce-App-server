import User from "../models/User.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        error: "User already exists, please try another email",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(`Error signing up user: ${error.message}`);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
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

export const adminSignup = async (req, res) => {
  const { email, password, username } = req.body; // ✅ Include username

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const securePassword = await bcrypt.hash(password, 10);

    admin = new Admin({
      username,
      email,
      password: securePassword,
    });

    await admin.save();

    return res
      .status(201)
      .json({ success: true, message: "Admin signed up successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const comparePassword = await bcrypt.compare(password, admin.password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
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
      message: "Admin login successful",
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


// export { signup, login, adminSignup, adminLogin };
