import { Request, Response } from "express";
import User from "../models/user";
import Role from "../models/role";
import { hashPassword } from "../middlewares/bcrypt";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, roleId } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: [role._id]
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password,
    });

    if (!updatedUser) {
      res.json({ error: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.json({ error: "User not found" });
      return;
    }

    res.json(deletedUser)
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const deleteAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    await User.deleteMany()

    res.json({ message: `All Users Deleted` })
  } catch (error) {
    res.status(500).json(error)
  }
}