import orgModel from "../models/orgModel.js";
import mongoose from "mongoose";
mongoose.pluralize(null);

const addNewOrg = async (data) => {
    try {
        console.log({"data recieved" : data})
        const addOrgRes = await orgModel.create(data)
        if (addOrgRes) {
            try {
                const addAdminAsMember = await orgModel.updateOne({ invitecode: data.invitecode }, { $push: { members: {name: data.name, email: data.admin} } })
            } catch (error) {
                return error;
            }
        }
        
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

const joinOrg = async (data) => {
    try {
        const findOrgRes = await orgModel.findOne({invitecode: data.invitecode});
        console.log("findorg",findOrgRes, data, findOrgRes.admin, data.email);
        if ((findOrgRes) && (findOrgRes.admin != data.email)) {
            try {
                const addMember = await orgModel.updateOne({ invitecode: data.invitecode }, { $push: { members: {name: data.name, email: data.email} } })
                console.log("add success", addMember)
            } catch (error) {
                console.log("hey", error)
            }
            
            
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

const addOrgTask = async (data) => {
    try {
        const addOrgTaskRes = await orgModel.updateOne({ id: data.orgId }, { $push: { tasks: data.task } });
    } catch (error) {
        return error;
    }
}

const updateOrgTask = async (data) => {
    console.log("data is", data, "stringyfy", JSON.stringify(data));
    try {
        const updateOrgTaskRes = await orgModel.updateOne({ id: data.orgid, 'tasks._id': data.taskid }, { $set: { 'tasks.$.status': data.status } });
        console.log(updateOrgTaskRes)
    } catch (error) {
        console.log(error)
        return error;
    }
}

const deleteOrgTask = async (data) => {
    console.log(data)
    try {
        const deleteOrgTaskRes = await orgModel.updateOne({ id: data.orgid }, { $pull: { tasks: {_id: data.taskid} } });
    } catch (error) {
        console.log(error);
        return error;
    }
}
export default {addNewOrg, joinOrg, addOrgTask, updateOrgTask, deleteOrgTask}