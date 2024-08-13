import mongoose, { Schema, model } from "mongoose";
import camp from "../types/camp";

const campSchema: Schema<camp> = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
    },
    organiser: {
        type: mongoose.Schema.Types.ObjectId,
    },
    description:{
        type: String,
    },
    image: {
        type: String,
        default: './src/assets/profile.jpg'
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }
    ],
});

const campModel = model<camp>('camp', campSchema);

export default campModel;