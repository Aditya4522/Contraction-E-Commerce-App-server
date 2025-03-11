import Pincode from "../models/Pincode.js";
import { ROLES } from "../utils/constants.js";

 export const addPincodes = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  const { pincodes } = req.body;

  if (!pincodes || pincodes.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter at least one pincode",
    });
  }

  try {
    const existingPincodes = await Pincode.find({
      pincode: { $in: pincodes.map((p) => p.pincode) },
    });

    const existingPincodeValues = existingPincodes.map((p) => p.pincode);

    // Filter out already existing pincodes
    const newPincodes = pincodes.filter(
      (p) => !existingPincodeValues.includes(p.pincode)
    );

    if (newPincodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All pincodes already exist",
      });
    }

    // Insert new pincodes
    await Pincode.insertMany(newPincodes.map((p) => ({ pincode: p.pincode })));

    return res.status(201).json({
      success: true,
      message: "Pincodes added successfully",
      addedPincodes: newPincodes,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPincode = async (req, res) => {
  const { pincode } = req.params;

  try {
    const existingPincode = await Pincode.findOne({ pincode: pincode.toString() });

    if (!existingPincode) {
      return res.status(404).json({
        success: false,
        message: "No delivery available for this pincode",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery available",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


