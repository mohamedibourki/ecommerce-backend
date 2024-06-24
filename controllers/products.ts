import { Request, Response } from 'express';
import Product from '../models/product';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, quantity, category } = req.body;
        const product = await Product.create({ name, description, price, quantity, category });
        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const searchQuery = req.query.search as string || '';

        const query = searchQuery ? { $text: { $search: searchQuery } } : {};
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json(products);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, quantity, category } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, quantity, category }
        );
        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.status(200).json(updatedProduct);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.status(204).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
