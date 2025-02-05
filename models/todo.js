import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
        enum: [true, false],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});
export const Todo = mongoose.model("Todo", todoSchema)