import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import dotenv from "dotenv";
import { comparePassword, hashPassword } from "./bcrypt";
import { loginLimiter } from "./rateLimit";
import dotnev from "dotenv";
import crypto from "crypto";
import { sendEmail } from "./nodemailer";

dotnev.config();

const router = express.Router();

const jwtOptions = {
  secretKey: (process.env.JWT_SECRET_KEY as string) || "secret",
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Please provide email, password, and name" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const emailToken = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      emailToken,
      isVerified: false,
    });

    await newUser.save();

    const verifyEmailLink = `${process.env.SERVER_URL}/api/verifyemail/${emailToken}`;
    const subject = "Verify Your Email";
    await sendEmail(newUser.name, newUser.email, subject, `Please verify your email by clicking on the following link: ${verifyEmailLink}`);

    // const payload = { sub: newUser.id };

    // const accessToken = jwt.sign(payload, jwtOptions.secretKey, {
    //   expiresIn: "15m",
    // });

    // const refreshToken = jwt.sign(payload, jwtOptions.secretKey, {
    //   expiresIn: "7d",
    // });

    // res.cookie("access_token", accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   expires: new Date(Date.now() + 15 * 60 * 1000),
    // });

    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // });

    return res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
  } catch (error: any) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    const payload = { sub: user.id, role: user.role };

    const accessToken = jwt.sign(payload, jwtOptions.secretKey, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, jwtOptions.secretKey, {
      expiresIn: "7d",
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error.message);
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, jwtOptions.secretKey, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign({ sub: user.sub }, jwtOptions.secretKey, {
        expiresIn: "15m",
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      res.status(200).json({ message: "Token refreshed successful" });
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
