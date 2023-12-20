import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: String,
  createdBy:{ type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model('Category', categorySchema);
