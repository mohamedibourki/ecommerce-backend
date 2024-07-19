import express from "express";
import {
  createOrder,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  updateOrderById,
} from "../controllers/order";
import { authenticateToken } from "../validation/auth";
const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getAllOrders);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id", authenticateToken, updateOrderById);
router.delete("/:id", authenticateToken, deleteOrderById);

export default router;
