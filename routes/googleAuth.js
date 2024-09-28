import express from "express";
import userDataService from "../services/userDataService.js";
import bcrypt from "bcryptjs";
// import dotenv from "dotenv"
// import { OAuth2Client } from "google-auth-library";

import googleAccess from "../controllers/googleAccess.js"
import jwtUtils from "../controllers/jwtUtils.js";

const router = express.Router();
// const dotenvConfig = dotenv.config();

router.get("/", (req, res) => {
    res.send("Auth HomePage")
})

router.post("/google/signup", (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN);
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const generatedUrl = googleAccess.googleUrlGenerator(req, res);
    console.log("google" + generatedUrl + "\n");
    // res.redirect(generatedUrl);
    res.json({generatedUrl});
    
    
})

router.get("/googleAuthorizedCallback", async (req, res) => {
    // res.header('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN);
    // res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const userTokens = await googleAccess.googleAuthorizedGenerateTokens(req, res);
    const userData = await googleAccess.userInfo(userTokens.access_token);
    console.log("USERDATA", userData);
    
    const salt = await bcrypt.genSalt(10);
    const ptokenStr = Math.random().toString(36) + Math.random() * 1000000000 + Math.random().toString(36);
    let hashedCode = await bcrypt.hash(ptokenStr, salt);
    
    const userDataForDB = {
        email: userData.email,
        name: userData.name ? userData.name : "",
        username: userData.username ? userData.username : undefined,
        photo: userData.picture ? userData.picture : "",
        accountType: "google",
        ptoken: hashedCode,
        password: hashedCode,

    }
    const addUserRespose = await userDataService.addUser(userDataForDB);
    console.log("USERRESPONSE",userDataForDB)
    if (addUserRespose) {
        console.log(addUserRespose)
        const modifyAddUserRespose = JSON.parse(JSON.stringify(addUserRespose));
        modifyAddUserRespose.id = modifyAddUserRespose._id.toString();
        delete modifyAddUserRespose.__v;
        delete modifyAddUserRespose._id;
        
        const userJWTToken = jwtUtils.createJWT(modifyAddUserRespose);
        res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);

    } else {
        const userDataForFetch = {
            email: userData.email,
        }
        const userDataRes = await userDataService.userData(userDataForFetch);
        console.log("fetched data", userDataRes)
        const modifyAddUserRespose = JSON.parse(JSON.stringify(userDataRes));
        modifyAddUserRespose.id = modifyAddUserRespose._id.toString();
        delete modifyAddUserRespose.__v;
        delete modifyAddUserRespose._id;
        const userJWTToken = jwtUtils.createJWT(modifyAddUserRespose);
        res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
        // res.redirect(`${process.env.FRONTEND_ORIGIN}/auth`);
    }
    
   

    // const userJWTToken = jwtUtils.createJWT(modifyAddUserRespose);

    // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);

    // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=hi`);

})


export default router;