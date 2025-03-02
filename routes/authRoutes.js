import express from "express";
import {signup, login, adminSignup,adminLogin } from "../controllers/authControlls";


const router = express.Router();

router.post("/signup", signup);
router.post('/login',login);
router.post("/admin-signup",adminSignup);
router.post("/admin-login",adminLogin);

export default router; 
