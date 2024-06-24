import mongoose, { Schema } from 'mongoose';

interface Order {
    user: mongoose.Schema.Types.ObjectId;
    products: Array<{ product: mongoose.Schema.Types.ObjectId, quantity: number }>;
    totalAmount: number;
    status: string;
}

const orderSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
});

export default mongoose.model<Order>('Order', orderSchema);
