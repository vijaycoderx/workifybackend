import express from "express";
import jwtUtils from "../controllers/jwtUtils.js";
import userDataService from "../services/userDataService.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/email/signup", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const ptokenStr = Math.random().toString(36) + Math.random() * 1000000000 + Math.random().toString(36);
    let hashedCode = await bcrypt.hash(ptokenStr, salt);

    const userData = req.body;
    const userDataForDB = { ...userData, ptoken: hashedCode };
    console.log("pAAS", userData)
    const passSalt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(userData.password, passSalt);
    console.log("pAAS", passHash, userData)
    userDataForDB["password"] = passHash;
    try {
        const addUserRespose = await userDataService.addUser(userDataForDB);
        if (addUserRespose) {
            const modifyAddUserRespose = JSON.parse(JSON.stringify(addUserRespose));
            modifyAddUserRespose.id = modifyAddUserRespose._id.toString();
            delete modifyAddUserRespose.__v;
            delete modifyAddUserRespose._id;
            
            const userJWTToken = jwtUtils.createJWT(modifyAddUserRespose);
            res.send({ userJWTToken });
        }
    } catch (error) {
        return error;
    }
    
    

    
    // res.redirect(`http://localhost:8000/admin?userJWTToken=${userJWTToken}`)
    // console.log(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
    
    
    // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
    // res.redirect("http://localhost:3000/admin")
})

router.post("/email/signin", async (req, res) => {
    const data = req.body
    console.log("ruke", data)
    try {
        if (data.email != undefined) {
            //email entered
            try {
                console.log("rain", data)
                const getUserRes = await userDataService.userData(data)
                console.log("finduserres", getUserRes)
                
                const authenticateUser = await bcrypt.compare(data.password, getUserRes.password)
                console.log(getUserRes, typeof(getUserRes))
                // res.send({ "status": authenticateUser })
                let plainJson = getUserRes.toObject()
                delete plainJson.password
                delete plainJson.ptoken
                delete plainJson.__v
                plainJson._id = plainJson._id.toString();

                console.log("mod fied", plainJson)
                let modResponse = plainJson
                modResponse = JSON.parse(JSON.stringify(modResponse))
                const userJWTToken = jwtUtils.createJWT(modResponse)

                // const x = JSON.parse(plainJson)

                console.log("usertoken", userJWTToken,plainJson, typeof(modResponse))
                // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
                // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin`);
                console.log("isuservalid",authenticateUser)
                if (authenticateUser) {
                    res.send({
                        status: true,
                        userJWTToken: userJWTToken,
                        // url: `${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`,
                    })
                } else {
                    res.send({"status": false})
                }
                
            } catch (error) {
                console.log("error", error)
                res.send({"status": false})
            }
            
        } else {
            //username entered
            try {
                const getUserRes = await userDataService.userData(data)
                console.log("userdata", getUserRes, "type", typeof(getUserRes))

                const authenticateUser = await bcrypt.compare(data.password, getUserRes.password)
                console.log(authenticateUser)
                // res.send({ "status": authenticateUser })
                
                let plainJson = getUserRes.toObject()
                delete plainJson.password
                delete plainJson.ptoken
                delete plainJson.__v
                plainJson._id = plainJson._id.toString();

                console.log("mod fied", plainJson)
                let modResponse = plainJson
                modResponse = JSON.parse(JSON.stringify(modResponse))
                const userJWTToken = jwtUtils.createJWT(modResponse)

                // const x = JSON.parse(plainJson)

                console.log("usertoken", userJWTToken,plainJson, typeof(modResponse))
                // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`);
                // res.redirect(`${process.env.FRONTEND_ORIGIN}/admin`);
                console.log("isuservalid",authenticateUser)
                if (authenticateUser) {
                    res.send({
                        status: true,
                        userJWTToken: userJWTToken,
                        // url: `${process.env.FRONTEND_ORIGIN}/admin?userJWTToken=${userJWTToken}`,
                    })
                } else {
                    res.send({"status": false})
                }
            } catch (error) {
                console.log("error", error)
                res.send({"status": false})
            }
            
        }
    } catch (error) {
        console.log(error);
    }
    // const findUserRes = await userDataService.userData()
    //pending
})

export default router;