import express from  "express"
import verifyToken from "../Middlewares/verifyToken.js"
import { genratePayment, verifyPayment } from "../controllers/paymentControlls";

const router = express.Router()


router.post('/genrate-payment',verifyToken,genratePayment);
router.post('/verify-payment', verifyToken,verifyPayment);




export default router;

