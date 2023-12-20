import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },

});

const Role = model('Role', roleSchema);

export default Role;
