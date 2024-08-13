import mongoose, { Schema, model } from "mongoose";
import user from "../types/user";

const userSchema: Schema<user> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dxriwp8sx/image/upload/v1723214021/profile_uk9sbs.png'
    },
    campsCreated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            default: []
        }
    ],
    campsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            default: []
        }
    ],
});

const userModel = model<user>('user', userSchema);

export default userModel;