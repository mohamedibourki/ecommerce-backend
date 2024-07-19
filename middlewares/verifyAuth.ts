import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { Role } from '../models/role';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.role;

    if (!userId) {
      return res.status(401).json('User not authenticated');
    }

    const user = await User.findById(userId).populate('role').exec();

    if (!user) {
      return res.status(404).json('User not found');
    }

    const role = user.role as Role;

    if (role.name === 'admin') {
      next();
    } else {
      return res.status(403).json('Access denied');
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.role;

    if (!userId) {
      return res.status(401).json('User not authenticated');
    }

    const user = await User.findById(userId).populate('role').exec();

    if (!user) {
      return res.status(404).json('User not found');
    }

    const role = user.role as Role;

    if (role.name === 'user') {
      next();
    } else {
      return res.status(403).json('Access denied');
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
