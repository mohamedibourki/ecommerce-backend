import { NextFunction, Request, Response } from "express";
import User from "../models/user"

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;

        const user = await User.findOne({ emailToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.emailToken = undefined;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message);
    }
}