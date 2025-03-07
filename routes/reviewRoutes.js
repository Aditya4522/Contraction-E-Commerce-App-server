import express from "express";
import { createReview, deleteReview, getReveiw, replyReview, updateReview } from "../controllers/reviewControlls.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-review",verifyToken, createReview);
router.post("/update-review/:id", verifyToken ,updateReview);
router.delete("/delete-review", verifyToken ,deleteReview);
router.get("/get/review/:id",getReveiw);
router.put("/reply-review/:id ",verifyToken, replyReview)

export default router;
