import express from "express";
import { readdirSync } from "fs";
import { signup } from "../controllers/authControlls";

const router = express.Router();


router.post('/signup',signup);


module.export = router;