import { Schema, model } from 'mongoose';

const inventorySchema = new Schema({
  quantity: { type: Number, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

export default model('Inventory', inventorySchema);
