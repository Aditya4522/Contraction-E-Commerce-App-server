import express from "express";
import { verifyToken } from "../Middlewares/verifyToken.js"; // Ensure correct folder casing
import { ChangeUsername, ChangePassword } from "../controllers/settingControllers.js";


const router = express.Router()


router.put('/change-username',verifyToken,ChangeUsername);
router.put('/change-password',verifyToken,ChangePassword);




export default router