import express from 'express';
import {
    createProduct,
    deleteProductById,
    getAllProducts,
    getProductById,
    updateProductById
} from '../controllers/products';
import { authenticateToken } from '../validation/auth';
const router = express.Router();

router.post('/', authenticateToken, createProduct);
router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.put('/:id', authenticateToken, updateProductById);
router.delete('/:id', authenticateToken, deleteProductById);

export default router;
