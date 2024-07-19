import express from "express";
import {
  createUser,
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user";
import { authenticateToken } from "../validation/auth";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/", deleteAllUsers);
router.delete("/:id", deleteUserById);

export default router;
