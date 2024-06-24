import { Request, Response } from 'express';
import Order from '../models/order';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, products, totalAmount } = req.body;
        const order = await Order.create({ user, products, totalAmount });
        res.status(201).json(order);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(200).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, products, totalAmount, status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { user, products, totalAmount, status }
        );
        if (!updatedOrder) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(200).json(updatedOrder);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(204).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
