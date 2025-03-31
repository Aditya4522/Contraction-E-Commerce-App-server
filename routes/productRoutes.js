import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  blacklistProduct,
  removeFromBlacklist, // Fixed function name
  getProducts,
  getProductId,
} from "../controllers/productControllers.js";
import { verifyToken } from "../Middlewares/verifyToken.js";
import upload from "../Middlewares/multer.js";
const router = express.Router();

router.post(
  "/create-product",
  verifyToken,
  upload.array("images", 4),
  createProduct
);

router.put("/update-product/:id", verifyToken, updateProduct);
router.delete("/delete-product/:id", verifyToken, deleteProduct);
router.get("/get-products", getProducts);
router.get("/get-product-by-id/:id", getProductId);
router.put("/blacklist-product/:id", verifyToken, blacklistProduct);
router.put("/remove-from-blacklist/:id", verifyToken, removeFromBlacklist); 

export default router;
