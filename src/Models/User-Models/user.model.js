import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: Number,

    address: {
        city: String,
        state: String,
    },
    roles: { type: Schema.Types.ObjectId, ref: 'Role' },

 
})

const User = model('User',userSchema)

export default User;