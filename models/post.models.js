import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    userId:{
        type: String,
        required: true
    }
},{timestamps: true})

export const PostModel = mongoose.model("post", postSchema)