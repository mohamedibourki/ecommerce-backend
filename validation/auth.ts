import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "secret",
      (err: any, decoded: any) => {
        if (err || !decoded) {
          return res.status(403).json({ message: "Invalid token" });
        }

        console.log(decoded);
        next();
      }
    );
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error.message);
  }
};
