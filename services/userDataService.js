// import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import orgModel from "../models/orgModel.js";
import bcrypt from "bcryptjs";
import jwtUtils from "../controllers/jwtUtils.js";

const userData = async (data) => {
    console.log("dx data", data)
    if (data.email != undefined) {
        console.log("hey", data)
        const userDataResponse = await userModel.findOne({ email: data.email })
        return userDataResponse;
    } else {
        const userDataResponse = await userModel.findOne({ username: data.username })
        return userDataResponse;
    }
    
}

const addUser = async (data) => {
    console.log(data)
    try {
        const isUserPresentEmail = await userModel.findOne({ email: data.email });
        console.log(isUserPresentEmail, data)
        
        if (!isUserPresentEmail) {
            console.log("username", data.username)
            if (data.username === undefined) {
                const addUserRespose = await userModel.create(data);
    
                const saveUserResponse = await addUserRespose.save()
                
                return saveUserResponse;
            } else {
                const isUserPresentUsername = await userModel.findOne({ username: data.username });
                console.log("hi" ,isUserPresentUsername)
                if (!isUserPresentUsername) {
                    const addUserRespose = await userModel.create(data);
        
                    const saveUserResponse = await addUserRespose.save()
                    
                    return saveUserResponse;
                } else {
                    console.log("user present with username hi")
                    // console.log(isUserPresentUsername)
                }
            }
            
        } else {
            console.log("user present with email")
            console.log("userDaaaata", data)
            // const modifyAddUserRespose = JSON.parse(JSON.stringify(data));
            // // // modifyAddUserRespose.id = modifyAddUserRespose._id.toString();
            // delete modifyAddUserRespose.ptoken;
            // delete modifyAddUserRespose.password;
            // // // delete modifyAddUserRespose._id;
            
            // const userJWTToken = jwtUtils.createJWT(modifyAddUserRespose);
            // console.log("toooken", userJWTToken)
            // // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
            // res.send({ url: `${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}` })
            return undefined
        }

        // console.log(isUserPresentEmail)

        // return isUserPresentEmail


        // const addUserRespose = await userModel.create(data);
    
        // const saveUserResponse = await addUserRespose.save()
        // return saveUserResponse;
    } catch (error) {
        return error;
    }
}

const updateData = async (email, key, value) => {
    const updateUserResponse = await userModel.findOne({ email: email });
    console.log("uuuuuuuuuuuuup", updateUserResponse, email)
    updateUserResponse[key] = value;
    const saveUserResponse = await updateUserResponse.save();
    return saveUserResponse;
}

const userOrgList = async (email) => {
    console.log("email", email);
    try {
        // const userOrgListResponse = await orgModel.find({ members: {$in: [email]} })
        const userOrgListResponse = await orgModel.find({ members: {$elemMatch: {email: email}} })
        

        console.log("org list", userOrgListResponse)
        return userOrgListResponse;
    } catch (error) {
        return error;
    }    
}
// const checkUsers = async () => {
//     try {
//         const checkUsersResponse = await userModel.find({}, "username email accountType");
//         console.log(checkUsersResponse);
//         return checkUsersResponse;
//     } catch (error) {
//         return error;
//     }
    
// }

// const updatePassToken = async (usermail, token) => {
//     try {
//         const updatepasswordtoken = await userModel.updateOne({email: usermail}, {$set: {ptoken: token}})
//     } catch (error) {
        
//     }
// }

const authUser = async (data) => {
    try {
        const userPresebtRes = await userModel.findOne({ "username": data.email })
        if (userPresebtRes) {
            // pending
        } else {
            return 0
        }
    } catch (error) {
        console.log("error", error)
    }
    
}
export default {
    userData,
    addUser,
    updateData,
    userOrgList,
    // checkUsers,
}