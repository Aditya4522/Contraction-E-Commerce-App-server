import express from "express";
import  {addPincodes,getPincode} from "../controllers/pincodeControlls.js"; 
import { verifyToken } from "../Middlewares/verifyToken.js"; // Ensure correct folder casing

const router = express.Router();

router.post("/add-pincodes", verifyToken, addPincodes);
router.get("/get-pincode/:pincode", getPincode);


export default router;
