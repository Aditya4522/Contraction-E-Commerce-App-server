import  express from "express"
import { verifyToken } from "../Middlewares/verifyToken.js";
import { getAllOrders, getMetrics, getOrderByUserId, updateOrderStatus } from "../controllers/OrderControllers.js";

const router = express.Router();

router.get('/get-orders-by-user-id', verifyToken,getOrderByUserId);
router.get('/get-all-orders',verifyToken,getAllOrders);
router.get('/get-metrics', verifyToken, getMetrics);
router.put('/update-order-status/:paymentId',verifyToken,updateOrderStatus);



export default router;