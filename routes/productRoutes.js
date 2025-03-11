import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  blacklistedProduct,
  getProductbyName,
  reoveFromBlacklist,getProducts
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
router.put("/update-product", verifyToken, updateProduct);
router.delete("/delete-product/:id",verifyToken,deleteProduct);
router.get("/get-products",getProducts);
router.get("/get-product-by-name/:name",getProductbyName );
router.put("/blacklist-product/:id", verifyToken,blacklistedProduct);
router.put("/remove-from-blacklisted/:id",verifyToken,reoveFromBlacklist);

export default router;
