import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import orderRoutes from "./routes/order";
import { loggerMiddleware } from "./middlewares/winston";
import { authenticateToken } from "./validation/auth";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/products", authenticateToken, productRoutes);
app.use("/api/orders", authenticateToken, orderRoutes);

export default app;