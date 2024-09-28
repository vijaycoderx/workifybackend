import express from "express";
import userDataService from "../services/userDataService.js";

const router = express.Router();

router.post("/orglist", async (req, res) => {
    const email = req.body.email;
    if (email) {
        const orgListResponse = await userDataService.userOrgList(email);
        console.log("org list res", orgListResponse, email);
        res.send(orgListResponse)
    }
    
})

router.post("/updatepassword", async (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const updatePassRes = await userDataService.updateData(data.email, "password", data.password);

    } catch (error) {
        console.log("err", error)
    }
    

})

export default router;