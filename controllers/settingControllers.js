import  {ROLES}  from "../utils/constants.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";

 export const ChangeUsername = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({
      success: false,
      message: "Access Denied",
    });
  }

  try {
    const { previousUsername, newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({
        success: false,
        message: "New username is required",
      });
    }

    const user = await Admin.findOneAndUpdate(
      { username: previousUsername },
      { username: newUsername },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Username successfully changed to ${user.username}`,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ChangePassword = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const { userId ,previousPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!previousPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Previous password and new password are required",
      });
    }

    let user = await Admin.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatchPassword = await bcrypt.compare(
      previousPassword,
      user.password
    );

    if (!isMatchPassword) {
      return res.status(401).json({
        success: false,
        message: "Previous password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password successfully changed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 