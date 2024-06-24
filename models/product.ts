import mongoose, { Schema } from 'mongoose';

interface Product {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
}

const productSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
});

export default mongoose.model<Product>('Product', productSchema);
