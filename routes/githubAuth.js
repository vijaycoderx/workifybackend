import express from "express";

import githubAccess from "../controllers/githubAccess.js"
import jwtUtils from "../controllers/jwtUtils.js";
import userDataService from "../services/userDataService.js";

import bcrypt from "bcryptjs";
// import router from "./googleAuth.js";

const router = express.Router();

router.post("/github/signup", (req, res) => {
    const generatedUrl = githubAccess.githubUrlGenerator(req, res);
    console.log("github\n" + generatedUrl + "\n");
    // res.redirect(generatedUrl); 
    res.json({generatedUrl})
})

router.get("/githubAuthorizedCallback", async (req, res) => {
    const userTokens = await githubAccess.githubAuthorizedGenerateTokens(req, res);
    // console.log(userTokens);
    const userData = await githubAccess.userInfo(userTokens.access_token);
    // console.log(userData)

    const salt = await bcrypt.genSalt(10);
    const ptokenStr = Math.random().toString(36) + Math.random() * 1000000000 + Math.random().toString(36);
    let hashedCode = await bcrypt.hash(ptokenStr, salt);
    const userDataForDB = {
        email: userData.email,
        name: userData.name ? userData.name : "",
        username: userData.username ? userData.username : undefined,
        photo: userData.avatar_url ? userData.avatar_url : "",
        accountType: "github",
        ptoken: hashedCode,
        password: hashedCode,
    }

    const addUserRespose = await userDataService.addUser(userDataForDB);

    if (addUserRespose) {
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
    // const modifyAddUserRespose = JSON.parse(JSON.stringify(addUserRespose));
    // modifyAddUserRespose.id = modifyAddUserRespose._id.toString();
    // delete modifyAddUserRespose.__v;
    // delete modifyAddUserRespose._id;

    // const userJWTToken = jwtUtils.createJWT(modifyAddUserRespose);
    
    // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
    
})

export default router;