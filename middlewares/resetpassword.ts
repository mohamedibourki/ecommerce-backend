import { Request, Response } from 'express';
import crypto from 'crypto';
import Joi from 'joi';
import dotenv from 'dotenv';
import User from '../models/user';
import { sendEmail } from './nodemailer';
import { hashPassword } from './bcrypt';

dotenv.config();

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const updatePasswordSchema = Joi.object({
    password: Joi.string().min(8).required(),
});

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const { error } = resetPasswordSchema.validate({ email });
        if (error) {
            return res.status(400).json(error.details[0].message);
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json("User with this email not found");
        }

        const token = crypto.randomBytes(20).toString('hex');
        const resetPasswordLink = `${process.env.SERVER_URL}/api/resetpassword/${token}`;
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);

        user.resetToken = token;
        user.resetTokenExpires = expires;
        await user.save();

        const subject = "Reset Password";
        await sendEmail(user.name, email, subject, `${subject} ${resetPasswordLink}`);

        res.status(200).json('Reset password email sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('An error occurred while trying to reset the password');
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const { error } = updatePasswordSchema.validate({ password });
        if (error) {
            return res.status(400).json(error.details[0].message);
        }

        const user = await User.findOne({ resetToken: token });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            return res.status(404).json("Invalid or expired token");
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        return res.status(200).json('Password updated successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json('An error occurred while trying to update the password');
    }
};