import express from "express";
import jwtUtils from "../controllers/jwtUtils.js";
// import userDataService from "../services/userDataService.js";

const router = express.Router()

router.post("/isSignedin", (req, res) => {
    try {
        const isSignedin = jwtUtils.verifyJWT(req.body.userJWTToken);
        // return isSignedin;
        console.log(isSignedin);
        res.send(isSignedin);
    } catch (error) {
        res.send(error);
    }
    
})

// router.get("/getUsers", async (req, res) => {
//     try {
//         const getUsersResponse = await userDataService.checkUsers();
//         console.log(getUsersResponse);
//         res.send(getUsersResponse)
//     } catch (error) {
//         res.send(error);
//     }
// })

export default router;