import mongoose, { Schema } from "mongoose";

const usersSchema = new mongoose.Schema({
    username: { type: String,  unique: true, sparse: true},
    name: {type: String },
    email: { type: String, required: true, unique: true, lowercase: true, immutable: true },
    password: { type: String },
    accountType: { type: String, required: true },
    photo: { type: String },
    friends: { type: Array },
    ptoken: {type: String, required: true},
    // createdAt: {
    //     type: Date,
    //     default: () => Date.now
    // },
    // friend: {type: mongoose.Schema.ObjectId}
})

const userModel = mongoose.model("users", usersSchema);

export default userModel;