import { Request, Response } from 'express';
import User from '../models/user';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password }
        );
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(204).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};