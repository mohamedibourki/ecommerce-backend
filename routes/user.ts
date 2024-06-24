import express from 'express';
import {
    createUser,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserById
} from '../controllers/user';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;