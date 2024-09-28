import mongoose from "mongoose";

const task = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    assignedto: { type: String },
    start: { type: Date },
    end: { type: Date },
    status: {type: String, required: true},
})

const orgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin: { type: String, required: true },
    image: {type: String, required: true},
    members: {type: Array},
    desc: { type: String },
    invitecode: { type: String, unique: true, required: true },
    // orgid: { type: Number, unique: true },
    tasks: {type: [task]},
    id: { type: String, unique: true, required: true },

})

const orgModel = mongoose.model("org", orgSchema, "org");

export default orgModel;